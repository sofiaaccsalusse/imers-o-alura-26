import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import { Copy, Check, Download, Info } from 'lucide-react';
import { CodeLevel, pythonCodeLevels } from '../data/pythonCodes';

interface CodeViewerProps {
  onSelectLevel?: (level: CodeLevel) => void;
}

export function CodeViewer({ onSelectLevel }: CodeViewerProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string>('estruturado');
  const [copied, setCopied] = useState(false);

  const currentLevel = pythonCodeLevels.find((l) => l.id === selectedLevelId) || pythonCodeLevels[0];

  useEffect(() => {
    if (onSelectLevel) {
      onSelectLevel(currentLevel);
    }
  }, [currentLevel, onSelectLevel]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentLevel.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentLevel.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentLevel.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const highlightedHtml = Prism.highlight(
    currentLevel.code,
    Prism.languages.python || Prism.languages.javascript,
    'python'
  );

  const lines = currentLevel.code.split('\n');

  return (
    <section id="codigo" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-1">
              Código Completo e Organizado
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              O Código da Calculadora em Python
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Escolha o nível que melhor atende ao seu momento de estudos. O código está pronto para ser copiado e executado.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
              title="Copiar código para a área de transferência"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
              title={`Baixar ${currentLevel.filename}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar {currentLevel.filename}</span>
            </button>
          </div>
        </div>

        {/* Level Switcher (Segmented Control) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 border border-slate-200/80">
          {pythonCodeLevels.map((lvl) => {
            const isActive = lvl.id === selectedLevelId;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevelId(lvl.id)}
                className={`flex-1 sm:flex-initial text-left px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lvl.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-amber-100 text-amber-900 font-mono' : 'text-slate-400 font-mono'
                  }`}>
                    {lvl.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Level Description Note */}
        <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{currentLevel.title}:</span> {currentLevel.description}
          </div>
        </div>

        {/* Code Container with dark modern IDE aesthetic */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-lg">
          {/* Editor Header Bar */}
          <div className="px-4 py-2.5 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-300 font-medium">{currentLevel.filename}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">Python 3.x</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px] tabular-nums">
              {lines.length} linhas
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed max-h-[560px] overflow-y-auto">
            <div className="flex gap-4">
              {/* Line Numbers */}
              <div
                className="select-none text-slate-600 text-right pr-3 border-r border-slate-800/80 tabular-nums shrink-0"
                aria-hidden="true"
              >
                {lines.map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code with Prism Highlight */}
              <pre
                className="text-slate-200 flex-1 overflow-visible font-mono leading-6"
                tabIndex={0}
              >
                <code
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  className="language-python block"
                />
              </pre>
            </div>
          </div>

          {/* Editor Footer Bar */}
          <div className="px-4 py-2 bg-[#161b22] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Dica: Comentários que começam com <code>#</code> são ignorados pelo Python e servem para explicar o que cada linha faz.</span>
            <span className="hidden sm:inline font-mono text-slate-500">UTF-8 · LF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
