import React from 'react';
import { X, Copy, Atom, Hash } from 'lucide-react';
import { sound } from '../utils/sound';

interface ConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (val: string) => void;
}

export const ConstantsModal: React.FC<ConstantsModalProps> = ({ isOpen, onClose, onInsert }) => {
  if (!isOpen) return null;

  const mathConstants = [
    { name: 'Pi (π)', symbol: 'π', value: '3.141592653589793', desc: 'Razão circunferência / diâmetro' },
    { name: 'Euler (e)', symbol: 'e', value: '2.718281828459045', desc: 'Base dos logaritmos naturais' },
    { name: 'Proporção Áurea (φ)', symbol: '((1+sqrt(5))/2)', value: '1.618033988749895', desc: 'Número de ouro / Phi' },
    { name: 'Raiz de 2 (√2)', symbol: 'sqrt(2)', value: '1.414213562373095', desc: 'Constante de Pitágoras' },
    { name: 'Log Natural de 2', symbol: 'ln(2)', value: '0.693147180559945', desc: 'ln(2)' },
    { name: 'Log Natural de 10', symbol: 'ln(10)', value: '2.302585092994046', desc: 'ln(10)' },
  ];

  const physicsConstants = [
    { name: 'Velocidade da Luz (c)', symbol: '299792458', unit: 'm/s', value: '2.99792e8', desc: 'Velocidade da luz no vácuo' },
    { name: 'Constante de Planck (h)', symbol: '6.62607015e-34', unit: 'J·s', value: '6.62607e-34', desc: 'Quantum de ação' },
    { name: 'Constante Gravitacional (G)', symbol: '6.67430e-11', unit: 'm³/(kg·s²)', value: '6.67430e-11', desc: 'Gravitação universal de Newton' },
    { name: 'Constante de Avogadro (NA)', symbol: '6.02214076e23', unit: 'mol⁻¹', value: '6.02214e23', desc: 'Partículas por mol' },
    { name: 'Constante de Boltzmann (kB)', symbol: '1.380649e-23', unit: 'J/K', value: '1.380649e-23', desc: 'Energia por grau de temperatura' },
    { name: 'Carga Elementar (e⁻)', symbol: '1.602176634e-19', unit: 'C', value: '1.60217e-19', desc: 'Carga elétrica de um próton/elétron' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Constantes Matemáticas e Físicas</h2>
              <p className="text-xs text-slate-400">Clique em qualquer constante para inseri-la no cálculo</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick('clear'); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Constantes Matemáticas */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              Constantes Matemáticas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mathConstants.map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playClick('num');
                    onInsert(c.symbol);
                    onClose();
                  }}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-200 group-hover:text-blue-300">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{c.desc}</div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-amber-400 font-bold block">{c.symbol}</span>
                    <span className="text-[10px] text-slate-400">{c.value.slice(0, 8)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constantes Físicas */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5 text-emerald-400" />
              Constantes Físicas Fundamentais (SI)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {physicsConstants.map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playClick('num');
                    onInsert(c.symbol);
                    onClose();
                  }}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-300">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{c.desc}</div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-emerald-400 font-bold block">{c.unit}</span>
                    <span className="text-[10px] text-slate-400">{c.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
