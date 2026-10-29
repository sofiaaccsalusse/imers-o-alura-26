import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Inicialização segura do cliente Gemini Server-Side conforme as diretrizes
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint de IA para dúvidas dos alunos: "π AI responde"
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { message, context, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida ou vazia.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Chave de API do Gemini não configurada. Configure em Settings > Secrets.',
        fallbackReply:
          'Olá! Para que eu possa responder às suas dúvidas usando o modelo de IA em tempo real, certifique-se de que a GEMINI_API_KEY esteja configurada no painel de Segredos.',
      });
    }

    const systemInstruction = `Você é a "π AI" (Pi AI), a inteligência artificial didática, paciente e especialista em matemática e programação Python da plataforma πCalc.
Seu objetivo é tirar todas as dúvidas dos alunos de forma extremamente didática, leve e clara.

Regras de conduta:
1. Explique os conceitos matemáticos (trigonometria, álgebra, geometria, fatoriais, logaritmos, cálculo) passo a passo como um professor de elite ou tutor particular.
2. Quando a pergunta envolver código ou algoritmos Python, mostre exemplos limpos com a biblioteca padrão math ou funções nativas (print, sum, len, range).
3. Seja encorajadora com os estudantes. Se houver equações no contexto atual da calculadora, mencione-as quando relevante.
4. Use formatação legível com tópicos e blocos de código quando útil. Responda em Português do Brasil de forma acolhedora.`;

    let contextNote = '';
    if (context) {
      contextNote = `\n[Contexto da Calculadora do Aluno: Expressão atual: "${context.expression || 'nenhuma'}", Último resultado: "${context.lastResult || 'nenhum'}", Modo angular: ${context.angleMode || 'DEG'}]`;
    }

    // Monta o prompt incluindo o contexto atual e histórico
    let fullPrompt = `${contextNote}\n\nPergunta do aluno: ${message}`;
    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-4).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Aluno' : 'π AI'}: ${h.text}`).join('\n');
      fullPrompt = `Histórico recente da conversa:\n${recent}\n\n${fullPrompt}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'Não consegui formular uma resposta no momento. Pode tentar perguntar de outra forma?';

    return res.json({ reply });
  } catch (error: unknown) {
    console.error('Erro na chamada Gemini:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Falha ao processar dúvida com a π AI.',
      details: errMsg,
      fallbackReply:
        'Desculpe, ocorreu uma oscilação na conexão com a inteligência artificial. Por favor, tente novamente em alguns segundos.',
    });
  }
});

// Integração com Vite em desenvolvimento e arquivos estáticos em produção
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor πCalc rodando na porta ${PORT}`);
  });
}

startServer();
