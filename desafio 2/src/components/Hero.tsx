import { Terminal, BookOpen, CheckCircle, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScrollToCalc: () => void;
  onScrollToCode: () => void;
  onScrollToSimulator: () => void;
}

export function Hero({ onScrollToCalc, onScrollToCode, onScrollToSimulator }: HeroProps) {
  return (
    <section className="pt-12 pb-16 border-b border-slate-200 bg-linear-to-b from-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Metadata as clean unboxed text with subtle typographic separators */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4 tracking-wide uppercase">
            <span>Python 3 para Iniciantes</span>
            <span aria-hidden="true">·</span>
            <span>4 Operações Básicas</span>
            <span aria-hidden="true">·</span>
            <span>Código 100% Comentado</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Calculadora πthon: As 4 Operações Básicas para Iniciantes
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Se você está dando os seus primeiros passos na programação, este é o projeto clássico e perfeito para aprender. Experimente a calculadora interativa com botões físicos ou veja o código comentado passo a passo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onScrollToCalc}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-slate-900" />
              <span>Usar Calculadora Interativa</span>
            </button>

            <button
              onClick={onScrollToCode}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Ver Código Python Comentado</span>
            </button>
          </div>

          {/* Quick learning badges rendered as clean unboxed text indicators */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Adição, Subtração, Multiplicação e Divisão</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sem travar com 'ZeroDivisionError'</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Conversão correta com float(input())</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Menu repetitivo com while True</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
