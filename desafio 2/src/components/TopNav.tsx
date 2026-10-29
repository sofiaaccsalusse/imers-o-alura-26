import { Code2, Download } from 'lucide-react';

interface TopNavProps {
  onDownload: () => void;
}

export function TopNav({ onDownload }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line wordmark */}
        <a href="#" className="flex items-center gap-2.5 text-slate-900 font-bold text-lg tracking-tight whitespace-nowrap shrink-0">
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-serif font-bold text-xl shadow-xs leading-none">
            π
          </span>
          <span>Calculadora πthon</span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <a href="#calculadora-interativa" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Calculadora Interativa
          </a>
          <a href="#codigo" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Código Fonte
          </a>
          <a href="#simulador" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Simulador Terminal
          </a>
          <a href="#componentes" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Componentes
          </a>
          <a href="#como-executar" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Como Executar
          </a>
          <a href="#desafio" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Quiz
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            title="Baixar arquivo calculadora.py pronto para rodar"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar calculadora.py</span>
          </button>
        </div>
      </div>
    </header>
  );
}
