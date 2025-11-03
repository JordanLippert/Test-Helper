export {};

declare global {
  interface Window {
    electronAPI: {
      saveKey: (key: string) => Promise<void>;
      getKey: () => Promise<string>;
      toggleApp: (enabled: boolean) => Promise<void>;
      getAppStatus: () => Promise<boolean>;
      quitApp: () => Promise<void>;
      onShowResponse: (callback: (data: { status: 'success' | 'error'; message: string }) => void) => void;
    };
  }
}