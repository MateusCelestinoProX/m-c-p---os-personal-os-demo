import Foundation
import WebKit
import CryptoKit

// Declaração do interceptador de exceções Objective-C nativo (ObjCExceptionCatcher.m)
@_silgen_name("catchException")
@discardableResult
func catchException(_ block: @convention(block) () -> Void) -> Bool

final class SchemeHandler: NSObject, WKURLSchemeHandler {
    private let baseDirectory: URL
    private let cacheDirectory: URL
    private let session: URLSession
    
    // Rastreamento sincronizado de tarefas ativas e downloads em andamento
    private var activeTasks = Set<ObjectIdentifier>()
    private var runningDataTasks = [ObjectIdentifier: URLSessionDataTask]()
    private let lock = NSLock()

    init(baseDirectory: URL) {
        self.baseDirectory = baseDirectory
        
        let cachesUrl = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        self.cacheDirectory = cachesUrl.appendingPathComponent("com.mateuscelestino.personalos/media_cache")
        try? FileManager.default.createDirectory(at: self.cacheDirectory, withIntermediateDirectories: true)

        let sessionConfig = URLSessionConfiguration.default
        sessionConfig.timeoutIntervalForRequest = 30.0
        sessionConfig.timeoutIntervalForResource = 120.0
        sessionConfig.requestCachePolicy = .useProtocolCachePolicy
        // Cache robusto em RAM (128MB) e disco (500MB) para estabilidade total do acervo e fluidez
        let memCapacity = 128 * 1024 * 1024
        let diskCapacity = 500 * 1024 * 1024
        sessionConfig.urlCache = URLCache(memoryCapacity: memCapacity, diskCapacity: diskCapacity, diskPath: "personalos_media_urlcache")
        self.session = URLSession(configuration: sessionConfig)

        super.init()
    }

    // =========================================================================
    // 🚦 CICLO DE VIDA DO WKURLSchemeTask (THREAD-SAFE & ZERO-CRASH)
    // =========================================================================

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        let taskId = ObjectIdentifier(urlSchemeTask)
        
        lock.lock()
        activeTasks.insert(taskId)
        lock.unlock()

        let requestUrl = urlSchemeTask.request.url ?? URL(string: "personalos://localhost/index.html")!

        // 1. ROTEADOR DE PROXY PARA MÍDIAS REMOTAS (IMAGEKIT / SUPABASE)
        if requestUrl.path == "/proxy" {
            handleProxyRequest(urlSchemeTask: urlSchemeTask, taskId: taskId)
            return
        }

        // 2. ROTEADOR DE APIS SERVERLESS (NOTION, IMAGEKIT, GCAL VIA VERCEL BACKEND)
        if requestUrl.path.hasPrefix("/api/") {
            handleApiRequest(urlSchemeTask: urlSchemeTask, taskId: taskId)
            return
        }

        // 3. SERVIDOR DE ARQUIVOS LOCAIS
        handleLocalFileRequest(urlSchemeTask: urlSchemeTask, taskId: taskId)
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
        let taskId = ObjectIdentifier(urlSchemeTask)
        
        lock.lock()
        activeTasks.remove(taskId)
        let dataTask = runningDataTasks.removeValue(forKey: taskId)
        lock.unlock()

