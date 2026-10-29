import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Play, RefreshCw, X, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { runTestSuite, TestResult, INITIAL_TEST_CASES, TestCase } from '../utils/mathEngine';
import { sound } from '../utils/sound';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExpression: (expr: string, mode: 'DEG' | 'RAD') => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({
  isOpen,
  onClose,
  onLoadExpression
}) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [customTests] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');

  const executeTests = () => {
    setIsRunning(true);
    sound.playClick('func');
    setTimeout(() => {
      const testResults = runTestSuite(customTests);
      setResults(testResults);
      setIsRunning(false);
      sound.playClick('equals');
      if (testResults.every(r => r.passed)) {
        import('../utils/confetti').then(m => m.fireConfetti(2500));
      }
    }, 150);
  };

  useEffect(() => {
    if (isOpen && results.length === 0) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPassed = results.filter(r => r.passed).length;
  const passRate = results.length > 0 ? ((totalPassed / results.length) * 100).toFixed(0) : '0';
  const filteredResults = results.filter(r => {
    if (filter === 'passed') return r.passed;
    if (filter === 'failed') return !r.passed;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Suíte de Validação Matemática
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  PowerShell / Python Spec
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                21 casos de teste com tolerância estrita &lt; 1e-9 (trigonometria, fatoriais, logaritmos e constantes)
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick('clear'); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Banner */}
        <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Total de Testes</span>
            <span className="text-base font-bold text-white font-mono">{results.length}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Aprovações</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {totalPassed} / {results.length}
            </span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Taxa de Acerto</span>
            <span className="text-base font-bold text-blue-400 font-mono">{passRate}%</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Critério Diff</span>
            <span className="text-base font-bold text-amber-400 font-mono">&lt; 1e-9</span>
          </div>
        </div>

        {/* Filter bar & Actions */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              Todos ({results.length})
            </button>
            <button
              onClick={() => setFilter('passed')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                filter === 'passed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              Passou ({totalPassed})
            </button>
            {results.length - totalPassed > 0 && (
              <button
                onClick={() => setFilter('failed')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  filter === 'failed'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                Falhou ({results.length - totalPassed})
              </button>
            )}
          </div>

          <button
            onClick={executeTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            Reexecutar Testes
          </button>
        </div>

        {/* Test List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredResults.map((test, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                test.passed
                  ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  : 'bg-rose-950/20 border-rose-800/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{test.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {test.mode}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-xs">
                    <span className="text-blue-400 font-semibold">{test.expr}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-slate-300">
                      Calculado:{' '}
                      <strong className={test.passed ? 'text-emerald-300' : 'text-rose-400'}>
                        {isNaN(test.calculated) ? 'Erro' : test.calculated}
                      </strong>
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">Esperado: {test.expected}</span>
                  </div>
                  {test.diff > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      Δ diff: {test.diff.toExponential(3)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    test.passed
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {test.passed ? 'PASSOU' : 'FALHOU'}
                </span>
                <button
                  onClick={() => {
                    sound.playClick('num');
                    onLoadExpression(test.expr, test.mode);
                    onClose();
                  }}
                  className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
                  title="Abrir e calcular no visor principal"
                >
                  <span>Testar no Visor</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Validação em tempo de execução via motor matemático otimizado</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
