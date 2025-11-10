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
let captureModule: CaptureModule | null = null;

async function initialize() {
  try {
    // Configurar encoding UTF-8 para o console
    if (process.platform === 'win32') {
      try {
        // Tentar configurar code page UTF-8 no Windows
        const { execSync } = require('child_process');
        execSync('chcp 65001', { stdio: 'ignore' });
      } catch (e) {
        // Ignorar erro se chcp falhar
      }
      process.stdout.setDefaultEncoding('utf8');
      process.stderr.setDefaultEncoding('utf8');
    }

    // Criar módulo da bandeja do sistema
    trayInstance = new TrayModule();
    await trayInstance.createTray();

    // Registrar handlers IPC
    const ipcModule = new IPCModule();
    ipcModule.registerHandlers();

    // Criar instância do módulo de captura
    captureModule = new CaptureModule();

    // Registrar atalho global
    globalShortcut.register('CommandOrControl+T', async () => {
      if (captureModule) {
        await captureModule.handleCapture();
      }
    });

    console.log('[OK] Test Helper iniciado com sucesso!');
    console.log('[OK] Pressione Ctrl+T para capturar a tela');

  } catch (error) {
    console.error('[ERRO] Erro na inicializacao:', error);
    app.quit();
  }
}

// Quando o Electron terminar a inicialização
app.whenReady().then(initialize);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // No macOS é comum apps ficarem ativos até que o usuário saia explicitamente
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

