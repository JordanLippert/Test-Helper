import OpenAI from 'openai';
import Store from 'electron-store';

export class AIModule {
  private readonly openai: OpenAI;
  private readonly store: Store;

  constructor() {
    this.store = new Store();
    const apiKey = this.store.get('openai-key') as string;
    
    if (!apiKey) {
      throw new Error('Chave da API OpenAI não configurada. Por favor, configure nas Configurações.');
    }

    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  public async getAnswer(text: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em responder questões de QUALQUER NÍVEL DE COMPLEXIDADE de forma DIRETA e OBJETIVA.

INSTRUÇÕES:
1. Analise a PERGUNTA apresentada (com ou sem numeração)
2. Se houver alternativas (a, b, c, d, e), identifique a CORRETA
3. Forneça a resposta no formato: "Alternativa X: [breve justificativa]"
4. Se for questão discursiva (sem alternativas), responda objetivamente em 2-3 linhas
5. NÃO escreva disclaimers, avisos ou observações adicionais
6. Seja DIRETO e CONFIANTE na resposta
7. Se houver múltiplas questões, responda APENAS a primeira

IMPORTANTE: 
- A pergunta pode estar em qualquer área do conhecimento (exatas, humanas, biológicas, tecnologia, etc.)
- O texto já foi pré-processado e estruturado para facilitar sua análise
- Foque na PERGUNTA e nas ALTERNATIVAS apresentadas
- Baseie-se em conhecimento factual e preciso`
          },
          {
            role: "user",
            content: `${text}\n\nFORNEÇA A RESPOSTA CORRETA:`
          }
        ],
        temperature: 0.2,  // Baixa temperatura para respostas mais precisas e determinísticas
        max_tokens: 500
      });

      const answer = completion.choices[0]?.message?.content;
      if (!answer) {
        throw new Error('A API não retornou uma resposta válida');
      }

      return answer;

    } catch (error) {
      console.error('[ERRO] Erro ao obter resposta da IA:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Erro de autenticacao: Verifique sua chave da API OpenAI');
        }
        throw new Error(`Erro ao consultar IA: ${error.message}`);
      }
      
      throw new Error('Nao foi possivel obter uma resposta da IA');
    }
  }
}

