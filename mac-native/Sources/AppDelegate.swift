import Cocoa
import WebKit

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var mainWindowController: MainWindowController?

    func applicationDidFinishLaunching(_ notification: Notification) {
        setupAppIcon()
        setupMainMenu()

        // Localizar a pasta de assets (dentro do bundle em Resources/www ou fallback local)
        let baseDir: URL
        if let bundledWww = Bundle.main.resourceURL?.appendingPathComponent("www"),
           FileManager.default.fileExists(atPath: bundledWww.path) {
            baseDir = bundledWww
        } else {
            // Modo desenvolvimento local
            let cwd = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
            let publicCandidate = cwd.appendingPathComponent("public")
            if FileManager.default.fileExists(atPath: publicCandidate.path) {
                baseDir = publicCandidate
            } else {
                baseDir = cwd
            }
        }

        print("[MCP Personal OS] Carregando assets a partir de: \(baseDir.path)")

        mainWindowController = MainWindowController(baseDirectory: baseDir)
        mainWindowController?.showWindow(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    private func setupAppIcon() {
        if let iconUrl = Bundle.main.url(forResource: "AppIcon", withExtension: "icns") ??
                         Bundle.main.url(forResource: "icon", withExtension: "icns"),
           let iconImg = NSImage(contentsOf: iconUrl) {
            NSApp.applicationIconImage = iconImg
        }
    }

    // =========================================================================
    // 🍎 MENU NATIVO DA APPLE (HUMAN INTERFACE GUIDELINES)
    // =========================================================================

    private func setupMainMenu() {
        let mainMenu = NSMenu()

        // 1. App Menu
        let appMenuItem = NSMenuItem()
        let appMenu = NSMenu()
        appMenu.addItem(NSMenuItem(title: "Sobre o M.C.P Personal OS", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: ""))
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(NSMenuItem(title: "Ocultar M.C.P Personal OS", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h"))
        let hideOthersItem = NSMenuItem(title: "Ocultar Outros", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthersItem.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(hideOthersItem)
        appMenu.addItem(NSMenuItem(title: "Mostrar Tudo", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: ""))
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(NSMenuItem(title: "Encerrar M.C.P Personal OS", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
        appMenuItem.submenu = appMenu
        mainMenu.addItem(appMenuItem)

        // 2. Menu Editar (Copiar, Colar, Recortar e Selecionar no Diário/Inputs)
        let editMenuItem = NSMenuItem()
        let editMenu = NSMenu(title: "Editar")
        editMenu.addItem(NSMenuItem(title: "Desfazer", action: #selector(UndoManager.undo), keyEquivalent: "z"))
        let redoItem = NSMenuItem(title: "Refazer", action: #selector(UndoManager.redo), keyEquivalent: "Z")
        editMenu.addItem(redoItem)
        editMenu.addItem(NSMenuItem.separator())
        editMenu.addItem(NSMenuItem(title: "Recortar", action: #selector(NSText.cut(_:)), keyEquivalent: "x"))
        editMenu.addItem(NSMenuItem(title: "Copiar", action: #selector(NSText.copy(_:)), keyEquivalent: "c"))
        editMenu.addItem(NSMenuItem(title: "Colar", action: #selector(NSText.paste(_:)), keyEquivalent: "v"))
        editMenu.addItem(NSMenuItem(title: "Selecionar Tudo", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a"))
        editMenuItem.submenu = editMenu
        mainMenu.addItem(editMenuItem)

        // 3. Menu Exibir (Recarregar e Tela Cheia)
        let viewMenuItem = NSMenuItem()
        let viewMenu = NSMenu(title: "Exibir")
        let reloadItem = NSMenuItem(title: "Recarregar Página", action: #selector(handleReload), keyEquivalent: "r")
        reloadItem.target = self
        viewMenu.addItem(reloadItem)
        viewMenu.addItem(NSMenuItem.separator())
        viewMenu.addItem(NSMenuItem(title: "Alternar Tela Cheia", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f"))
        let devToolsItem = NSMenuItem(title: "Inspecionar Elemento", action: #selector(handleInspect), keyEquivalent: "i")
        devToolsItem.keyEquivalentModifierMask = [.command, .option]
        devToolsItem.target = self
        viewMenu.addItem(devToolsItem)
        viewMenuItem.submenu = viewMenu
        mainMenu.addItem(viewMenuItem)

        // 4. Menu Janela
        let windowMenuItem = NSMenuItem()
        let windowMenu = NSMenu(title: "Janela")
        windowMenu.addItem(NSMenuItem(title: "Minimizar", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m"))
        windowMenu.addItem(NSMenuItem(title: "Zoom", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: ""))
        windowMenuItem.submenu = windowMenu
        mainMenu.addItem(windowMenuItem)

        NSApp.mainMenu = mainMenu
    }

    @objc private func handleReload() {
        mainWindowController?.reloadApp()
    }

    @objc private func handleInspect() {
        mainWindowController?.webView?.evaluateJavaScript("console.log('[DevTools] Inspeção solicitada');", completionHandler: nil)
    }
}
