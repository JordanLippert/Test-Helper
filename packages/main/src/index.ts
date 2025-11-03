import { app, globalShortcut } from 'electron';
import { TrayModule } from './modules/Tray';
import { CaptureModule } from './modules/Capture';
import { IPCModule } from './modules/IPC';

// Impedir múltiplas instâncias do app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

// Mantenha uma referência global do objeto window
let trayInstance: TrayModule | null = null;

async function initialize() {
  try {
    // Criar módulo da bandeja do sistema
    trayInstance = new TrayModule();
    await trayInstance.createTray();

    // Registrar handlers IPC
    const ipcModule = new IPCModule();
    ipcModule.registerHandlers();

    // Registrar atalho global
    globalShortcut.register('CommandOrControl+T', async () => {
      const captureModule = new CaptureModule();
      await captureModule.handleCapture();
    });

  } catch (error) {
    console.error('Erro na inicialização:', error);
    app.quit();
  }
}

// Quando o Electron terminar a inicialização
app.whenReady().then(initialize);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Limpar recursos na saída
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (trayInstance) {
    trayInstance.destroy();
  }
});