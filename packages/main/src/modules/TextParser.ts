/**
 * Módulo responsável por fazer o parsing inteligente do texto extraído via OCR
 * Identifica perguntas numeradas e extrai o conteúdo relevante
 */

export interface ParsedQuestion {
  questionNumber: number | null;
  questionText: string;
  options: string[];
  fullText: string;
  hasStructure: boolean;
}

export class TextParser {
  /**
   * Extrai e estrutura a pergunta do texto capturado
   * @param rawText Texto bruto extraído do OCR
   * @returns Objeto com a pergunta estruturada
   */
  public static parseQuestion(rawText: string): ParsedQuestion {
    console.log('[PARSER] Iniciando parsing do texto...');
    
    // Limpar o texto
    const cleanedText = this.cleanText(rawText);
    console.log('[PARSER] Texto limpo, tamanho:', cleanedText.length, 'caracteres');
    
    // Tentar identificar a pergunta numerada
    const questionPattern = /(\d+)\.\s*(.+?)(?=\n[a-e]\)|$)/is;
    const match = cleanedText.match(questionPattern);
    
    if (match) {
      const questionNumber = parseInt(match[1]);
      const questionText = match[2].trim();
      
      console.log('[PARSER] Pergunta identificada - Número:', questionNumber);
      console.log('[PARSER] Texto da pergunta:', questionText.substring(0, 100) + '...');
      
      // Extrair opções (a), b), c), d), e)
      const options = this.extractOptions(cleanedText);
      console.log('[PARSER] Opções encontradas:', options.length);
      
      return {
        questionNumber,
        questionText,
        options,
        fullText: cleanedText,
        hasStructure: true
      };
    }
    
    // Se não encontrou padrão numerado, tentar encontrar apenas opções
    const options = this.extractOptions(cleanedText);
    if (options.length > 0) {
      console.log('[PARSER] Estrutura parcial detectada (sem número, mas com opções)');
      
      // Tentar extrair o texto antes das opções como pergunta
      const firstOptionIndex = cleanedText.indexOf(options[0]);
      const questionText = firstOptionIndex > 0 
        ? cleanedText.substring(0, firstOptionIndex).trim()
        : cleanedText;
      
      return {
        questionNumber: null,
        questionText,
        options,
        fullText: cleanedText,
        hasStructure: true
      };
    }
    
    // Fallback: retornar texto completo sem estrutura identificada
    console.log('[PARSER] Nenhuma estrutura clara identificada, usando texto completo');
    return {
      questionNumber: null,
      questionText: cleanedText,
      options: [],
      fullText: cleanedText,
      hasStructure: false
    };
  }
  
  /**
   * Limpa o texto removendo caracteres indesejados e normalizando espaços
   */
  private static cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')           // Normalizar quebras de linha
      .replace(/\n{3,}/g, '\n\n')       // Remover múltiplas quebras de linha
      .replace(/\s+/g, ' ')             // Normalizar espaços múltiplos
      .replace(/\n /g, '\n')            // Remover espaços após quebra de linha
      .trim();
  }
  
  /**
   * Extrai as opções de múltipla escolha (a), b), c), d), e)
   */
  private static extractOptions(text: string): string[] {
    const options: string[] = [];
    
    // Padrões para detectar opções: a), a., A), A.
    const optionPatterns = [
      /([a-e])\)\s*(.+?)(?=\n[a-e]\)|\n\n|$)/gis,
      /([a-e])\.\s*(.+?)(?=\n[a-e]\.|\n\n|$)/gis,
      /([A-E])\)\s*(.+?)(?=\n[A-E]\)|\n\n|$)/gis,
      /([A-E])\.\s*(.+?)(?=\n[A-E]\.|\n\n|$)/gis
    ];
    
    for (const pattern of optionPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        for (const match of matches) {
          const optionLetter = match[1].toLowerCase();
          const optionText = match[2].trim();
          options.push(`${optionLetter}) ${optionText}`);
        }
        break; // Usar apenas o primeiro padrão que funcionar
      }
    }
    
    return options;
  }
  
  /**
   * Formata a pergunta estruturada para enviar à IA
   */
  public static formatForAI(parsed: ParsedQuestion): string {
    let formatted = '';
    
    if (parsed.hasStructure) {
      // Formato estruturado
      if (parsed.questionNumber !== null) {
        formatted += `QUESTÃO ${parsed.questionNumber}\n\n`;
      }
      
      formatted += `PERGUNTA:\n${parsed.questionText}\n\n`;
      
      if (parsed.options.length > 0) {
        formatted += `ALTERNATIVAS:\n`;
        for (const option of parsed.options) {
          formatted += `${option}\n`;
        }
      }
    } else {
      // Fallback: usar texto completo
      formatted = parsed.fullText;
    }
    
    console.log('[PARSER] Texto formatado para IA (primeiros 300 chars):', formatted.substring(0, 300));
    return formatted;
  }
  
  /**
   * Detecta se o texto parece ser uma questão válida
   */
  public static isValidQuestion(text: string): boolean {
    // Verificações básicas
    if (text.length < 20) {
      console.log('[PARSER] Texto muito curto para ser uma questão válida');
      return false;
    }
    
    // Verificar se tem algum padrão de questão
    const hasQuestionNumber = /\d+\.\s+/.test(text);
    const hasOptions = /[a-e]\)\s+/i.test(text);
    const hasQuestionMark = /\?/.test(text);
    const hasKeywords = /(qual|quais|como|onde|quando|por que|marque|assinale|indique)/i.test(text);
    
    const isValid = hasQuestionNumber || hasOptions || hasQuestionMark || hasKeywords;
    
    if (!isValid) {
      console.log('[PARSER] Texto não parece ser uma questão válida');
    }
    
    return isValid;
  }
}

