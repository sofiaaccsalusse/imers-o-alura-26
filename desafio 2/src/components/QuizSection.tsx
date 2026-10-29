import React, { useState } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

export function QuizSection() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === quizQuestions.length;

  const correctCount = quizQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <section id="desafio" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-1">
            Fixação de Conteúdo
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Quiz Rápido: Teste seu Aprendizado
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Responda a estas 4 perguntas para verificar se você entendeu os conceitos mais importantes da calculadora em Python.
          </p>
        </div>

        {/* Score banner if completed */}
        {showResults && (
          <div className="mb-8 p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">
                  Você acertou {correctCount} de {quizQuestions.length} questões!
                </div>
                <div className="text-xs text-slate-300">
                  {correctCount === 4
                    ? 'Excelente! Você dominou todos os fundamentos da calculadora.'
                    : correctCount >= 2
                    ? 'Muito bom! Dê uma olhada nas explicações abaixo para consolidar os pontos que errou.'
                    : 'Continue praticando! A programação fica mais natural a cada tentativa.'}
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refazer Quiz</span>
            </button>
          </div>
        )}

        {/* Question Cards */}
        <div className="space-y-6">
          {quizQuestions.map((q, qIndex) => {
            const userAnswer = selectedAnswers[q.id];
            const hasAnswered = userAnswer !== undefined;
            const isCorrect = hasAnswered && userAnswer === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    <span className="text-amber-600 mr-1.5">{qIndex + 1}.</span>
                    {q.question}
                  </h3>
                  {hasAnswered && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2 mb-3">
                  {q.options.map((option, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const showCorrectness = showResults || hasAnswered;
                    const isTheCorrectOption = optIdx === q.correctIndex;

                    let optionStyle = 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700';
                    if (showCorrectness) {
                      if (isTheCorrectOption) {
                        optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                      } else {
                        optionStyle = 'bg-white/60 border-slate-200 text-slate-400';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-amber-50 border-amber-400 text-amber-950 font-medium';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-mono text-[10px] text-slate-500 shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {showCorrectness && isTheCorrectOption && (
                          <span className="text-[11px] font-semibold text-emerald-700 whitespace-nowrap">
                            Correta
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback note after answer */}
                {hasAnswered && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 mt-2">
                    <strong className="text-slate-900">Explicação: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit verification button */}
        {!showResults && (
          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {answeredCount} de {quizQuestions.length} respondidas
            </span>
            <button
              type="button"
              disabled={!isComplete}
              onClick={() => setShowResults(true)}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs ${
                isComplete
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-900'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Conferir Resultados
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
