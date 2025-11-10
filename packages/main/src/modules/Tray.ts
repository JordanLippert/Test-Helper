import { Tray, Menu, BrowserWindow, app } from 'electron';
import path from 'node:path';

export class TrayModule {
  private tray: Tray | null = null;
  private settingsWindow: BrowserWindow | null = null;

  public async createTray(): Promise<void> {
    // Criar ícone na bandeja do sistema
    const iconPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'packages', 'main', 'dist', 'assets', 'icon.png')
      : path.join(__dirname, '../assets/icon.png');
    
    this.tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Configurações',
        click: () => this.createSettingsWindow()
      },
      { type: 'separator' },
      {
        label: 'Sair',
        click: () => this.quitApp()
      }
    ]);

    this.tray.setToolTip('Test Helper - Ctrl+T para capturar');
    this.tray.setContextMenu(contextMenu);
  }

  private createSettingsWindow(): void {
    // Se já existir uma janela de configurações, mostrá-la e focá-la
    if (this.settingsWindow) {
      this.settingsWindow.show();
      this.settingsWindow.focus();
      return;
    }

    this.settingsWindow = new BrowserWindow({
      width: 500,
      height: 550,
      resizable: false,
      skipTaskbar: true, // Não aparecer na barra de tarefas
      autoHideMenuBar: true, // Ocultar menu automaticamente
      frame: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js')
      }
    });

    // Remover menu nativo completamente
    this.settingsWindow.removeMenu();

    // CORREÇÃO CRÍTICA: Paths corretos para produção
    if (app.isPackaged) {
      // Em produção, o HTML está dentro do app.asar
      const htmlPath = path.join(process.resourcesPath, 'app.asar', 'packages', 'renderer', 'dist', 'index.html');
      this.settingsWindow.loadFile(htmlPath, {
        hash: '/settings'
      });
    } else {
      // Em desenvolvimento, usa o servidor Vite
      this.settingsWindow.loadURL('http://localhost:5173/#/settings');
    }

    // Ocultar ao perder o foco (clicar fora)
    this.settingsWindow.on('blur', () => {
      if (this.settingsWindow) {
        this.settingsWindow.hide();
      }
    });

    // Ocultar em vez de fechar
    this.settingsWindow.on('close', (event) => {
      event.preventDefault();
      if (this.settingsWindow) {
        this.settingsWindow.hide();
      }
    });
  }

  public quitApp(): void {
    // Fechar todas as janelas e sair do app
    if (this.settingsWindow) {
      this.settingsWindow.destroy();
      this.settingsWindow = null;
    }
    this.destroy();
    app.quit();
  }

  public destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}

