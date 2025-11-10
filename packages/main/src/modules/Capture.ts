import { desktopCapturer, BrowserWindow, app } from 'electron';
import path from 'node:path';
import os from 'node:os';
import activeWindow from 'active-win';
import { Jimp } from 'jimp';
import * as Tesseract from 'tesseract.js';
import { AIModule } from './AI';
import { TesseractConfig } from './TesseractConfig';
import { TextParser } from './TextParser';
import Store from 'electron-store';

export class CaptureModule {
  private popupWindow: BrowserWindow | null = null;
  private readonly store: Store;

  constructor() {
    this.store = new Store();
  }

  public async handleCapture(): Promise<void> {
    try {
      // Verificar se o app está habilitado
      const appEnabled = this.store.get('app-enabled', true);
      if (!appEnabled) {
        console.log('[AVISO] App esta desativado. Captura cancelada.');
        console.log('[INFO] Para usar o app, ative-o nas Configuracoes.');
        
        // Mostrar popup informativo
        await this.showLoadingPopup();
        if (this.popupWindow) {
          this.showResponsePopup();
          this.popupWindow.webContents.send('show-response', {
            status: 'error',
            message: 'App desativado. Ative nas Configurações para usar.'
          });
        }
        return;
      }

      // Validar arquivos do Tesseract
      const validation = TesseractConfig.validateFiles();
      if (!validation.valid) {
        console.error('[ERRO] Arquivos necessarios nao encontrados:');
        for (const file of validation.missing) {
          console.error('  -', file);
        }
        TesseractConfig.logDebugInfo();
        
        throw new Error('Arquivos de OCR não encontrados. Por favor, reinstale o aplicativo.');
      }

      console.log('[OK] Validacao do Tesseract OK');
      if (process.env.DEBUG) {
        TesseractConfig.logDebugInfo();
      }

      // 1. Obter informações da janela ativa
      const windowInfo = await activeWindow();
      if (!windowInfo) {
        throw new Error('Não foi possível detectar a janela ativa');
      }

      console.log('[CAPTURA] Dimensoes da janela (logicas):', windowInfo.bounds.width, 'x', windowInfo.bounds.height);

      // 2. Detectar o fator de escala do display (DPI scaling)
      const { screen } = require('electron');
      const primaryDisplay = screen.getPrimaryDisplay();
      const scaleFactor = primaryDisplay.scaleFactor;
      
      console.log('[CAPTURA] Fator de escala do display:', scaleFactor, '(' + (scaleFactor * 100) + '%)');

      // 3. Capturar a tela ANTES para obter as dimensões reais
      const sources = await desktopCapturer.getSources({
        types: ['window'],
        thumbnailSize: {
          width: Math.round(windowInfo.bounds.width * scaleFactor * 2), // 2x para garantir qualidade
          height: Math.round(windowInfo.bounds.height * scaleFactor * 2)
        }
      });

      const targetSource = sources.find(source => 
        source.name === windowInfo.title
      );

      if (!targetSource) {
        throw new Error('Não foi possível capturar a janela alvo');
      }

      // 4. Obter dimensões reais da captura
      const captureWidth = targetSource.thumbnail.getSize().width;
      const captureHeight = targetSource.thumbnail.getSize().height;
      
      console.log('[CAPTURA] Dimensoes da captura (fisicas):', captureWidth, 'x', captureHeight);

      // 5. Calcular offsets baseados na altura da captura real
      // Offsets ajustados para pular barra de navegação, abas e rodapé
      let topOffset: number;
      let bottomOffset: number;
      const leftOffset = 0.05; // 5% lateral esquerda (aumentado para pular bordas)
      const rightOffset = 0.05; // 5% lateral direita (aumentado para pular bordas)
      
      if (captureHeight < 900) {
        topOffset = 0.12; // 12% para telas pequenas
        bottomOffset = 0.08; // 8% para telas pequenas
        console.log('[CAPTURA] Tela pequena detectada, ajustando offsets');
      } else if (captureHeight < 1500) {
        topOffset = 0.13; // 13% para telas pequenas/médias
        bottomOffset = 0.09; // 9% para telas pequenas/médias
        console.log('[CAPTURA] Tela pequena/media detectada, ajustando offsets');
      } else if (captureHeight < 2200) {
        topOffset = 0.14; // 14% para telas médias
        bottomOffset = 0.1; // 10% para telas médias
        console.log('[CAPTURA] Tela media detectada, ajustando offsets');
      } else {
        topOffset = 0.16; // 16% para telas muito grandes (pular mais)
        bottomOffset = 0.12; // 12% para telas muito grandes (pular rodapé maior)
        console.log('[CAPTURA] Tela grande detectada (alta resolucao), usando offsets aumentados');
      }
      
      console.log('[CAPTURA] Offsets aplicados - Top:', Math.round(topOffset * 100) + '%, Bottom:', Math.round(bottomOffset * 100) + '%, Left/Right:', Math.round(leftOffset * 100) + '%');

      // 6. Calcular o retângulo de corte nas coordenadas da captura
      const captureRect = {
        x: Math.round(captureWidth * leftOffset),
        y: Math.round(captureHeight * topOffset),
        width: Math.round(captureWidth * (1 - leftOffset - rightOffset)),
        height: Math.round(captureHeight * (1 - topOffset - bottomOffset))
      };

      console.log('[CAPTURA] Retangulo de corte:', captureRect);

      // 7. Criar e mostrar popup de loading
      await this.showLoadingPopup();

      // 8. Processar a imagem com Jimp
      console.log('[PROCESSAMENTO] Processando imagem capturada...');
      const image = await Jimp.read(targetSource.thumbnail.toDataURL());
      
      console.log('[PROCESSAMENTO] Dimensoes da imagem original:', image.bitmap.width, 'x', image.bitmap.height);
      
      // Cortar a imagem usando o retângulo calculado (já em coordenadas da captura)
      const croppedImage = image.crop({
        x: captureRect.x,
        y: captureRect.y,
        w: captureRect.width,
        h: captureRect.height
      });

      console.log('[PROCESSAMENTO] Dimensoes da imagem cortada:', croppedImage.bitmap.width, 'x', croppedImage.bitmap.height);

      // Salvar imagem original (colorida) para debug
      const debugPathOriginal = path.join(os.tmpdir(), 'test-helper-debug-original.png') as `${string}.${string}`;
      await croppedImage.write(debugPathOriginal);
      console.log('[DEBUG] Imagem original (colorida) salva em:', debugPathOriginal);

      // Análise avançada da imagem para detectar tipo de fundo
      let totalBrightness = 0;
      let totalSaturation = 0;
      const sampleSize = 2000; // Amostrar mais pixels para melhor precisão
      
      for (let i = 0; i < sampleSize; i++) {
        const x = Math.floor(Math.random() * croppedImage.bitmap.width);
        const y = Math.floor(Math.random() * croppedImage.bitmap.height);
        const color = croppedImage.getPixelColor(x, y);
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        
        // Calcular luminosidade (brightness)
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
        
        // Calcular saturação (quão "colorido" é o pixel)
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : ((max - min) / max) * 100;
        totalSaturation += saturation;
      }
      
      const avgBrightness = totalBrightness / sampleSize;
      const avgSaturation = totalSaturation / sampleSize;
      
      // Classificar tipo de fundo com lógica refinada
      const isDarkBackground = avgBrightness < 100;
      const isMediumBackground = avgBrightness >= 100 && avgBrightness < 160;
      const isBrightBackground = avgBrightness >= 160;
      const isColoredBackground = avgSaturation > 30; // Fundo colorido (azul, roxo, etc.)
      
      console.log('[PROCESSAMENTO] Luminosidade media:', Math.round(avgBrightness));
      console.log('[PROCESSAMENTO] Saturacao media:', Math.round(avgSaturation) + '%');
      
      // Determinar tipo de fundo e estratégia de processamento
      let backgroundType = '';
      if (isDarkBackground) {
        backgroundType = 'ESCURO';
      } else if (isBrightBackground && isColoredBackground) {
        backgroundType = 'COLORIDO CLARO';
      } else if (isMediumBackground && isColoredBackground) {
        backgroundType = 'COLORIDO MEDIO';
      } else if (isBrightBackground) {
        backgroundType = 'CLARO/BRANCO';
      } else {
        backgroundType = 'MEDIO/NEUTRO';
      }
      
      console.log('[PROCESSAMENTO] Tipo de fundo:', backgroundType);

      // Processamento adaptativo baseado no tipo de fundo
      let processedImage;
      
      if (backgroundType === 'ESCURO') {
        // Fundos escuros com texto claro: apenas melhorar contraste
        console.log('[PROCESSAMENTO] Aplicando ajustes para fundo escuro (texto claro)');
        processedImage = croppedImage.clone()
          .greyscale()           // Converte para escala de cinza
          .brightness(0.2)       // +20% brilho (moderado)
          .contrast(0.6)         // +60% contraste
          .normalize();          // Normalizar níveis
        console.log('[PROCESSAMENTO] Mantendo texto claro em fundo escuro');
        
      } else if (backgroundType === 'COLORIDO CLARO') {
        // Fundos coloridos claros com texto escuro: INVERTER
        console.log('[PROCESSAMENTO] Aplicando ajustes para fundo colorido claro (com inversao)');
        processedImage = croppedImage.clone()
          .greyscale()           // Remove cores (converte para escala de cinza)
          .invert()              // Inverte cores (fundo claro vira escuro, texto escuro vira claro)
          .contrast(0.5)         // +50% contraste (moderado após inversão)
          .normalize();          // Normalizar níveis
        console.log('[PROCESSAMENTO] Imagem invertida: texto claro em fundo escuro');
        
      } else if (backgroundType === 'COLORIDO MEDIO') {
        // Fundos coloridos médios: processar sem inversão (geralmente texto claro)
        console.log('[PROCESSAMENTO] Aplicando ajustes para fundo colorido medio (sem inversao)');
        processedImage = croppedImage.clone()
          .greyscale()           // Remove cores (converte para escala de cinza)
          .contrast(0.5)         // +50% contraste
          .brightness(0.1)       // +10% brilho
          .normalize();          // Normalizar níveis
        console.log('[PROCESSAMENTO] Mantendo contraste natural');
        
      } else if (backgroundType === 'CLARO/BRANCO') {
        // Fundos claros/brancos com texto escuro: processamento leve
        console.log('[PROCESSAMENTO] Aplicando ajustes para fundo claro');
        processedImage = croppedImage.clone()
          .greyscale()           // Converte para escala de cinza
          .contrast(0.4)         // +40% contraste
          .normalize();          // Normalizar níveis
        console.log('[PROCESSAMENTO] Mantendo texto escuro em fundo claro');
        
      } else {
        // Fundos médios/neutros: processamento balanceado
        console.log('[PROCESSAMENTO] Aplicando ajustes para fundo medio/neutro');
        processedImage = croppedImage.clone()
          .greyscale()           // Converte para escala de cinza
          .contrast(0.5)         // +50% contraste
          .normalize();          // Normalizar níveis
        console.log('[PROCESSAMENTO] Processamento balanceado');
      }

      // Salvar imagem processada para debug
      const debugPathProcessed = path.join(os.tmpdir(), 'test-helper-debug-processed.png') as `${string}.${string}`;
      await processedImage.write(debugPathProcessed);
      console.log('[DEBUG] Imagem processada salva em:', debugPathProcessed);

      // Converter para buffer
      const imageBuffer = await processedImage.getBuffer('image/png');
      console.log('[DEBUG] Buffer da imagem criado, tamanho:', imageBuffer.length, 'bytes');

      // 9. Executar OCR com configuração avançada
      console.log('[OCR] Executando OCR com Tesseract...');
      console.log('[OCR] Usando arquivo de idioma:', TesseractConfig.getLanguageDataPath());
      
      // Configurações avançadas do Tesseract para melhor reconhecimento
      const tesseractConfig: any = {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            console.log('[OCR] Progresso:', Math.round(m.progress * 100) + '%');
          }
        },
        // Parâmetros do Tesseract otimizados para formulários e questões
        tessedit_pageseg_mode: '6',  // Assume a uniform block of text (melhor para questões)
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÇÉÊÍÓÔÕÚàáâãçéêíóôõúÑñ0123456789.,;:?!()[]{}/-+*=@#$%&"\' ',
        preserve_interword_spaces: '1',  // Preservar espaços entre palavras
        tessedit_do_invert: '0',  // Não inverter cores automaticamente
        // Melhorias para detecção de texto
        textord_heavy_nr: '1',  // Melhor detecção de linhas
        textord_min_linesize: '2.5',  // Tamanho mínimo de linha
      };
      
