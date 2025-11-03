import { ipcMain, app, globalShortcut } from 'electron';
import Store from 'electron-store';

export class IPCModule {
  private store: Store;

  constructor() {
    this.store = new Store();
    // Definir valores padrão
    if (this.store.get('app-enabled') === undefined) {
      this.store.set('app-enabled', true);
    }
  }

  public registerHandlers(): void {
    // Handler para salvar a chave da API
    ipcMain.handle('save-api-key', async (_event, key: string) => {
      try {
        if (!key || typeof key !== 'string') {
          throw new Error('Chave da API inválida');
        }
        
        this.store.set('openai-key', key);
        
      } catch (error) {
        console.error('Erro ao salvar a chave da API:', error);
        throw error;
      }
    });

    // Handler para obter a chave da API
    ipcMain.handle('get-api-key', async () => {
      try {
        const key = this.store.get('openai-key');
        return key || '';
        
      } catch (error) {
        console.error('Erro ao obter a chave da API:', error);
        throw error;
      }
    });

    // Handler para ligar/desligar o app
    ipcMain.handle('toggle-app', async (_event, enabled: boolean) => {
      try {
        this.store.set('app-enabled', enabled);
        
        if (enabled) {
          // Registrar atalho global novamente
          globalShortcut.register('CommandOrControl+T', () => {
            // O handler de captura já está registrado no index.ts
          });
        } else {
          // Remover atalho global
          globalShortcut.unregister('CommandOrControl+T');
        }
        
      } catch (error) {
        console.error('Erro ao alternar estado do app:', error);
        throw error;
      }
    });

    // Handler para obter o estado do app
    ipcMain.handle('get-app-status', async () => {
      try {
        const enabled = this.store.get('app-enabled', true);
        return enabled;
        
      } catch (error) {
        console.error('Erro ao obter estado do app:', error);
        throw error;
      }
    });

    // Handler para sair do app
    ipcMain.handle('quit-app', async () => {
      app.quit();
    });
  }
}