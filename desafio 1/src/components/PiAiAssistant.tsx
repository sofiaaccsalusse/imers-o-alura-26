import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RotateCcw, Copy, Check, MessageSquare, ArrowUpRight, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface PiAiAssistantProps {
  currentExpression?: string;
  lastResult?: string;
  angleMode?: 'DEG' | 'RAD';
  onSendToCalculator?: (expr: string, mode?: 'DEG' | 'RAD') => void;
}

export const PiAiAssistant: React.FC<PiAiAssistantProps> = ({
  currentExpression,
  lastResult,
  angleMode = 'DEG',
  onSendToCalculator,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Olá! Sou a **π AI**, sua tutora de matemática e programação Python! 🎓\n\nEstou aqui para tirar qualquer dúvida sobre fórmulas, trigonometria (seno, cosseno), fatoriais, álgebra ou como escrever scripts em Python. Como posso te ajudar hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    'Como funciona o seno e cosseno no círculo trigonométrico?',
    'Por que sin(30°) dá exatamente 0.5 em Graus?',
    'Qual a diferença prática entre Graus (DEG) e Radianos (RAD)?',
    'Explique a ordem de precedência PEMDAS com exemplos',
    'Como usar o módulo math em Python para calcular raízes e potências?',
    'Por que qualquer número elevado a 0 é igual a 1?',
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputValue.trim();
    if (!textToSend || isLoading) return;

    sound.playClick('num');
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            expression: currentExpression || '',
            lastResult: lastResult || '',
            angleMode,
          },
          history: messages.slice(-4).map(m => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      sound.playClick('equals');

      const aiReplyText = data.reply || data.fallbackReply || 'Não foi possível obter uma resposta no momento.';

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      sound.playClick('clear');
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        text: 'Desculpe, não consegui me conectar aos servidores de IA no momento. Verifique sua conexão ou tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyText = (text: string, id: string) => {
    sound.playClick('num');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    sound.playClick('clear');
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Conversa reiniciada! Pode fazer uma nova pergunta sobre matemática ou Python.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[640px] max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
      {/* Top Header */}
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-serif font-black text-lg select-none">
            π
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-display">
                π AI
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Tutor Interativo
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tire dúvidas de matemática, trigonometria e lógica Python em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge de contexto da calculadora */}
          {currentExpression && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Visor: {currentExpression.slice(0, 15)}</span>
            </div>
          )}

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Limpar histórico da conversa"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Questions Pills */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1 font-medium">
          <HelpCircle className="w-3 h-3 text-sky-400" />
          Sugestões:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/80 hover:bg-blue-600/30 hover:text-blue-300 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-emerald-500 to-blue-500 text-white font-serif font-black'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : 'π'}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-md relative group text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap selection:bg-blue-400 selection:text-slate-900">
                  {m.text}
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 gap-2 pt-1 border-t border-slate-800/40">
                  <span>{m.timestamp}</span>

                  <button
                    onClick={() => handleCopyText(m.text, m.id)}
                    className="opacity-60 hover:opacity-100 flex items-center gap-1 hover:text-white transition-opacity cursor-pointer"
                    title="Copiar texto"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === m.id ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-500 text-white font-serif font-black flex items-center justify-center text-xs shrink-0">
              π
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>π AI está pensando na melhor explicação...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida sobre matemática, trigonometria ou Python (Shift+Enter para pular linha)..."
            rows={2}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 resize-none transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white shadow-lg transition-all cursor-pointer shrink-0"
            title="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
