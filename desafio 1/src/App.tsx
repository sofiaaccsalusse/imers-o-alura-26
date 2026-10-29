/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Terminal,
  LineChart,
  Binary,
  Volume2,
  VolumeX,
  History,
  ShieldCheck,
  Atom,
  Copy,
  Check,
  Compass,
  Trophy,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap
} from 'lucide-react';
import { parseAndEvaluate, formatResult, cleanPrecision } from './utils/mathEngine';
import { sound } from './utils/sound';
import { fireConfetti } from './utils/confetti';
import { TestRunnerModal } from './components/TestRunnerModal';
import { GraphPlotter } from './components/GraphPlotter';
import { PythonConsole } from './components/PythonConsole';
import { ProgrammerKeypad } from './components/ProgrammerKeypad';
import { ConstantsModal } from './components/ConstantsModal';
import { UnitCircleVisualizer } from './components/UnitCircleVisualizer';
import { MathQuizGame } from './components/MathQuizGame';
import { DidacticExplainerPanel } from './components/DidacticExplainerPanel';
import { PiAiAssistant } from './components/PiAiAssistant';

type ActiveTab = 'calc' | 'ai' | 'circle' | 'quiz' | 'python' | 'graph' | 'programmer';

export default function App() {
  // Estados originais mantidos do código do usuário
  const [expression, setExpression] = useState('');
  const [subDisplay, setSubDisplay] = useState('');
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Array<{ expr: string; res: string; timestamp?: string }>>([]);

  // Estados adicionais didáticos e interativos
  const [activeTab, setActiveTab] = useState<ActiveTab>('calc');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showConstantsModal, setShowConstantsModal] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [copied, setCopied] = useState(false);
  const [lastCalculatedExpr, setLastCalculatedExpr] = useState<string>('');

  // Manipulação de dígitos
  const handleDigit = (digit: string) => {
    sound.playClick('num');
    if (isEvaluated) {
      setExpression(digit);
      setIsEvaluated(false);
    } else {
      setExpression(prev => prev + digit);
    }
  };

  // Manipulação de ponto decimal
  const handleDot = () => {
    sound.playClick('num');
    if (isEvaluated) {
      setExpression('0.');
      setIsEvaluated(false);
      return;
    }
    if (expression === '' || /[+\-×÷(^]$/.test(expression)) {
      setExpression(prev => prev + '0.');
    } else {
      const parts = expression.split(/[+\-×÷^()]/);
      if (!parts[parts.length - 1].includes('.')) {
        setExpression(prev => prev + '.');
      }
    }
  };

  // Operadores aritméticos
  const handleOp = (op: string) => {
    sound.playClick('op');
    setIsEvaluated(false);
    if (expression === '' && (op === '-' || op === '+')) {
      setExpression(op);
      return;
    }
    if (/[+\-×÷^]$/.test(expression)) {
      setExpression(prev => prev.slice(0, -1) + op);
    } else {
      setExpression(prev => prev + op);
    }
  };

  // Funções matemáticas
  const handleFunc = (fn: string) => {
    sound.playClick('func');
    if (isEvaluated) {
      setExpression(fn);
      setIsEvaluated(false);
    } else {
      setExpression(prev => prev + fn);
    }
  };

  // Limpeza geral (AC)
  const handleClear = () => {
    sound.playClick('clear');
    setExpression('');
    setSubDisplay('');
    setIsEvaluated(false);
    setLastCalculatedExpr('');
  };

  // Backspace (DEL)
  const handleBackspace = () => {
    sound.playClick('func');
    if (isEvaluated) {
      handleClear();
      return;
    }
    setExpression(prev => prev.slice(0, -1));
  };

  // Cálculo e avaliação com precisão garantida e validação
  const handleCalculate = () => {
    if (!expression) return;
    sound.playClick('equals');
    try {
      const rawExpr = expression;
      const res = parseAndEvaluate(expression, angleMode);
      if (res === undefined || isNaN(res) || !isFinite(res)) {
        setSubDisplay(rawExpr + ' =');
        setExpression('Erro');
        setIsEvaluated(true);
        return;
      }
      const formatted = formatResult(res);
      setSubDisplay(rawExpr + ' =');
      setLastCalculatedExpr(rawExpr);
      setExpression(formatted);
      setIsEvaluated(true);
      const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setHistory(prev => [{ expr: rawExpr, res: formatted, timestamp: timeStr }, ...prev.slice(0, 24)]);
    } catch {
      setSubDisplay(expression + ' =');
      setExpression('Erro');
      setIsEvaluated(true);
    }
  };

  // Copiar valor exibido
  const handleCopyDisplay = () => {
    sound.playClick('num');
    if (expression) {
      navigator.clipboard.writeText(expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // Alternar mudo
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Carregar expressão a partir do histórico, quizzes ou testes
  const handleLoadExpression = (expr: string, mode?: 'DEG' | 'RAD') => {
    if (mode) setAngleMode(mode);
    setExpression(expr);
    setIsEvaluated(false);
    setActiveTab('calc');
  };

  // Suporte a teclado global
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === '.') handleDot();
      else if (e.key === '+' || e.key === '-') handleOp(e.key);
      else if (e.key === '*') handleOp('×');
      else if (e.key === '/') { e.preventDefault(); handleOp('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleCalculate(); }
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
      else if (e.key === '(' || e.key === ')') handleFunc(e.key);
      else if (e.key === '^') handleOp('^');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, isEvaluated, angleMode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Bar Contract (3 Zonas: Brand, Links Didáticos, Ação Primária) */}
      <header className="w-full bg-slate-900 border-b border-slate-800/80 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Zona 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-serif font-black text-lg select-none">
              π
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold text-slate-100 tracking-tight flex items-center gap-0.5">
                <span className="text-blue-400 font-serif font-black">π</span>Calc
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-medium">Calculadora Científica &amp; Python</span>
            </div>
          </div>

          {/* Zona 2: Ações de Apoio & Validação */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Validador dos 21 testes unitários do script original */}
            <button
              onClick={() => { sound.playClick('func'); setShowTestModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title="Executar os 21 testes unitários com tolerância < 1e-9"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Validador (21 Testes)</span>
            </button>

            {/* Constantes Matemáticas & Físicas */}
            <button
              onClick={() => { sound.playClick('func'); setShowConstantsModal(true); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
              title="Constantes Fundamentais (Pi, Euler, Luz, Planck, etc.)"
            >
              <Atom className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Constantes</span>
            </button>

            {/* π AI (ao lado de Constantes) */}
            <button
              onClick={() => { sound.playClick('func'); setActiveTab('ai'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30'
              }`}
              title="Tirar dúvidas com a π AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>π AI</span>
            </button>

            {/* Alternador de Som (Feedback Mecânico) */}
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title={isMuted ? 'Ativar sons mecânicos' : 'Silenciar sons'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navegação por Abas Didáticas */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => { sound.playClick('func'); setActiveTab('calc'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'calc'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculadora</span>
          </button>

          <button
            onClick={() => { sound.playClick('func'); setActiveTab('ai'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>π AI</span>
          </button>

          <button
            onClick={() => { sound.playClick('func'); setActiveTab('circle'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'circle'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Círculo Trigonométrico</span>
          </button>

          <button
            onClick={() => { sound.playClick('func'); setActiveTab('quiz'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Desafio Math Quest</span>
          </button>

          <button
            onClick={() => { sound.playClick('func'); setActiveTab('python'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'python'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-yellow-400" />
            <span>Python Shell</span>
          </button>

          <button
            onClick={() => { sound.playClick('func'); setActiveTab('graph'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'graph'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gráficos 2D</span>
          </button>

          <button
            onClick={() => { sound.playClick('func'); setActiveTab('programmer'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'programmer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Binary className="w-3.5 h-3.5 text-purple-400" />
            <span>Programador</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">
        {/* ABA 1: CALCULADORA CIENTÍFICA DIDÁTICA */}
        {activeTab === 'calc' && (
          <div className="w-full max-w-lg flex flex-col gap-2 animate-fade-in">
            {/* Box Principal da Calculadora */}
            <div className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Barra de Status e Modos */}
              <div className="px-5 py-3 bg-slate-950 border-b border-slate-700/80 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-slate-200 font-display">
                    Calculadora Científica
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {/* Seletor DEG/RAD */}
                  <button
                    onClick={() => {
                      sound.playClick('func');
                      setAngleMode(m => (m === 'DEG' ? 'RAD' : 'DEG'));
                    }}
                    className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sky-400 transition-colors cursor-pointer"
                    title="Alternar entre Graus (DEG) e Radianos (RAD)"
                  >
                    {angleMode}
                  </button>

                  {/* Indicador de Memória M */}
                  {hasMemory && (
                    <span
                      className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      title={`Memória em uso: ${memory}`}
                    >
                      M: {memory}
                    </span>
                  )}

                  {/* Botão de Histórico */}
                  <button
                    onClick={() => {
                      sound.playClick('func');
                      setShowHistory(h => !h);
                    }}
                    className={`px-2.5 py-0.5 text-xs rounded-md border transition-colors cursor-pointer flex items-center gap-1 ${
                      showHistory
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
                    }`}
                    title="Ver histórico de cálculos recentes"
                  >
                    <History className="w-3 h-3" />
                    <span>Histórico</span>
                  </button>
                </div>
              </div>

              {/* Visor Duplo com Botão de Copiar */}
              <div className="p-5 bg-slate-950 border-b border-slate-700/80 text-right min-h-[110px] flex flex-col justify-end relative group">
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <button
                    onClick={handleCopyDisplay}
                    className="opacity-70 group-hover:opacity-100 p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
                    title="Copiar resultado atual"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span className="text-[10px]">{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="text-sm font-mono text-slate-400 min-h-[20px] overflow-x-auto whitespace-nowrap scrollbar-none">
                  {subDisplay}
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white overflow-x-auto whitespace-nowrap mt-1 tracking-wide scrollbar-none select-text">
                  {expression || '0'}
                </div>
              </div>

              {/* Gaveta de Histórico */}
              {showHistory && (
                <div className="p-3 bg-slate-900 border-b border-slate-700/80 max-h-44 overflow-y-auto text-xs font-mono animate-fade-in">
                  <div className="flex justify-between items-center mb-2 text-slate-400 font-sans">
                    <span className="font-semibold text-slate-300">Cálculos Recentes:</span>
                    <button
                      onClick={() => { sound.playClick('clear'); setHistory([]); }}
                      className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                    >
                      Limpar Histórico
                    </button>
                  </div>
                  {history.length === 0 ? (
                    <p className="text-center text-slate-500 italic py-2">Nenhum cálculo registrado ainda</p>
                  ) : (
                    history.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          sound.playClick('num');
                          setExpression(item.res);
                          setIsEvaluated(true);
                          setShowHistory(false);
                        }}
                        className="flex justify-between items-center p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group"
                        title="Clique para carregar no visor"
                      >
                        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-slate-400 group-hover:text-slate-200">{item.expr} =</span>
                          <span className="font-bold text-blue-400 group-hover:text-blue-300">{item.res}</span>
                        </div>
                        {item.timestamp && (
                          <span className="text-[10px] text-slate-500 ml-2 whitespace-nowrap">
                            {item.timestamp}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Botão de Expansão de Funções Extras */}
              <div className="px-4 pt-2 pb-1 flex items-center justify-between text-xs text-slate-400 bg-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400">
                  Compatível com Python `math`
                </span>
                <button
                  onClick={() => { sound.playClick('func'); setShowAdvanced(a => !a); }}
                  className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                >
                  <span>{showAdvanced ? 'Recolher Extras' : 'Mais Funções (sinh, cosh, |x|, %)'}</span>
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Gaveta de Funções Hiperbólicas / Extras */}
              {showAdvanced && (
                <div className="px-4 py-2 grid grid-cols-5 gap-2 bg-slate-800/60 border-b border-slate-700/40 text-xs animate-fade-in">
                  <button onClick={() => handleFunc('sinh(')} className="p-2 text-xs font-medium rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sky-300">sinh</button>
                  <button onClick={() => handleFunc('cosh(')} className="p-2 text-xs font-medium rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sky-300">cosh</button>
                  <button onClick={() => handleFunc('tanh(')} className="p-2 text-xs font-medium rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sky-300">tanh</button>
                  <button onClick={() => handleFunc('abs(')} className="p-2 text-xs font-medium rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sky-300">|x|</button>
                  <button onClick={() => handleOp('%')} className="p-2 text-xs font-medium rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sky-300">%</button>
                </div>
              )}

              {/* Grade de Botões Principal (Exata do Código Original) */}
              <div className="p-4 grid grid-cols-5 gap-2 select-none">
                {/* Memória e AC */}
                <button onClick={() => { sound.playClick('func'); setMemory(0); setHasMemory(false); }} className="p-2.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer">MC</button>
                <button onClick={() => { sound.playClick('num'); setExpression(prev => prev + memory.toString()); setIsEvaluated(false); }} className="p-2.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer">MR</button>
                <button onClick={() => { sound.playClick('func'); try { const v = parseAndEvaluate(expression, angleMode); if (!isNaN(v) && isFinite(v)) { setMemory(m => cleanPrecision(m + v)); setHasMemory(true); } } catch {} }} className="p-2.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer">M+</button>
                <button onClick={() => { sound.playClick('func'); try { const v = parseAndEvaluate(expression, angleMode); if (!isNaN(v) && isFinite(v)) { setMemory(m => cleanPrecision(m - v)); setHasMemory(true); } } catch {} }} className="p-2.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer">M-</button>
                <button onClick={handleClear} className="p-2.5 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors cursor-pointer">AC</button>

                {/* Funções 1 */}
                <button onClick={() => handleFunc('sin(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">sin</button>
                <button onClick={() => handleFunc('cos(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">cos</button>
                <button onClick={() => handleFunc('tan(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">tan</button>
                <button onClick={() => handleOp('^')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">xʸ</button>
                <button onClick={handleBackspace} className="p-2.5 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors cursor-pointer">DEL</button>

                {/* Funções 2 */}
                <button onClick={() => handleFunc('asin(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">sin⁻¹</button>
                <button onClick={() => handleFunc('acos(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">cos⁻¹</button>
                <button onClick={() => handleFunc('atan(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">tan⁻¹</button>
                <button onClick={() => handleFunc('sqrt(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">√x</button>
                <button onClick={() => handleOp('÷')} className="p-2.5 text-base font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer">÷</button>

                {/* Números 7, 8, 9 */}
                <button onClick={() => handleFunc('log(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">log</button>
                <button onClick={() => handleFunc('ln(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">ln</button>
                <button onClick={() => handleDigit('7')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">7</button>
                <button onClick={() => handleDigit('8')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">8</button>
                <button onClick={() => handleDigit('9')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">9</button>

                {/* Números 4, 5, 6 */}
                <button onClick={() => handleFunc('π')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">π</button>
                <button onClick={() => handleFunc('e')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">e</button>
                <button onClick={() => handleDigit('4')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">4</button>
                <button onClick={() => handleDigit('5')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">5</button>
                <button onClick={() => handleDigit('6')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">6</button>

                {/* Números 1, 2, 3 */}
                <button
                  onClick={() => {
                    sound.playClick('func');
                    if (expression && !/[+\-×÷(^]$/.test(expression)) setExpression(prev => prev + '!');
                  }}
                  className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Fatorial (n!)"
                >
                  n!
                </button>
                <button onClick={() => handleOp('^2')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">x²</button>
                <button onClick={() => handleDigit('1')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">1</button>
                <button onClick={() => handleDigit('2')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">2</button>
                <button onClick={() => handleDigit('3')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">3</button>

                {/* 0, Parênteses e Operadores */}
                <button onClick={() => handleFunc('(')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">(</button>
                <button onClick={() => handleFunc(')')} className="p-2.5 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-slate-700 transition-colors cursor-pointer">)</button>
                <button
                  onClick={() => {
                    sound.playClick('func');
                    if (!expression) return;
                    if (/^-?\d+(\.\d+)?$/.test(expression)) {
                      setExpression(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
                    } else {
                      setExpression(prev => `-(${prev})`);
                    }
                  }}
                  className="p-3 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                  title="Inverter sinal (±)"
                >
                  ±
                </button>
                <button onClick={() => handleDigit('0')} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">0</button>
                <button onClick={handleDot} className="p-3 text-base font-semibold rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer">.</button>

                {/* Operações e Igual */}
                <button onClick={() => handleOp('×')} className="p-2.5 text-base font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer">×</button>
                <button onClick={() => handleOp('-')} className="p-2.5 text-base font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer">-</button>
                <button onClick={() => handleOp('+')} className="p-2.5 text-base font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer">+</button>
                <button
                  onClick={handleCalculate}
                  className="col-span-2 p-3 text-lg font-bold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer"
                  title="Calcular resultado (= / Enter)"
                >
                  =
                </button>
              </div>
            </div>

            {/* Painel Didático Passo a Passo (Aparece após o cálculo) */}
            {isEvaluated && lastCalculatedExpr && (
              <DidacticExplainerPanel
                expression={lastCalculatedExpr}
                result={expression}
                angleMode={angleMode}
                onAskAi={() => setActiveTab('ai')}
              />
            )}
          </div>
        )}

        {/* ABA: π AI RESPONDE */}
        {activeTab === 'ai' && (
          <div className="w-full max-w-3xl animate-fade-in">
            <PiAiAssistant
              currentExpression={expression}
              lastResult={subDisplay}
              angleMode={angleMode}
              onSendToCalculator={(expr, mode) => {
                handleLoadExpression(expr, mode);
              }}
            />
          </div>
        )}

        {/* ABA 2: CÍRCULO TRIGONOMÉTRICO INTERATIVO */}
        {activeTab === 'circle' && (
          <div className="w-full max-w-2xl animate-fade-in">
            <UnitCircleVisualizer
              onSendToCalculator={(expr, mode) => {
                handleLoadExpression(expr, mode);
              }}
            />
          </div>
        )}

        {/* ABA 3: DESAFIO MATH & PYTHON QUEST */}
        {activeTab === 'quiz' && (
          <div className="w-full max-w-2xl animate-fade-in">
            <MathQuizGame
              onSendToCalculator={(expr, mode) => {
                handleLoadExpression(expr, mode);
              }}
            />
          </div>
        )}

        {/* ABA 4: PYTHON INTERACTIVE SHELL */}
        {activeTab === 'python' && (
          <div className="w-full max-w-4xl animate-fade-in">
            <PythonConsole
              onSendToCalculator={(val) => {
                setExpression(val);
                setActiveTab('calc');
              }}
            />
          </div>
        )}

        {/* ABA 5: GRÁFICOS 2D */}
        {activeTab === 'graph' && (
          <div className="w-full max-w-3xl animate-fade-in">
            <GraphPlotter
              currentExpression={expression.includes('x') ? expression : undefined}
              angleMode={angleMode}
            />
          </div>
        )}

        {/* ABA 6: PROGRAMADOR */}
        {activeTab === 'programmer' && (
          <div className="w-full max-w-lg bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Binary className="w-4 h-4 text-purple-400" />
                Modo Programador Python
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                HEX / BIN / OCT / Bitwise
              </span>
            </div>
            <ProgrammerKeypad
              onInsert={(val) => setExpression(prev => prev + val)}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onCalculate={handleCalculate}
            />
          </div>
        )}
      </main>

      {/* Rodapé Didático & Teclado */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-2.5 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Teclado físico habilitado: [Enter] Calcular, [Esc] Limpar, [^] Potência</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Tolerância de precisão: <code>&lt; 1e-9</code> · 21/21 Testes Validados
          </div>
        </div>
      </footer>

      {/* Modais */}
      <TestRunnerModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        onLoadExpression={handleLoadExpression}
      />

      <ConstantsModal
        isOpen={showConstantsModal}
        onClose={() => setShowConstantsModal(false)}
        onInsert={(val) => {
          if (isEvaluated) {
            setExpression(val);
            setIsEvaluated(false);
          } else {
            setExpression(prev => prev + val);
          }
        }}
      />
    </div>
  );
}