      const { data: { text, confidence } } = await Tesseract.recognize(
        imageBuffer,
        'por',
        tesseractConfig
      );

      console.log('[OCR] Concluido. Confianca:', Math.round(confidence) + '%');
      console.log('[OCR] Tamanho do texto extraido:', text.length, 'caracteres');
      console.log('[OCR] Primeiras 3 linhas do texto:');
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const firstLines = lines.slice(0, 3);
      for (let idx = 0; idx < firstLines.length; idx++) {
        console.log(`  Linha ${idx + 1}: ${firstLines[idx].substring(0, 100)}`);
      }

      if (!text.trim()) {
        throw new Error('Não foi possível extrair texto da imagem. Verifique se há texto visível na janela capturada.');
      }

      console.log('[OCR] Total de linhas extraidas:', lines.length);
      console.log('[OCR] Texto completo para IA (primeiros 500 chars):', text.substring(0, 500));

      // 10. Validar se o texto parece ser uma questão válida
      if (!TextParser.isValidQuestion(text)) {
        throw new Error('O texto capturado não parece ser uma questão válida. Tente capturar novamente focando na área da pergunta.');
      }

      // 11. Fazer parsing inteligente do texto
      console.log('[PARSER] Analisando estrutura da questão...');
      const parsedQuestion = TextParser.parseQuestion(text);
      
