import Foundation
import WebKit

final class ConsoleLogHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ ucc: WKUserContentController, didReceive message: WKScriptMessage) {
        if let body = message.body as? String {
            print("[WebConsole] \(body)")
        }
    }
}

final class WebEngine {
    private static let consoleHandler = ConsoleLogHandler()

    static func createWebView(baseDirectory: URL) -> (WKWebView, SchemeHandler) {
        let config = WKWebViewConfiguration()

        // 1. Registrar Scheme Handler interno personalos:// com proxy de mídia nativo blindado
        let schemeHandler = SchemeHandler(baseDirectory: baseDirectory)
        config.setURLSchemeHandler(schemeHandler, forURLScheme: "personalos")

        // 1.1 Registrar ponte de logs do console para o sistema
        config.userContentController.add(consoleHandler, name: "consoleBridge")

        // 2. Otimizações de WebKit e WebGL para Apple Silicon (Metal)
        let preferences = WKPreferences()
        preferences.setValue(true, forKey: "developerExtrasEnabled")
        preferences.setValue(true, forKey: "webGLEnabled")
        preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        preferences.setValue(true, forKey: "fullScreenEnabled")
        config.preferences = preferences

        // Autoplay fluido de mídias e decodificação por hardware nativo
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsAirPlayForMediaPlayback = false

        // 3. Persistência de LocalStorage, Cookies e Cache (Default Store)
        config.websiteDataStore = WKWebsiteDataStore.default()

        // 4. Injeção de Proxy Transparente e Ambiente Nativo macOS
        let userScriptSource = """
        (function() {
            window.__IS_NATIVE_APP__ = true;
            window.__MACOS_NATIVE__ = true;
            window.__APPLE_SILICON__ = true;

            // Ponte de console para terminal nativo
            ['log', 'warn', 'error'].forEach(fn => {
                const orig = console[fn];
                console[fn] = function(...args) {
                    try { orig.apply(console, args); } catch(e) {}
                    try {
                        const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                        window.webkit.messageHandlers.consoleBridge.postMessage(`[${fn.toUpperCase()}] ${msg}`);
                    } catch(e) {}
                };
            });

            const PROXY_PREFIX = 'personalos://localhost/proxy?url=';

            function shouldProxy(url) {
                if (!url || typeof url !== 'string') return false;
                if (url.startsWith('data:') || url.startsWith('blob:')) return false;
                if (url.startsWith(PROXY_PREFIX)) return false;
                if (url.startsWith('personalos://')) return false;
                // Faz proxy transparente de todas as requisições remotas (Supabase REST, Notion, ImageKit, CDNs)
                return url.startsWith('http://') || url.startsWith('https://');
            }

            function toProxyUrl(url) {
                if (shouldProxy(url)) {
                    let clean = url;
                    if (clean.includes('ik.imagekit.io')) {
                        try { clean = clean.normalize('NFD'); } catch(e) {}
                    }
                    return PROXY_PREFIX + encodeURIComponent(clean);
                }
                return url;
            }

            window.toProxyUrl = toProxyUrl;

            // D. Interceptador de elementos HTML de mídia (<img>, <video>, <audio>) para exibir no macOS
            try {
                const origImgSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
                if (origImgSrc && origImgSrc.set) {
                    Object.defineProperty(HTMLImageElement.prototype, 'src', {
                        get: function() { return origImgSrc.get.call(this); },
                        set: function(val) {
                            origImgSrc.set.call(this, toProxyUrl(val));
                        },
                        configurable: true,
                        enumerable: true
                    });
                }
            } catch(e) {}

            try {
                const origMediaSrc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
                if (origMediaSrc && origMediaSrc.set) {
                    Object.defineProperty(HTMLMediaElement.prototype, 'src', {
                        get: function() { return origMediaSrc.get.call(this); },
                        set: function(val) {
                            origMediaSrc.set.call(this, toProxyUrl(val));
                        },
                        configurable: true,
                        enumerable: true
                    });
                }
            } catch(e) {}

            try {
                const origSetAttr = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, val) {
                    if ((name === 'src' || name === 'data-src' || name === 'poster') && typeof val === 'string' && shouldProxy(val)) {
                        val = toProxyUrl(val);
                    }
                    return origSetAttr.call(this, name, val);
                };
            } catch(e) {}

            // E. Varredura contínua via MutationObserver para tags criadas via innerHTML ou marked.js
            function rewriteMediaUrls(root) {
                if (!root) return;
                const els = root.querySelectorAll ? root.querySelectorAll('img[src], video[src], audio[src], source[src]') : [];
                for (let i = 0; i < els.length; i++) {
                    const el = els[i];
                    const src = el.getAttribute('src');
                    if (src && shouldProxy(src)) {
                        el.setAttribute('src', toProxyUrl(src));
                    }
                }
            }

            const domObserver = new MutationObserver((mutations) => {
                for (let i = 0; i < mutations.length; i++) {
                    const m = mutations[i];
                    if (m.type === 'childList') {
                        for (let j = 0; j < m.addedNodes.length; j++) {
                            const node = m.addedNodes[j];
                            if (node && node.nodeType === 1) {
                                if (node.tagName === 'IMG' || node.tagName === 'VIDEO' || node.tagName === 'AUDIO') {
                                    const src = node.getAttribute('src');
                                    if (src && shouldProxy(src)) node.setAttribute('src', toProxyUrl(src));
                                }
                                rewriteMediaUrls(node);
                            }
                        }
                    } else if (m.type === 'attributes' && m.attributeName === 'src') {
                        const src = m.target.getAttribute('src');
                        if (src && shouldProxy(src)) {
                            m.target.setAttribute('src', toProxyUrl(src));
                        }
                    }
                }
            });

            function injectMacOsEnhancements() {
                if (document.documentElement) {
                    document.documentElement.classList.add('is-macos-desktop-app');
                    rewriteMediaUrls(document.body || document.documentElement);
                    try {
                        domObserver.observe(document.documentElement, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeFilter: ['src']
                        });
                    } catch(e) {}
                }
                // Scrollbar hairline ultra-fina (1px) nativa direta para o macOS Desktop App
                if (!document.getElementById('macos-scrollbar-ultra-thin')) {
                    const scrollStyle = document.createElement('style');
                    scrollStyle.id = 'macos-scrollbar-ultra-thin';
                    scrollStyle.textContent = `
                        ::-webkit-scrollbar {
                            width: 1px !important;
                            height: 1px !important;
                        }
                        ::-webkit-scrollbar-track {
                            background: transparent !important;
                        }
                        ::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.25) !important;
                            border-radius: 9999px !important;
                        }
                        ::-webkit-scrollbar-thumb:hover {
                            background: rgba(255, 255, 255, 0.6) !important;
                        }
                        ::-webkit-scrollbar-corner {
                            background: transparent !important;
                        }
                        #editor-main-content-container::-webkit-scrollbar {
                            width: 1px !important;
                            height: 1px !important;
                        }
                        #editor-main-content-container::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.25) !important;
                            border-radius: 9999px !important;
                        }
                        #entries-list-container::-webkit-scrollbar {
                            width: 1px !important;
                            height: 1px !important;
                        }
                        #entries-list-container::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.25) !important;
                            border-radius: 9999px !important;
                        }
                        * {
                            scrollbar-width: thin !important;
                            scrollbar-color: rgba(255, 255, 255, 0.25) transparent !important;
                        }
                    `;
                    (document.head || document.documentElement).appendChild(scrollStyle);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', injectMacOsEnhancements);
            } else {
                injectMacOsEnhancements();
            }

            // F. Interceptador universal de fetch para todas as requisições de API remotas (Supabase, Notion, GCal)
            const origFetch = window.fetch;
            window.fetch = function(input, init) {
                let targetUrl = '';
                if (typeof input === 'string') {
                    targetUrl = input;
                } else if (input && typeof input.url === 'string') {
                    targetUrl = input.url;
                }

                if (shouldProxy(targetUrl)) {
                    const proxiedUrl = toProxyUrl(targetUrl);
                    if (typeof input === 'string') {
                        return origFetch(proxiedUrl, init);
                    } else if (input && typeof input === 'object') {
                        try {
                            const newReq = new Request(proxiedUrl, input);
                            return origFetch(newReq, init);
                        } catch(e) {
                            return origFetch(proxiedUrl, init);
                        }
                    }
                }
                return origFetch(input, init);
            };

            // G. Interceptador de XMLHttpRequest para compatibilidade total com SDKs legados
            const origXhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                if (typeof url === 'string' && shouldProxy(url)) {
                    url = toProxyUrl(url);
                }
                return origXhrOpen.call(this, method, url, ...rest);
            };

            console.log('⚡ [MCP Personal OS] Motor Nativo Swift + Proxy Transparente de Mídia Blindado Ativo!');
        })();
        """
        let userScript = WKUserScript(
            source: userScriptSource,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: false
        )
        config.userContentController.addUserScript(userScript)

        // 5. Instanciação com transparência para Glassmorphism no macOS e aceleração CoreAnimation
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.setValue(false, forKey: "drawsBackground")
        webView.allowsBackForwardNavigationGestures = false
        webView.allowsMagnification = false
        webView.wantsLayer = true
        webView.layerContentsRedrawPolicy = .onSetNeedsDisplay

        return (webView, schemeHandler)
    }
}
