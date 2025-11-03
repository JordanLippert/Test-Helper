import { desktopCapturer, BrowserWindow } from 'electron';
import path from 'node:path';
import activeWindow from 'active-win';
import { Jimp } from 'jimp';
import * as Tesseract from 'tesseract.js';
import { AIModule } from './AI';

export class CaptureModule {
  private popupWindow: BrowserWindow | null = null;

  public async handleCapture(): Promise<void> {
    try {
      // 1. Obter informações da janela ativa
      const windowInfo = await activeWindow();
      if (!windowInfo) {
        throw new Error('Não foi possível detectar a janela ativa');
      }

      // 2. Calcular o retângulo de captura (12% topo, 1.5% lados, 4% baixo)
      const captureRect = {
        x: Math.round(windowInfo.bounds.x + (windowInfo.bounds.width * 0.015)),
        y: Math.round(windowInfo.bounds.y + (windowInfo.bounds.height * 0.12)),
        width: Math.round(windowInfo.bounds.width * 0.97),
        height: Math.round(windowInfo.bounds.height * 0.84)
      };

      // 3. Criar e mostrar popup de loading
      await this.showLoadingPopup();

      // 4. Capturar a tela
      const sources = await desktopCapturer.getSources({
        types: ['window'],
        thumbnailSize: {
          width: windowInfo.bounds.width,
          height: windowInfo.bounds.height
        }
      });

      const targetSource = sources.find(source => 
        source.name === windowInfo.title
      );

      if (!targetSource) {
        throw new Error('Não foi possível capturar a janela alvo');
      }

      // 5. Processar a imagem com Jimp
      const image = await Jimp.read(targetSource.thumbnail.toDataURL());
      
      // Cortar a imagem usando o retângulo calculado
      const croppedImage = image.crop({
        x: captureRect.x - windowInfo.bounds.x,
        y: captureRect.y - windowInfo.bounds.y,
        w: captureRect.width,
        h: captureRect.height
      });

      // Converter para buffer
      const imageBuffer = await croppedImage.getBuffer('image/png');

      // 6. Executar OCR
      const { data: { text } } = await Tesseract.recognize(
        imageBuffer,
        'por',
        { logger: () => {} }
      );

      if (!text.trim()) {
        throw new Error('Não foi possível extrair texto da imagem');
      }

      // 7. Obter resposta da IA
      const aiModule = new AIModule();
      const answer = await aiModule.getAnswer(text);

      // 8. Mostrar resposta
      if (this.popupWindow) {
        this.popupWindow.webContents.send('show-response', {
          status: 'success',
          message: answer
        });
      }

    } catch (error) {
      if (this.popupWindow) {
        this.popupWindow.webContents.send('show-response', {
          status: 'error',
          message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
      console.error('Erro na captura:', error);
    }
  }

  private async showLoadingPopup(): Promise<void> {
    this.popupWindow = new BrowserWindow({
      width: 400,
      height: 200,
      frame: false,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js')
      }
    });

    if (process.env.NODE_ENV === 'development') {
      await this.popupWindow.loadURL('http://localhost:5173/popup');
    } else {
      await this.popupWindow.loadFile(
        path.join(__dirname, '../../renderer/dist/index.html'),
        { hash: '/popup' }
      );
    }
  }
}