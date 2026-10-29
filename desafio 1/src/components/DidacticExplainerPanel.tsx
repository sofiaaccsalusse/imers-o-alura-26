import React, { useState } from 'react';
import { Lightbulb, Code2, Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { explainExpression, DidacticStep } from '../utils/didacticExplainer';
import { sound } from '../utils/sound';

interface DidacticExplainerPanelProps {
  expression: string;
  result: string;
  angleMode: 'DEG' | 'RAD';
  onAskAi?: () => void;
}

export const DidacticExplainerPanel: React.FC<DidacticExplainerPanelProps> = ({
  expression,
  result,
  angleMode,
  onAskAi
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!expression || expression === 'Erro' || !result) return null;

  const step: DidacticStep = explainExpression(expression, angleMode, result);

  const handleCopyPython = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick('num');
    navigator.clipboard.writeText(step.pythonSyntax);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="w-full mt-2 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-xl overflow-hidden transition-all shadow-md">
      {/* Botão de Toggle */}
      <button
        onClick={() => {
          sound.playClick('func');
          setIsOpen(!isOpen);
        }}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-blue-500/10 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-blue-300">
            Como foi calculado? (Passo a Passo Didático)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-400 font-mono">
          <span>{isOpen ? 'Recolher' : 'Ver Detalhes'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Conteúdo Expandido */}
      {isOpen && (
        <div className="p-3.5 border-t border-blue-500/20 text-xs space-y-3 animate-fade-in bg-slate-950/60">
          <div>
            <h5 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <span>{step.title}</span>
            </h5>
            <p className="text-slate-300 mt-1 leading-relaxed">
              {step.concept}
            </p>
          </div>

          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Explicação do cálculo:</span>
            <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
              {step.explanation}
            </p>
          </div>

          {/* Código Python Equivalente */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Code2 className="w-3 h-3 text-yellow-400" />
                Como fazer em Python:
              </span>
              <button
                onClick={handleCopyPython}
                className="flex items-center gap-1 text-[10px] text-yellow-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-yellow-300 font-mono text-[11px] overflow-x-auto whitespace-pre">
              {step.pythonSyntax}
            </pre>
          </div>

          {/* Curiosidade / Sabia que */}
          {step.funFact && (
            <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-start gap-2 text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="block text-amber-300 mb-0.5">Sabia que...?</strong>
                {step.funFact}
              </div>
            </div>
          )}

          {onAskAi && (
            <div className="pt-1 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick('func');
                  onAskAi();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ainda com dúvidas? Pergunte à π AI</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
