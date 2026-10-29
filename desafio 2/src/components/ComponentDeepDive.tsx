import React, { useState } from 'react';
import { codeExplanations, ExplanationSection } from '../data/explanations';
import { ChevronDown, ChevronUp, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';

export function ComponentDeepDive() {
  const [openSectionId, setOpenSectionId] = useState<string>('funcoes');

  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="componentes" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-1">
            Fundamentos Explicados
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Anatomia do Código: Os Componentes Essenciais
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Cada linha de uma calculadora em Python ensina um conceito basilar da ciência da computação. Clique em cada componente para entender sua função prática e como evitar os erros clássicos de quem está começando.
          </p>
        </div>

        {/* Accordion / Deep Dive Cards */}
        <div className="space-y-4">
          {codeExplanations.map((section: ExplanationSection) => {
            const isOpen = openSectionId === section.id;
            const highlightedSnippet = Prism.highlight(
              section.pythonSnippet,
              Prism.languages.python || Prism.languages.javascript,
              'python'
            );

            return (
              <div
                key={section.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white shadow-xs"
              >
                {/* Header button */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="font-bold text-slate-900 text-base">
                      {section.title}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {section.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                      {section.category}
                    </span>
                    <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/40">
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      {section.explanation}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Code Snippet Box */}
                      <div className="lg:col-span-7 rounded-lg overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xs">
                        <div className="px-3 py-1.5 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>Exemplo Prático</span>
                          <span>Python 3</span>
                        </div>
                        <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                          <code
                            dangerouslySetInnerHTML={{ __html: highlightedSnippet }}
                            className="language-python"
                          />
                        </pre>
                      </div>

                      {/* Bullet Highlights & Pitfall */}
                      <div className="lg:col-span-5 space-y-4">
                        {/* Concept key points */}
                        <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs mb-2">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pontos-Chave para Lembrar:</span>
                          </div>
                          {section.bulletPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-slate-600">
                              <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                              <span className="leading-snug">{point}</span>
                            </div>
                          ))}
                        </div>

                        {/* Common Beginner Mistake */}
                        <div className="p-4 bg-amber-50/70 rounded-lg border border-amber-200 text-xs">
                          <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Erro Comum de Iniciantes:</span>
                          </div>
                          <div className="font-mono bg-white p-2 rounded border border-amber-200 text-[11px] text-rose-700 mb-2">
                            {section.beginnerPitfall.mistake}
                          </div>
                          <p className="text-slate-700 mb-1.5 leading-snug">
                            <strong>Por que acontece:</strong> {section.beginnerPitfall.why}
                          </p>
                          <p className="text-emerald-800 font-medium leading-snug">
                            <strong>Como corrigir:</strong> {section.beginnerPitfall.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