        // Cancela imediatamente o download na rede para economizar banda e recursos
        dataTask?.cancel()
    }

    // =========================================================================
    // 🛡️ FINALIZAÇÃO BLINDADA NO MAIN THREAD COM OBJ-C CATCH EXCEPTION
    // =========================================================================

    private func finishTask(urlSchemeTask: WKURLSchemeTask, taskId: ObjectIdentifier, response: URLResponse, data: Data) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.lock.lock()
            guard self.activeTasks.contains(taskId) else {
                self.lock.unlock()
                return
            }
            self.activeTasks.remove(taskId)
            self.runningDataTasks.removeValue(forKey: taskId)
            self.lock.unlock()

            catchException {
                urlSchemeTask.didReceive(response)
                urlSchemeTask.didReceive(data)
                urlSchemeTask.didFinish()
            }
        }
    }

    private func failTask(urlSchemeTask: WKURLSchemeTask, taskId: ObjectIdentifier, statusCode: Int, message: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.lock.lock()
            guard self.activeTasks.contains(taskId) else {
                self.lock.unlock()
                return
            }
            self.activeTasks.remove(taskId)
            self.runningDataTasks.removeValue(forKey: taskId)
            self.lock.unlock()

            let requestUrl = urlSchemeTask.request.url ?? URL(string: "personalos://localhost/")!
            let resp = HTTPURLResponse(
                url: requestUrl,
                statusCode: statusCode,
                httpVersion: "HTTP/1.1",
                headerFields: [
                    "Content-Type": "text/plain; charset=utf-8",
                    "Access-Control-Allow-Origin": "*"
                ]
            ) ?? URLResponse(url: requestUrl, mimeType: "text/plain", expectedContentLength: message.utf8.count, textEncodingName: "utf-8")

            let errData = message.data(using: .utf8) ?? Data()
            catchException {
                urlSchemeTask.didReceive(resp)
                urlSchemeTask.didReceive(errData)
                urlSchemeTask.didFinish()
            }
        }
    }

    // =========================================================================
    // 🌐 PROXY TRANSPARENTE E CACHE LOCAL COM VALIDAÇÃO RÍGIDA DE INTEGRIDADE
    // =========================================================================

    private func handleProxyRequest(urlSchemeTask: WKURLSchemeTask, taskId: ObjectIdentifier) {
        let requestUrl = urlSchemeTask.request.url!
        guard let components = URLComponents(url: requestUrl, resolvingAgainstBaseURL: false),
              let targetUrlStr = components.queryItems?.first(where: { $0.name == "url" })?.value else {
            failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 400, message: "URL remota inválida")
            return
        }

        var parsedUrl: URL? = URL(string: targetUrlStr)
        if parsedUrl == nil {
            if let encoded = targetUrlStr.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed.union(.urlPathAllowed)) {
                parsedUrl = URL(string: encoded)
            }
        }
        guard let initialTargetUrl = parsedUrl else {
            failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 400, message: "URL remota não pôde ser parseada")
            return
        }

        let cacheKey = sha256(initialTargetUrl.absoluteString)
        let ext = initialTargetUrl.pathExtension.isEmpty ? "jpg" : initialTargetUrl.pathExtension
        let cachedFileUrl = cacheDirectory.appendingPathComponent("\(cacheKey).\(ext)")

        let method = urlSchemeTask.request.httpMethod ?? "GET"
        let isGet = method == "GET" || method == "HEAD"

        // 1. Checar cache local existente APENAS para GET de mídias estáticas
        if isGet && FileManager.default.fileExists(atPath: cachedFileUrl.path) {
            if let cachedData = try? Data(contentsOf: cachedFileUrl), cachedData.count > 1024 {
                let mimeType = mimeTypeForExtension(ext.lowercased())
                var headers: [String: String] = [
                    "Content-Type": mimeType,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Expose-Headers": "*",
                    "Cache-Control": "public, max-age=31536000",
                    "Accept-Ranges": "bytes",
                    "X-Proxy-Cache": "HIT"
                ]

                // Suporte nativo a HTTP Range (206 Partial Content) para vídeos e áudios
                let rangeHeader = urlSchemeTask.request.value(forHTTPHeaderField: "Range") ?? urlSchemeTask.request.allHTTPHeaderFields?["Range"]
                if let rangeHeader = rangeHeader, rangeHeader.hasPrefix("bytes=") {
                    let totalLength = cachedData.count
                    let rangeSpec = String(rangeHeader.dropFirst(6))
                    let parts = rangeSpec.split(separator: "-", omittingEmptySubsequences: false)
                    var start = 0
                    var end = totalLength - 1

                    if parts.count >= 1, let s = Int(parts[0]) {
                        start = max(0, min(s, totalLength - 1))
                    }
                    if parts.count >= 2, let e = Int(parts[1]) {
                        end = max(start, min(e, totalLength - 1))
                    } else if parts.count == 2 && parts[0].isEmpty, let suffix = Int(parts[1]) {
                        start = max(0, totalLength - suffix)
                        end = totalLength - 1
                    }

                    let chunkLength = (end - start) + 1
                    if start < totalLength && chunkLength > 0 {
                        let subData = cachedData.subdata(in: start..<(start + chunkLength))
                        headers["Content-Range"] = "bytes \(start)-\(end)/\(totalLength)"
                        headers["Content-Length"] = "\(chunkLength)"

                        if let response = HTTPURLResponse(url: requestUrl, statusCode: 206, httpVersion: "HTTP/1.1", headerFields: headers) {
                            finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: response, data: subData)
                            return
                        }
                    }
                }

                headers["Content-Length"] = "\(cachedData.count)"
                if let response = HTTPURLResponse(url: requestUrl, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: headers) {
                    finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: response, data: cachedData)
                    return
                }
            } else {
                try? FileManager.default.removeItem(at: cachedFileUrl)
            }
        }

        // 2. Extrair corpo da requisição para POST, PATCH, PUT se houver
        var bodyData = urlSchemeTask.request.httpBody
        if bodyData == nil, let stream = urlSchemeTask.request.httpBodyStream {
            stream.open()
            var data = Data()
            let bufferSize = 4096
            let buffer = UnsafeMutablePointer<UInt8>.allocate(capacity: bufferSize)
            defer { buffer.deallocate() }
            while stream.hasBytesAvailable {
                let read = stream.read(buffer, maxLength: bufferSize)
                if read > 0 {
                    data.append(buffer, count: read)
                } else {
                    break
                }
            }
            stream.close()
            bodyData = data
        }

        executeProxyDownload(
            targetUrl: initialTargetUrl,
            originalTargetStr: targetUrlStr,
            isRetry: false,
            bodyData: bodyData,
            urlSchemeTask: urlSchemeTask,
            taskId: taskId,
            requestUrl: requestUrl,
            cachedFileUrl: cachedFileUrl,
            isGet: isGet,
            method: method,
            ext: ext
        )
    }

    private func executeProxyDownload(
        targetUrl: URL,
        originalTargetStr: String,
        isRetry: Bool,
        bodyData: Data?,
        urlSchemeTask: WKURLSchemeTask,
        taskId: ObjectIdentifier,
        requestUrl: URL,
        cachedFileUrl: URL,
        isGet: Bool,
        method: String,
        ext: String
    ) {
        var remoteRequest = URLRequest(url: targetUrl)
        remoteRequest.httpMethod = method
        if let allHeaders = urlSchemeTask.request.allHTTPHeaderFields {
            for (k, v) in allHeaders where k.lowercased() != "host" {
                remoteRequest.setValue(v, forHTTPHeaderField: k)
            }
        }
        remoteRequest.httpBody = bodyData

        let task = session.dataTask(with: remoteRequest) { [weak self] data, response, error in
            guard let self = self else { return }

            let httpResponse = response as? HTTPURLResponse
            let statusCode = httpResponse?.statusCode ?? 500

            // Se for requisição GET de imagem/mídia e retornar 404, tentamos a variação NFD/NFC
            if isGet && statusCode == 404 && !isRetry {
                let nfd = originalTargetStr.decomposedStringWithCanonicalMapping
                let nfc = originalTargetStr.precomposedStringWithCanonicalMapping
                let altTargetStr = (originalTargetStr == nfd) ? nfc : nfd

                if altTargetStr != originalTargetStr, let altUrl = URL(string: altTargetStr) ?? URL(string: altTargetStr.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed.union(.urlPathAllowed)) ?? "") {
                    self.executeProxyDownload(
                        targetUrl: altUrl,
                        originalTargetStr: altTargetStr,
                        isRetry: true,
                        bodyData: bodyData,
                        urlSchemeTask: urlSchemeTask,
                        taskId: taskId,
                        requestUrl: requestUrl,
                        cachedFileUrl: cachedFileUrl,
                        isGet: isGet,
                        method: method,
                        ext: ext
                    )
                    return
                }
            }

            guard let data = data, let httpResponse = httpResponse, error == nil else {
                let errMsg = error?.localizedDescription ?? "Falha de rede ao conectar à URL remota"
                let jsonErr = "{\"message\":\"\(errMsg)\"}".data(using: .utf8) ?? Data()
                let errResp = HTTPURLResponse(
                    url: requestUrl,
                    statusCode: 502,
                    httpVersion: "HTTP/1.1",
                    headerFields: [
                        "Content-Type": "application/json; charset=utf-8",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Expose-Headers": "*"
                    ]
                )!
                self.finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: errResp, data: jsonErr)
                return
            }

            let mimeType = httpResponse.mimeType ?? self.mimeTypeForExtension(ext.lowercased())

            // Salvar no cache APENAS se for mídia válida e requisição GET
            let isMedia = mimeType.starts(with: "image/") || mimeType.starts(with: "video/") || mimeType.starts(with: "audio/") || mimeType.contains("octet-stream")
            if isGet && httpResponse.statusCode == 200 && data.count > 1024 && isMedia {
                DispatchQueue.global(qos: .utility).async {
                    try? data.write(to: cachedFileUrl, options: .atomic)
                }
            }

            var headers = httpResponse.allHeaderFields as? [String: String] ?? [:]
            headers["Access-Control-Allow-Origin"] = "*"
            headers["Access-Control-Expose-Headers"] = "*"
            if headers["Content-Type"] == nil {
                headers["Content-Type"] = mimeType
            }
            if isGet && isMedia {
                headers["Cache-Control"] = "public, max-age=31536000"
                headers["X-Proxy-Cache"] = "MISS"
            }

            guard let clientResponse = HTTPURLResponse(
                url: requestUrl,
                statusCode: httpResponse.statusCode,
                httpVersion: "HTTP/1.1",
                headerFields: headers
            ) else {
                self.failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 500, message: "Erro ao gerar resposta proxy")
                return
            }

            self.finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: clientResponse, data: data)
        }

        lock.lock()
        if activeTasks.contains(taskId) {
            runningDataTasks[taskId] = task
            lock.unlock()
            task.resume()
        } else {
            lock.unlock()
        }
    }

    // =========================================================================
    // 🌐 ROTEADOR DE APIS SERVERLESS (NOTION, IMAGEKIT, GCAL VIA VERCEL BACKEND)
    // =========================================================================

    private func handleApiRequest(urlSchemeTask: WKURLSchemeTask, taskId: ObjectIdentifier) {
        let requestUrl = urlSchemeTask.request.url!
        let apiBase = "https://m-c-p-os-personal-os-1.vercel.app"
        
        var pathAndQuery = requestUrl.path
        if let query = requestUrl.query, !query.isEmpty {
            pathAndQuery += "?" + query
        }

        guard let remoteUrl = URL(string: apiBase + pathAndQuery) else {
            failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 400, message: "URL de API inválida")
            return
        }

        var remoteRequest = URLRequest(url: remoteUrl)
        remoteRequest.httpMethod = urlSchemeTask.request.httpMethod ?? "GET"

        // Copiar cabeçalhos da requisição original
        if let allHeaders = urlSchemeTask.request.allHTTPHeaderFields {
            for (k, v) in allHeaders where k.lowercased() != "host" {
                remoteRequest.setValue(v, forHTTPHeaderField: k)
            }
        }

        // Copiar corpo da requisição (POST / PATCH / PUT)
        var bodyData = urlSchemeTask.request.httpBody
        if bodyData == nil, let stream = urlSchemeTask.request.httpBodyStream {
            stream.open()
            var data = Data()
            let bufferSize = 4096
            let buffer = UnsafeMutablePointer<UInt8>.allocate(capacity: bufferSize)
            defer { buffer.deallocate() }
            while stream.hasBytesAvailable {
                let read = stream.read(buffer, maxLength: bufferSize)
                if read > 0 {
                    data.append(buffer, count: read)
                } else {
                    break
                }
            }
            stream.close()
            bodyData = data
        }
        remoteRequest.httpBody = bodyData

        let task = session.dataTask(with: remoteRequest) { [weak self] data, response, error in
            guard let self = self else { return }

            guard let data = data, let httpResponse = response as? HTTPURLResponse, error == nil else {
                let errMsg = error?.localizedDescription ?? "Falha de rede ao conectar à API do Notion"
                let jsonErr = "{\"ok\":false,\"error\":\"\(errMsg)\"}".data(using: .utf8) ?? Data()
                let errResp = HTTPURLResponse(
                    url: requestUrl,
                    statusCode: 502,
                    httpVersion: "HTTP/1.1",
                    headerFields: [
                        "Content-Type": "application/json; charset=utf-8",
                        "Access-Control-Allow-Origin": "*"
                    ]
                )!
                self.finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: errResp, data: jsonErr)
                return
            }

            var headers = httpResponse.allHeaderFields as? [String: String] ?? [:]
            headers["Access-Control-Allow-Origin"] = "*"
            if headers["Content-Type"] == nil {
                headers["Content-Type"] = "application/json; charset=utf-8"
            }

            guard let clientResponse = HTTPURLResponse(
                url: requestUrl,
                statusCode: httpResponse.statusCode,
                httpVersion: "HTTP/1.1",
                headerFields: headers
            ) else {
                self.failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 500, message: "Erro de resposta da API")
                return
            }

            self.finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: clientResponse, data: data)
        }

        lock.lock()
        if activeTasks.contains(taskId) {
            runningDataTasks[taskId] = task
            lock.unlock()
            task.resume()
        } else {
            lock.unlock()
        }
    }

    // =========================================================================
    // 📁 SERVIDOR DE ARQUIVOS LOCAIS (OFFLINE BUNDLE)
    // =========================================================================

    private func handleLocalFileRequest(urlSchemeTask: WKURLSchemeTask, taskId: ObjectIdentifier) {
        let requestUrl = urlSchemeTask.request.url!
        var relativePath = requestUrl.path

        if relativePath.isEmpty || relativePath == "/" {
            relativePath = "/index.html"
        }

        let cleanPath = relativePath.hasPrefix("/") ? String(relativePath.dropFirst()) : relativePath
        var fileUrl = baseDirectory.appendingPathComponent(cleanPath).standardized

        if !FileManager.default.fileExists(atPath: fileUrl.path) {
            let htmlUrl = baseDirectory.appendingPathComponent(cleanPath + ".html").standardized
            if FileManager.default.fileExists(atPath: htmlUrl.path) {
                fileUrl = htmlUrl
            }
        }

        guard fileUrl.path.hasPrefix(baseDirectory.path) else {
            failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 403, message: "Acesso Negado")
            return
        }

        guard FileManager.default.fileExists(atPath: fileUrl.path) else {
            failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 404, message: "Arquivo não encontrado: \(cleanPath)")
            return
        }

        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            do {
                let data = try Data(contentsOf: fileUrl, options: .alwaysMapped)
                let mimeType = self.mimeTypeForExtension(fileUrl.pathExtension.lowercased())

                var headers: [String: String] = [
                    "Content-Type": mimeType,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                    "Cache-Control": "public, max-age=3600",
                    "Accept-Ranges": "bytes"
                ]

                // Suporte a HTTP Range para mídias locais (MP4/WebM/MP3)
                let rangeHeader = urlSchemeTask.request.value(forHTTPHeaderField: "Range") ?? urlSchemeTask.request.allHTTPHeaderFields?["Range"]
                if let rangeHeader = rangeHeader, rangeHeader.hasPrefix("bytes=") {
                    let totalLength = data.count
                    let rangeSpec = String(rangeHeader.dropFirst(6))
                    let parts = rangeSpec.split(separator: "-", omittingEmptySubsequences: false)
                    var start = 0
                    var end = totalLength - 1

                    if parts.count >= 1, let s = Int(parts[0]) {
                        start = max(0, min(s, totalLength - 1))
                    }
                    if parts.count >= 2, let e = Int(parts[1]) {
                        end = max(start, min(e, totalLength - 1))
                    } else if parts.count == 2 && parts[0].isEmpty, let suffix = Int(parts[1]) {
                        start = max(0, totalLength - suffix)
                        end = totalLength - 1
                    }

                    let chunkLength = (end - start) + 1
                    if start < totalLength && chunkLength > 0 {
                        let subData = data.subdata(in: start..<(start + chunkLength))
                        headers["Content-Range"] = "bytes \(start)-\(end)/\(totalLength)"
                        headers["Content-Length"] = "\(chunkLength)"

                        if let response = HTTPURLResponse(url: requestUrl, statusCode: 206, httpVersion: "HTTP/1.1", headerFields: headers) {
                            self.finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: response, data: subData)
                            return
                        }
                    }
                }

                headers["Content-Length"] = "\(data.count)"
                guard let response = HTTPURLResponse(
                    url: requestUrl,
                    statusCode: 200,
                    httpVersion: "HTTP/1.1",
                    headerFields: headers
                ) else {
                    self.failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 500, message: "Erro de cabeçalho")
                    return
                }

                self.finishTask(urlSchemeTask: urlSchemeTask, taskId: taskId, response: response, data: data)
            } catch {
                self.failTask(urlSchemeTask: urlSchemeTask, taskId: taskId, statusCode: 500, message: "Erro interno ao ler arquivo local")
            }
        }
    }

    private func sha256(_ string: String) -> String {
        let data = Data(string.utf8)
        let hash = SHA256.hash(data: data)
        return hash.compactMap { String(format: "%02x", $0) }.joined()
    }

    private func mimeTypeForExtension(_ ext: String) -> String {
        switch ext {
        case "html", "htm":
            return "text/html; charset=utf-8"
        case "js", "mjs":
            return "application/javascript; charset=utf-8"
        case "css":
            return "text/css; charset=utf-8"
        case "json":
            return "application/json; charset=utf-8"
        case "png":
            return "image/png"
        case "jpg", "jpeg":
            return "image/jpeg"
        case "gif":
            return "image/gif"
        case "svg":
            return "image/svg+xml"
        case "webp":
            return "image/webp"
        case "heic":
            return "image/heic"
        case "ico":
            return "image/x-icon"
        case "mp4":
            return "video/mp4"
        case "webm":
            return "video/webm"
        case "mov":
            return "video/quicktime"
        case "mp3":
            return "audio/mpeg"
        case "wav":
            return "audio/wav"
        case "ogg":
            return "audio/ogg"
        case "woff":
            return "font/woff"
        case "woff2":
            return "font/woff2"
        case "ttf":
            return "font/ttf"
        case "otf":
            return "font/otf"
        case "pdf":
            return "application/pdf"
        default:
            return "application/octet-stream"
        }
    }
}
