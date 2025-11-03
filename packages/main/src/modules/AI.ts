import OpenAI from 'openai';
import Store from 'electron-store';

export class AIModule {
  private openai: OpenAI;
  private store: Store;

  constructor() {
    this.store = new Store();
    const apiKey = this.store.get('openai-key') as string;
    
    if (!apiKey) {
      throw new Error('Chave da API OpenAI não configurada');
    }

    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  public async getAnswer(text: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um assistente acadêmico especializado em explicar conceitos e responder questões de teste. Suas respostas devem ser claras, objetivas e educativas."
          },
          {
            role: "user",
            content: `Por favor, analise e responda a seguinte questão de teste:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const answer = completion.choices[0]?.message?.content;
      if (!answer) {
        throw new Error('A API não retornou uma resposta válida');
      }

      return answer;

    } catch (error) {
      console.error('Erro ao obter resposta da IA:', error);
      throw new Error('Não foi possível obter uma resposta da IA');
    }
  }
}