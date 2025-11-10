import { contextBridge, ipcRenderer } from 'electron';

// Tipagem para a API exposta
interface ElectronAPI {
  saveKey: (key: string) => Promise<void>;
  getKey: () => Promise<string>;
  toggleApp: (enabled: boolean) => Promise<void>;
  getAppStatus: () => Promise<boolean>;
  quitApp: () => Promise<void>;
  onShowResponse: (callback: (data: { 
    status: 'success' | 'error';
    message: string;
  }) => void) => () => void;
}

// Expor funções seguras para o processo de renderização
contextBridge.exposeInMainWorld('electronAPI', {
  // Funções que o renderer pode invocar
  saveKey: (key: string) => ipcRenderer.invoke('save-api-key', key),
  getKey: () => ipcRenderer.invoke('get-api-key'),
  toggleApp: (enabled: boolean) => ipcRenderer.invoke('toggle-app', enabled),
  getAppStatus: () => ipcRenderer.invoke('get-app-status'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  // Funções para ouvir eventos do processo principal
  onShowResponse: (callback: (data: { 
    status: 'success' | 'error';
    message: string;
  }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: any) => callback(data);
    ipcRenderer.on('show-response', listener);
    
    // Retorna uma função de limpeza
    return () => {
      ipcRenderer.removeListener('show-response', listener);
    };
  }
} as ElectronAPI);

