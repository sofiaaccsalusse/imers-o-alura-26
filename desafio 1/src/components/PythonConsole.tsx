import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, BookOpen, Send, Sparkles } from 'lucide-react';
import { PythonEnvironment, PYTHON_PRESETS, PythonPreset } from '../utils/pythonRepl';
import { sound } from '../utils/sound';

interface PythonConsoleProps {
  onSendToCalculator?: (val: string) => void;
}

const pyEnv = new PythonEnvironment();

export const PythonConsole: React.FC<PythonConsoleProps> = ({ onSendToCalculator }) => {
  const [code, setCode] = useState<string>(PYTHON_PRESETS[0].code);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [lastReturned, setLastReturned] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(PYTHON_PRESETS[0].id);

  const runCode = () => {
    sound.playClick('equals');
    setError(null);
    const res = pyEnv.execute(code);
    setOutput(res.output);
    setExecTime(res.executionTimeMs);
    if (!res.success && res.error) {
      setError(res.error);
    } else if (res.returnedValue !== undefined) {
      setLastReturned(String(res.returnedValue));
    } else {
      setLastReturned(null);
    }
  };

  const handleSelectPreset = (preset: PythonPreset) => {
    sound.playClick('func');
    setSelectedPreset(preset.id);
    setCode(preset.code);
    setOutput('');
    setError(null);
  };

  const handleClearOutput = () => {
    sound.playClick('clear');
    setOutput('');
    setError(null);
    setExecTime(null);
    setLastReturned(null);
    pyEnv.resetScope();
  };

  const copyOutput = () => {
    sound.playClick('num');
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickSnippets = [
    { label: 'math.sqrt()', insert: 'math.sqrt(' },
    { label: 'math.sin()', insert: 'math.sin(math.radians(' },
    { label: 'math.pi', insert: 'math.pi' },
    { label: 'math.e', insert: 'math.e' },
    { label: 'print()', insert: 'print(' },
    { label: 'sum()', insert: 'sum([' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Python Math Shell (REPL)
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                math module active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Execute scripts matemáticos, loops, funções e cálculos avançados
            </p>
          </div>
        </div>

        {/* Presets dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Modelos:
          </span>
          <select
            value={selectedPreset}
            onChange={(e) => {
              const p = PYTHON_PRESETS.find(x => x.id === e.target.value);
              if (p) handleSelectPreset(p);
            }}
            className="flex-1 sm:flex-initial text-xs bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-blue-500"
          >
            {PYTHON_PRESETS.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Snippets */}
      <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-slate-500 font-mono">Snippets:</span>
        {quickSnippets.map((snip, i) => (
          <button
            key={i}
            onClick={() => {
              sound.playClick('num');
              setCode(prev => prev + snip.insert);
            }}
            className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-yellow-300 border border-slate-700/80 whitespace-nowrap transition-colors"
          >
            {snip.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Code Editor & Output Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-[300px]">
        {/* Editor Area */}
        <div className="flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              script.py
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sound.playClick('clear'); setCode(''); }}
                className="text-[11px] hover:text-white transition-colors"
              >
                Limpar Editor
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="# Digite seu código Python com biblioteca math aqui..."
            className="flex-1 w-full p-3 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-hidden focus:ring-1 focus:ring-blue-500/50"
            rows={12}
            spellCheck={false}
          />

          <div className="p-2.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              Pressione Executar ou use variáveis globais
            </span>
            <button
              onClick={runCode}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Executar Python
            </button>
          </div>
        </div>

        {/* Output Terminal */}
        <div className="flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-slate-400" />
              Terminal / stdout
            </span>
            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              )}
              <button
                onClick={handleClearOutput}
                className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Limpar
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 font-mono text-xs overflow-y-auto whitespace-pre-wrap select-text">
            {error ? (
              <div className="text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-800/50">
                <strong className="block mb-1">Traceback (most recent call last):</strong>
                {error}
              </div>
            ) : output ? (
              <div className="text-emerald-300 leading-relaxed">{output}</div>
            ) : (
              <div className="text-slate-600 italic py-8 text-center">
                Terminal pronto. Clique em "Executar Python" para ver a saída.
              </div>
            )}
          </div>

          {/* Terminal Footer with Execution metrics */}
          <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {execTime !== null ? (
                <span className="text-slate-300">
                  Executado em <strong className="text-blue-400">{execTime.toFixed(2)} ms</strong>
                </span>
              ) : (
                'Status: Pronto'
              )}
            </span>

            {/* If there's an extraction number or last line that looks like a number, allow sending to calculator */}
            {onSendToCalculator && output && (
              <button
                onClick={() => {
                  sound.playClick('func');
                  // Pega último número do output ou linha
                  const numbers = output.match(/-?\d+(\.\d+)?/g);
                  if (numbers && numbers.length > 0) {
                    onSendToCalculator(numbers[numbers.length - 1]);
                  }
                }}
                className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
                title="Transfere o último valor numérico para o visor da calculadora científica"
              >
                <Send className="w-3 h-3" />
                <span>Enviar para Calculadora</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