      if (parsedQuestion.hasStructure) {
        console.log('[PARSER] Estrutura identificada com sucesso!');
        if (parsedQuestion.questionNumber !== null) {
          console.log('[PARSER] Número da questão:', parsedQuestion.questionNumber);
        }
        console.log('[PARSER] Texto da pergunta:', parsedQuestion.questionText.substring(0, 150));
        console.log('[PARSER] Opções encontradas:', parsedQuestion.options.length);
      } else {
        console.log('[PARSER] Usando texto completo (estrutura não identificada)');
      }

      // 12. Formatar texto para enviar à IA
      const formattedText = TextParser.formatForAI(parsedQuestion);

      // 13. Obter resposta da IA
      console.log('[IA] Consultando IA...');
      const aiModule = new AIModule();
      const answer = await aiModule.getAnswer(formattedText);

      // 14. Mostrar resposta
      if (this.popupWindow) {
        // Redimensionar e reposicionar para o toast de resposta (canto inferior direito)
        this.showResponsePopup();
        
        this.popupWindow.webContents.send('show-response', {
          status: 'success',
          message: answer
        });
      }

    } catch (error) {
      console.error('[ERRO] Erro na captura:', error);
      if (this.popupWindow) {
        // Redimensionar e reposicionar para o toast de erro
        this.showResponsePopup();
        
        this.popupWindow.webContents.send('show-response', {
          status: 'error',
          message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  private showResponsePopup(): void {
    if (!this.popupWindow) return;

    // Obter dimensões da tela
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    // Dimensões do toast
    const toastWidth = 360;
    const toastHeight = 220;

    // Posicionar no canto inferior direito com margem
    const x = screenWidth - toastWidth - 24;
    const y = screenHeight - toastHeight - 24;

    // Redimensionar e reposicionar
    this.popupWindow.setSize(toastWidth, toastHeight);
    this.popupWindow.setPosition(x, y);
  }

  private async showLoadingPopup(): Promise<void> {
    // Popup de loading - pequeno e discreto no centro
    this.popupWindow = new BrowserWindow({
      width: 240,
      height: 80,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js')
      }
    });

    // Centralizar na tela
    this.popupWindow.center();

    // CORREÇÃO CRÍTICA: Paths corretos para produção
    if (app.isPackaged) {
      // Em produção, o HTML está dentro do app.asar
      const htmlPath = path.join(process.resourcesPath, 'app.asar', 'packages', 'renderer', 'dist', 'index.html');
      await this.popupWindow.loadFile(htmlPath, {
        hash: '/popup'
      });
    } else {
      // Em desenvolvimento, usa o servidor Vite
      await this.popupWindow.loadURL('http://localhost:5173/#/popup');
    }
  }
}

