import Cocoa
import WebKit

final class MainWindowController: NSWindowController, NSWindowDelegate {
    private(set) var webView: WKWebView!
    private var schemeHandler: SchemeHandler?
    private var visualEffectView: NSVisualEffectView!

    convenience init(baseDirectory: URL) {
        // Criar janela nativa com suporte a estilo sem bordas (fullSizeContentView)
        let window = NSWindow(
            contentRect: NSRect(x: 100, y: 100, width: 1440, height: 900),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )

        window.title = "M.C.P PERSONAL OS"
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.isMovableByWindowBackground = true
        window.backgroundColor = .clear
        window.isOpaque = false
        window.minSize = NSSize(width: 480, height: 640)
        window.center()

        self.init(window: window)
        window.delegate = self

        setupViews(baseDirectory: baseDirectory)
    }

    private func setupViews(baseDirectory: URL) {
        guard let window = self.window else { return }

        // 1. Camada de Vidro Líquido Apple (Liquid Glass / Vibrancy)
        visualEffectView = NSVisualEffectView(frame: window.contentView?.bounds ?? .zero)
        visualEffectView.autoresizingMask = [.width, .height]
        visualEffectView.material = .underWindowBackground
        visualEffectView.blendingMode = .behindWindow
        visualEffectView.state = .active
        window.contentView = visualEffectView

        // 2. Criação do WKWebView
        let (wv, sh) = WebEngine.createWebView(baseDirectory: baseDirectory)
        self.webView = wv
        self.schemeHandler = sh

        wv.translatesAutoresizingMaskIntoConstraints = false
        visualEffectView.addSubview(wv)

        NSLayoutConstraint.activate([
            wv.leadingAnchor.constraint(equalTo: visualEffectView.leadingAnchor),
            wv.trailingAnchor.constraint(equalTo: visualEffectView.trailingAnchor),
            wv.topAnchor.constraint(equalTo: visualEffectView.topAnchor),
            wv.bottomAnchor.constraint(equalTo: visualEffectView.bottomAnchor)
        ])

        // 3. Carregar o App pelo protocolo nativo personalos://
        let startUrl = URL(string: "personalos://localhost/index.html")!
        let request = URLRequest(url: startUrl, cachePolicy: .useProtocolCachePolicy, timeoutInterval: 30.0)
        wv.load(request)
    }

    // =========================================================================
    // ⚡ OTIMIZAÇÕES DE CICLO DE VIDA (CONSUMO ULTRA-BAIXO DE CPU E RAM)
    // =========================================================================

    func windowDidResignKey(_ notification: Notification) {
        // Notifica o JavaScript para pausar animações pesadas e shaders WebGL quando fora de foco
        let script = "try { window.dispatchEvent(new Event('blur')); } catch(e){}"
        webView?.evaluateJavaScript(script, completionHandler: nil)
        if #available(macOS 12.0, *) {
            webView?.pauseAllMediaPlayback()
        }
    }

    func windowDidBecomeKey(_ notification: Notification) {
        // Retoma o ciclo normal quando a janela recebe o foco do usuário
        let script = "try { window.dispatchEvent(new Event('focus')); } catch(e){}"
        webView?.evaluateJavaScript(script, completionHandler: nil)
    }

    func windowDidMiniaturize(_ notification: Notification) {
        // Quando minimizado, zera o consumo reduzindo FPS e suspendendo WebGL e mídias
        let script = "try { window.dispatchEvent(new Event('blur')); } catch(e){}"
        webView?.evaluateJavaScript(script, completionHandler: nil)
        if #available(macOS 12.0, *) {
            webView?.pauseAllMediaPlayback()
        }
    }

    func windowDidDeminiaturize(_ notification: Notification) {
        let script = "try { window.dispatchEvent(new Event('focus')); } catch(e){}"
        webView?.evaluateJavaScript(script, completionHandler: nil)
    }

    func reloadApp() {
        let startUrl = URL(string: "personalos://localhost/index.html")!
        webView?.load(URLRequest(url: startUrl))
    }
}
