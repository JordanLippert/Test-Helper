import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Configuração robusta do Tesseract.js para funcionar em produção
 * Resolve problemas de paths e dependências nativas entre máquinas
 */
export class TesseractConfig {
  /**
   * Obtém o caminho correto para o arquivo de idioma
   */
  public static getLanguageDataPath(): string {
    if (app.isPackaged) {
      // Em produção, o arquivo está em extraResources
      return path.join(process.resourcesPath, 'por.traineddata');
    } else {
      // Em desenvolvimento, está na raiz do projeto
      return path.join(process.cwd(), 'por.traineddata');
    }
  }

  /**
   * Verifica se todos os arquivos necessários existem
   */
  public static validateFiles(): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    
    const langPath = this.getLanguageDataPath();
    if (!fs.existsSync(langPath)) {
      missing.push(`Arquivo de idioma: ${langPath}`);
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Obtém informações de debug sobre os paths
   */
  public static getDebugInfo(): Record<string, any> {
    return {
      isPackaged: app.isPackaged,
      appPath: app.getAppPath(),
      resourcesPath: process.resourcesPath,
      cwd: process.cwd(),
      languageDataPath: this.getLanguageDataPath(),
      nodeModulesPath: app.isPackaged 
        ? path.join(process.resourcesPath, 'app.asar', 'node_modules')
        : path.join(process.cwd(), 'node_modules'),
      platform: process.platform,
      arch: process.arch,
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node
    };
  }

  /**
   * Loga informações de debug no console
   */
  public static logDebugInfo(): void {
    const info = this.getDebugInfo();
    console.log('[DEBUG] === Tesseract Configuration Debug ===');
    console.log(JSON.stringify(info, null, 2));
    console.log('[DEBUG] =====================================');
  }
}

