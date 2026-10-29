import React, { useState } from 'react';
import { Trophy, Flame, CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles, Send } from 'lucide-react';
import { sound } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';

interface Question {
  id: number;
  question: string;
  category: 'Trigonometria' | 'Python' | 'Álgebra' | 'Lógica';
  options: string[];
  correctIndex: number;
  explanation: string;
  exprToTest?: string;
  testMode?: 'DEG' | 'RAD';
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'No modo Graus (DEG), qual é o valor exato de sin(30°)?',
    category: 'Trigonometria',
    options: ['0.5', '1.0', '0.866', '0.0'],
    correctIndex: 0,
    explanation: 'No triângulo retângulo e no círculo trigonométrico, o cateto oposto a 30° tem metade do comprimento da hipotenusa, logo sin(30°) = 1/2 = 0.5.',
    exprToTest: 'sin(30)',
    testMode: 'DEG'
  },
  {
    id: 2,
    question: 'Em Python, qual é o resultado da expressão: 2 ** 3 + 4 * 2?',
    category: 'Python',
    options: ['16', '24', '14', '64'],
    correctIndex: 0,
    explanation: 'Por precedência de operadores: 2 ** 3 = 8 (potência), 4 * 2 = 8 (multiplicação), e 8 + 8 = 16.',
    exprToTest: '2^3 + 4 * 2',
    testMode: 'DEG'
  },
  {
    id: 3,
    question: 'Qual é o valor de 5! (cinco fatorial)?',
    category: 'Álgebra',
    options: ['120', '25', '60', '720'],
    correctIndex: 0,
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120. Em Python você pode usar math.factorial(5)!',
    exprToTest: '5!',
    testMode: 'DEG'
  },
  {
    id: 4,
    question: 'Em radianos, a quantos graus corresponde o ângulo π (Pi radianos)?',
    category: 'Trigonometria',
    options: ['180°', '360°', '90°', '270°'],
    correctIndex: 0,
    explanation: 'Uma volta completa no círculo tem 2π radianos = 360°. Portanto, meia volta π radianos = 180°!',
    exprToTest: 'cos(π)',
    testMode: 'RAD'
  },
  {
    id: 5,
    question: 'O que a função len([5, 10, 15, 20]) retorna em Python?',
    category: 'Python',
    options: ['4', '20', '50', 'None'],
    correctIndex: 0,
    explanation: 'A função len() retorna a contagem de elementos de uma lista ou coleção. Aqui temos 4 itens.',
  },
  {
    id: 6,
    question: 'Qual é o resultado de log(100) na base 10?',
    category: 'Álgebra',
    options: ['2', '10', '1', '100'],
    correctIndex: 0,
    explanation: 'log10(100) = 2, porque 10 elevado ao quadrado (10²) é igual a 100.',
    exprToTest: 'log(100)',
    testMode: 'DEG'
  }
];

interface MathQuizGameProps {
  onSendToCalculator?: (expr: string, mode: 'DEG' | 'RAD') => void;
}

export const MathQuizGame: React.FC<MathQuizGameProps> = ({ onSendToCalculator }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sound.playClick('equals');
      setScore(s => s + 100 + streak * 20);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak % 3 === 0) {
        fireConfetti(1500);
      }
    } else {
      sound.playClick('clear');
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick('func');
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      fireConfetti(3000);
    }
  };

  const restartQuiz = () => {
    sound.playClick('clear');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4 animate-fade-in">
      {/* Header com Pontuação e Nível */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Desafio Math &amp; Python Quest
            </h3>
            <p className="text-[11px] text-slate-400">
              Teste seu raciocínio lógico e ganhe pontos XP a cada acerto!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {streak > 1 && (
            <div className="flex items-center gap-1 font-bold text-amber-400 animate-bounce">
              <Flame className="w-4 h-4 fill-current" />
              <span>{streak}x Combo!</span>
            </div>
          )}
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-emerald-400 font-bold">
            {score} XP
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="my-3 space-y-4">
          {/* Barra de Progresso */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Pergunta {currentIndex + 1} de {QUIZ_QUESTIONS.length}
            </span>
            <span className="font-mono text-blue-400">{currentQ.category}</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Enunciado */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
              {currentQ.question}
            </h4>
          </div>

          {/* Opções */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700';
              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/60 border-slate-900 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`p-3 rounded-xl border font-mono text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explicação Didática */}
          {isAnswered && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-blue-500/30 animate-pop-in space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {selectedOption === currentQ.correctIndex ? 'Excelente! Resposta Correta' : 'Quase lá! Veja a explicação:'}
                </span>

                {currentQ.exprToTest && onSendToCalculator && (
                  <button
                    onClick={() => {
                      sound.playClick('num');
                      onSendToCalculator(currentQ.exprToTest!, currentQ.testMode || 'DEG');
                    }}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Testar na Calculadora</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Botão Próximo */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
              >
                <span>{currentIndex + 1 === QUIZ_QUESTIONS.length ? 'Ver Resultado' : 'Próxima Questão'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Tela de Parabéns */
        <div className="py-8 text-center space-y-4 animate-pop-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Parabéns! Desafio Concluído!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Você conquistou <strong className="text-emerald-400 font-mono text-sm">{score} XP</strong> nesta rodada!
            </p>
          </div>
          <button
            onClick={restartQuiz}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      )}
    </div>
  );
};
