import { BookOpen, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-slate-200 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-amber-400 text-slate-950 font-serif font-bold text-xs flex items-center justify-center leading-none">
                π
              </span>
              <span>Calculadora πthon</span>
            </div>
            <p className="text-slate-600 max-w-md">
              Desenvolvido com foco no aprendizado de iniciantes em lógica de programação e na linguagem Python.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-600">
            <a
              href="https://docs.python.org/pt-br/3/tutorial/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <span>Tutorial Oficial Python (PT-BR)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.python.org/downloads/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <span>Download do Python</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            Pratique modificando o código: adicione novas operações como potência (**) ou porcentagem (%).
          </div>
          <div>
            Python 3 · Guia Educativo
          </div>
        </div>
      </div>
    </footer>
  );
}
