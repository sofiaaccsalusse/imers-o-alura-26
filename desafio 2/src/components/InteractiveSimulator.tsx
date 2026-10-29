import React, { useState } from 'react';
import { Play, RotateCcw, Cpu, Terminal, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

type OperationType = '1' | '2' | '3' | '4';

interface HistoryItem {
  id: string;
  operationName: string;
  symbol: string;
  num1: number;
  num2: number;
  result: number | string;
  isError: boolean;
  pythonCall: string;
}

export function InteractiveSimulator() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'passos'>('terminal');

  // Input states
  const [selectedOp, setSelectedOp] = useState<OperationType>('1');
  const [inputNum1, setInputNum1] = useState<string>('24');
  const [inputNum2, setInputNum2] = useState<string>('6');

  // Execution state
  const [outputLines, setOutputLines] = useState<string[]>([
    '========================================',
    '        CALCULADORA EM PYTHON        ',
    '========================================',
    '1 - Adição (+)',
    '2 - Subtração (-)',
    '3 - Multiplicação (*)',
    '4 - Divisão (/)',
    '5 - Sair',
    '========================================',
    'Pronto para executar! Escolha a operação e os números abaixo.'
  ]);

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'demo-1',
      operationName: 'Adição',
      symbol: '+',
      num1: 24,
      num2: 6,
      result: 30,
      isError: false,
      pythonCall: 'somar(24.0, 6.0) -> return 30.0'
    }
  ]);

  const [activeStep, setActiveStep] = useState<number>(1);

  const getOpDetails = (op: OperationType) => {
    switch (op) {
      case '1': return { name: 'Adição', symbol: '+', fn: 'somar' };
      case '2': return { name: 'Subtração', symbol: '-', fn: 'subtrair' };
      case '3': return { name: 'Multiplicação', symbol: '*', fn: 'multiplicar' };
      case '4': return { name: 'Divisão', symbol: '/', fn: 'dividir' };
    }
  };

  const handleRun = () => {
    const n1 = parseFloat(inputNum1);
    const n2 = parseFloat(inputNum2);

    if (isNaN(n1) || isNaN(n2)) {
      setOutputLines((prev) => [
        ...prev,
        `\n>>> [Erro no input]: Por favor, digite números válidos!`
      ]);
      return;
    }

    const op = getOpDetails(selectedOp);
    let result: number | string = 0;
    let isError = false;

    if (selectedOp === '1') {
      result = n1 + n2;
    } else if (selectedOp === '2') {
      result = n1 - n2;
    } else if (selectedOp === '3') {
      result = n1 * n2;
    } else if (selectedOp === '4') {
      if (n2 === 0) {
        result = 'Erro: Impossível dividir por zero!';
        isError = true;
      } else {
        result = n1 / n2;
      }
    }

    const newTerminalLines = [
      `\n----------------------------------------`,
      `>>> Escolha uma operação (1 a 5): ${selectedOp} (${op.name})`,
      `>>> Digite o primeiro número: ${n1}`,
      `>>> Digite o segundo número: ${n2}`,
      isError
        ? `>>> ${result}`
        : `>>> Resultado: ${n1} ${op.symbol} ${n2} = ${result}`,
      `>>> Deseja fazer outra operação? (s/n): s`
    ];

    setOutputLines((prev) => [...prev, ...newTerminalLines]);

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      operationName: op.name,
      symbol: op.symbol,
      num1: n1,
      num2: n2,
      result,
      isError,
      pythonCall: `${op.fn}(${n1}, ${n2}) -> ${isError ? result : `return ${result}`}`
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
    setActiveStep(4);
  };

  const handleClearTerminal = () => {
    setOutputLines([
      '========================================',
      '        CALCULADORA EM PYTHON        ',
      '========================================',
      'Terminal limpo. Execute uma nova operação.'
    ]);
  };

  const loadScenario = (op: OperationType, n1: string, n2: string) => {
    setSelectedOp(op);
    setInputNum1(n1);
    setInputNum2(n2);
  };

  const currentOpDetails = getOpDetails(selectedOp);
  const parsedN1 = parseFloat(inputNum1) || 0;
  const parsedN2 = parseFloat(inputNum2) || 0;

  return (
    <section id="simulador" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-1">
            Ambiente Prático
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Simulador Interativo da Calculadora
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Experimente a execução do código Python em tempo real e visualize como cada variável e função se comportam na memória.
          </p>
        </div>

        {/* Mode Selector Tabs (Segmented control) */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-slate-200/80 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Interativo</span>
          </button>

          <button
            onClick={() => setActiveTab('passos')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'passos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Passo a Passo na Memória</span>
          </button>
        </div>

        {/* Quick Test Scenarios Bar */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Cenários rápidos de teste:</span>
          <button
            onClick={() => loadScenario('1', '15', '25')}
            className="text-xs px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 cursor-pointer transition-colors"
          >
            Soma: 15 + 25
          </button>
          <button
            onClick={() => loadScenario('4', '10', '0')}
            className="text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md text-amber-900 font-medium cursor-pointer transition-colors"
            title="Veja o código tratando a divisão por zero com segurança"
          >
            Divisão por Zero: 10 / 0 ⚠️
          </button>
          <button
            onClick={() => loadScenario('3', '7.5', '4')}
            className="text-xs px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 cursor-pointer transition-colors"
          >
            Multiplicação: 7.5 * 4
          </button>
          <button
            onClick={() => loadScenario('2', '100', '37')}
            className="text-xs px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 cursor-pointer transition-colors"
          >
            Subtração: 100 - 37
          </button>
        </div>

        {/* 2-Zone Interactive Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Zone: Controls and Parameters Deck */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Parâmetros de Execução</span>
              <span className="text-[11px] font-mono font-normal text-slate-500">def calculadora()</span>
            </h3>

            {/* 1. Operation Select */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                1. Escolha a Operação <code className="text-amber-700 font-mono">(opcao)</code>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOp('1')}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                    selectedOp === '1'
                      ? 'border-amber-400 bg-amber-50/80 text-amber-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900">1 - Adição</div>
                  <div className="text-[11px] font-mono text-slate-500">somar(a, b) [+]</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOp('2')}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                    selectedOp === '2'
                      ? 'border-amber-400 bg-amber-50/80 text-amber-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900">2 - Subtração</div>
                  <div className="text-[11px] font-mono text-slate-500">subtrair(a, b) [-]</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOp('3')}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                    selectedOp === '3'
                      ? 'border-amber-400 bg-amber-50/80 text-amber-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900">3 - Multiplicação</div>
                  <div className="text-[11px] font-mono text-slate-500">multiplicar(a, b) [*]</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOp('4')}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                    selectedOp === '4'
                      ? 'border-amber-400 bg-amber-50/80 text-amber-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900">4 - Divisão</div>
                  <div className="text-[11px] font-mono text-slate-500">dividir(a, b) [/]</div>
                </button>
              </div>
            </div>

            {/* 2. Number Inputs */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primeiro número <code className="text-amber-700 font-mono">(num1)</code>
                </label>
                <input
                  type="number"
                  step="any"
                  value={inputNum1}
                  onChange={(e) => setInputNum1(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 text-slate-900"
                  placeholder="Ex: 10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Segundo número <code className="text-amber-700 font-mono">(num2)</code>
                </label>
                <input
                  type="number"
                  step="any"
                  value={inputNum2}
                  onChange={(e) => setInputNum2(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 text-slate-900"
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            {/* Division by zero warning if divisor is 0 */}
            {selectedOp === '4' && (parseFloat(inputNum2) === 0 || inputNum2 === '0') && (
              <div className="mb-5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Atenção educativa:</strong> Você definiu o divisor como <strong>0</strong>. Ao clicar em Executar, observe como a função <code>dividir()</code> ativará a trava de segurança <code>if b == 0:</code>!
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4 fill-slate-900" />
                <span>Executar no Python</span>
              </button>

              <button
                type="button"
                onClick={handleClearTerminal}
                className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
                title="Limpar tela do terminal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Python snippet preview */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Chamada Python Equivalente:
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto">
                <code>
                  resultado = {currentOpDetails.fn}({parsedN1 || 0}, {parsedN2 || 0})
                </code>
              </div>
            </div>
          </div>

          {/* Right Zone: Terminal Output or Step-by-Step Memory Visualizer */}
          <div className="lg:col-span-7">
            {activeTab === 'terminal' ? (
              /* Simulated Terminal */
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0c1017] shadow-md flex flex-col h-[460px]">
                {/* Terminal Header */}
                <div className="px-4 py-2 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-slate-300 font-semibold">Terminal: python3 calculadora.py</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">STDOUT</span>
                </div>

                {/* Terminal Screen */}
                <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-slate-200 space-y-1">
                  {outputLines.map((line, idx) => {
                    const isResult = line.includes('Resultado:');
                    const isError = line.includes('Erro:');
                    const isPrompt = line.startsWith('>>>');
                    return (
                      <div
                        key={idx}
                        className={`${
                          isResult
                            ? 'text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded'
                            : isError
                            ? 'text-rose-400 font-bold bg-rose-950/30 px-2 py-0.5 rounded'
                            : isPrompt
                            ? 'text-amber-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>

                {/* Terminal Status Bar */}
                <div className="px-4 py-2 bg-[#161b22] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Status: <strong className="text-emerald-400 font-mono">Processo Ativo (while True)</strong></span>
                  <span className="text-slate-500">Pressione Executar para enviar comandos</span>
                </div>
              </div>
            ) : (
              /* Memory & Step-by-Step Inspector */
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Inspeção de Variáveis na Memória RAM</span>
                  <span className="text-xs text-slate-500">Fluxo de Execução</span>
                </h3>

                {/* Step Stages Progression */}
                <div className="space-y-3 mb-6">
                  {/* Step 1 */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">Passo 1: Leitura da Opção do Menu</span>
                      <code className="text-[11px] font-mono text-amber-700">opcao = input()</code>
                    </div>
                    <div className="text-xs text-slate-600 font-mono bg-white p-2 rounded border border-slate-200">
                      Variável <strong className="text-slate-900">opcao</strong> = <span className="text-emerald-600">"{selectedOp}"</span> (tipo: <span className="text-slate-500">str</span>)
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">Passo 2: Conversão de Entrada com float()</span>
                      <code className="text-[11px] font-mono text-amber-700">float(input())</code>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <strong className="text-slate-900">num1</strong> = <span className="text-blue-600">{parsedN1.toFixed(1)}</span> (<span className="text-slate-500">float</span>)
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <strong className="text-slate-900">num2</strong> = <span className="text-blue-600">{parsedN2.toFixed(1)}</span> (<span className="text-slate-500">float</span>)
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">Passo 3: Desvio Condicional (if / elif)</span>
                      <code className="text-[11px] font-mono text-amber-700">if opcao == '{selectedOp}':</code>
                    </div>
                    <p className="text-xs text-slate-600">
                      O interpretador comparou a variável <code>opcao</code> e chamou a função correspondente: <strong className="text-slate-900">{currentOpDetails.fn}()</strong>.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/40">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-900">Passo 4: Retorno da Função ('return')</span>
                      <code className="text-[11px] font-mono text-emerald-700">return resultado</code>
                    </div>
                    <div className="text-xs font-mono bg-white p-2.5 rounded border border-amber-200">
                      {selectedOp === '4' && parsedN2 === 0 ? (
                        <div className="text-rose-600 font-bold">
                          Interrupção preventiva: b == 0 -&gt; Retornou "Erro: Impossível dividir por zero!"
                        </div>
                      ) : (
                        <div className="text-emerald-700 font-bold">
                          resultado = {currentOpDetails.fn}({parsedN1}, {parsedN2}) =&gt; {
                            selectedOp === '1' ? parsedN1 + parsedN2 :
                            selectedOp === '2' ? parsedN1 - parsedN2 :
                            selectedOp === '3' ? parsedN1 * parsedN2 :
                            (parsedN1 / parsedN2).toFixed(2)
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* History Log */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Últimas Operações Registradas:
                  </h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100 font-mono"
                      >
                        <div className="flex items-center gap-2">
                          {h.isError ? (
                            <span className="text-rose-600">❌</span>
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span className="text-slate-800 font-medium">{h.num1} {h.symbol} {h.num2}</span>
                        </div>
                        <span className={`font-semibold ${h.isError ? 'text-rose-600' : 'text-slate-900'}`}>
                          = {h.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
