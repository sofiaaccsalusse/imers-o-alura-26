import React, { useState, useEffect } from 'react';
import { 
  Delete, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Terminal as TerminalIcon,
  Layers,
  Calculator as CalcIcon
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';

interface PresetExample {
  title: string;
  icon: string;
  n1: string;
  op: '+' | '-' | '*' | '/';
  n2: string;
  context: string;
}

const PRESET_EXAMPLES: PresetExample[] = [
  {
    title: 'Dividir a Conta da Pizza',
    icon: '🍕',
    n1: '80',
    op: '/',
    n2: '4',
    context: 'R$ 80,00 dividido igualmente entre 4 amigos.'
  },
  {
    title: 'Calcular o Troco',
    icon: '💵',
    n1: '50',
    op: '-',
    n2: '32.5',
    context: 'Pagou com nota de 50 para uma compra de 32,50.'
  },
  {
    title: 'Comprar Caixas no Atacado',
    icon: '📦',
    n1: '6',
    op: '*',
    n2: '12',
    context: '6 caixas com 12 refrigerantes cada.'
  },
  {
    title: 'Somar as Compras',
    icon: '🛒',
    n1: '25.40',
    op: '+',
    n2: '18.90',
    context: 'Somando dois itens no carrinho de supermercado.'
  },
  {
    title: 'Testar Divisão por Zero',
    icon: '⚠️',
    n1: '10',
    op: '/',
    n2: '0',
    context: 'Veja como o Python protege seu programa de travar!'
  }
];

export function VisualCalculator() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/' | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [lastCalculation, setLastCalculation] = useState<string>('');
  const [explanationText, setExplanationText] = useState<string>(
    'Clique nos botões da calculadora abaixo ou escolha um exemplo do cotidiano para ver a mágica do Python acontecer!'
  );
  const [isDivisionByZero, setIsDivisionByZero] = useState<boolean>(false);
  const [activeStepTab, setActiveStepTab] = useState<'codigo' | 'fluxo'>('codigo');

  // Handle number button click
  const inputDigit = (digit: string) => {
    setIsDivisionByZero(false);
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
      setExplanationText(`Você começou a digitar o segundo número: ${digit}.`);
    } else {
      const newValue = displayValue === '0' ? digit : displayValue + digit;
      setDisplayValue(newValue);
      setExplanationText(`Você digitou o valor ${newValue}. Em Python isso foi lido com input() e convertido para float.`);
    }
  };

  // Handle decimal dot
  const inputDecimal = () => {
    setIsDivisionByZero(false);
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
      setExplanationText('Adicionou casa decimal. No Python, números com ponto decimal são do tipo float.');
    }
  };

  // Handle operator (+, -, *, /)
  const handleOperator = (nextOperator: '+' | '-' | '*' | '/') => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setExplanationText(`Você escolheu a operação [${nextOperator}]. O Python guardou num1 = ${inputValue} na memória e agora aguarda o segundo número.`);
    } else if (operator) {
      const result = performCalculation(firstOperand, inputValue, operator);
      if (result === 'ERRO_ZERO') {
        setIsDivisionByZero(true);
        setDisplayValue('Erro');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        setLastCalculation(`${firstOperand} / 0`);
        setExplanationText('⚠️ Opa! Divisão por zero detectada. A trava "if b == 0:" impediu o Python de quebrar!');
        return;
      }
      setDisplayValue(String(result));
      setFirstOperand(result);
      setExplanationText(`Cálculo parcial executado: ${firstOperand} ${operator} ${inputValue} = ${result}.`);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (
    n1: number,
    n2: number,
    op: '+' | '-' | '*' | '/'
  ): number | 'ERRO_ZERO' => {
    switch (op) {
      case '+': return n1 + n2;
      case '-': return n1 - n2;
      case '*': return n1 * n2;
      case '/':
        if (n2 === 0) return 'ERRO_ZERO';
        return Number((n1 / n2).toFixed(6).replace(/\.?0+$/, ''));
      default: return n2;
    }
  };

  // Handle equal button (=)
  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);

    if (operator && firstOperand !== null) {
      const result = performCalculation(firstOperand, inputValue, operator);
      
      if (result === 'ERRO_ZERO') {
        setIsDivisionByZero(true);
        setDisplayValue('Erro: / 0');
        setLastCalculation(`${firstOperand} / 0`);
        setExplanationText('⚠️ Atenção: Na matemática e no Python, não podemos dividir por zero. O código executou o bloco especial "if b == 0:" que evitou o erro ZeroDivisionError!');
      } else {
        setIsDivisionByZero(false);
        setDisplayValue(String(result));
        setLastCalculation(`${firstOperand} ${operator} ${inputValue} = ${result}`);
        
        const opName = operator === '+' ? 'somar' : operator === '-' ? 'subtrair' : operator === '*' ? 'multiplicar' : 'dividir';
        setExplanationText(
          `Sucesso! A função "${opName}(${firstOperand}, ${inputValue})" foi executada no processador e devolveu ${result} via comando "return".`
        );
      }
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(true);
    }
  };

  // Clear all
  const handleClear = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setLastCalculation('');
    setIsDivisionByZero(false);
    setExplanationText('Calculadora reiniciada. Escolha novos números para calcular.');
  };

  // Delete last digit
  const handleDelete = () => {
    if (displayValue === 'Erro' || displayValue === 'Erro: / 0') {
      handleClear();
      return;
    }
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  // Load preset example
  const applyPreset = (example: PresetExample) => {
    setIsDivisionByZero(false);
    const n1 = parseFloat(example.n1);
    const n2 = parseFloat(example.n2);
    setFirstOperand(n1);
    setOperator(example.op);
    setDisplayValue(example.n2);
    setWaitingForSecondOperand(false);

    const result = performCalculation(n1, n2, example.op);
    if (result === 'ERRO_ZERO') {
      setIsDivisionByZero(true);
      setDisplayValue('Erro: / 0');
      setLastCalculation(`${n1} / 0`);
      setExplanationText(`⚠️ Exemplo prático: ${example.context} Veja como o Python impede o travamento.`);
    } else {
      setDisplayValue(String(result));
      setLastCalculation(`${n1} ${example.op} ${n2} = ${result}`);
      setExplanationText(`Exemplo carregado: ${example.context} O Python executou ${n1} ${example.op} ${n2} e calculou ${result}.`);
    }
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  // Keyboard support for real typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key as '+' | '-' | '*' | '/');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Generate dynamic live Python code
  const currentN1 = firstOperand !== null ? firstOperand : (parseFloat(displayValue) || 0);
  const currentN2 = waitingForSecondOperand ? 0 : (parseFloat(displayValue) || 0);
  const currentOp = operator || '+';
  const opFunctionName = 
    currentOp === '+' ? 'somar' : 
    currentOp === '-' ? 'subtrair' : 
    currentOp === '*' ? 'multiplicar' : 'dividir';

  const livePythonCode = isDivisionByZero
    ? `# ⚠️ CASO ESPECIAL: DIVISÃO POR ZERO
num1 = float("${firstOperand || 10}")
num2 = float("0")

# O Python entra nesta função:
def dividir(a, b):
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b

resultado = dividir(num1, num2)
print(resultado)
# Saída na tela: Erro: Não é possível dividir por zero!`
    : `# 1. O Python lê e converte os números
num1 = float("${currentN1}")
num2 = float("${currentN2}")

# 2. Definição da função da operação
def ${opFunctionName}(a, b):
    return a ${currentOp} b

# 3. Chamada da função e exibição
resultado = ${opFunctionName}(num1, num2)
print(f"Resultado: {num1} ${currentOp} {num2} = {resultado}")
# Saída na tela: Resultado: ${lastCalculation || `${currentN1} ${currentOp} ${currentN2} = ${performCalculation(currentN1, currentN2, currentOp)}`}`;

  const highlightedLiveCode = Prism.highlight(
    livePythonCode,
    Prism.languages.python || Prism.languages.javascript,
    'python'
  );

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-1">
            Simplicidade Total para Iniciantes
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Calculadora Interativa em Tempo Real
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Use a calculadora como você já está acostumado: clique nos botões numéricos ou use as teclas do seu teclado. Ao lado, observe exatamente <strong>qual código Python é gerado e executado em segundo plano</strong> a cada clique!
          </p>
        </div>

        {/* Preset Examples (1-Click Stories) */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Exemplos Prontos do Dia a Dia (Clique para Testar):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {PRESET_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyPreset(ex)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer hover:shadow-xs group ${
                  ex.op === '/' && ex.n2 === '0'
                    ? 'border-amber-300 bg-amber-50/60 hover:bg-amber-100/80'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{ex.icon}</span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-amber-700">
                    {ex.title}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-600 font-semibold">
                  {ex.n1} {ex.op} {ex.n2}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Two-Zone Layout: Left = Friendly Visual Calculator, Right = Live Python Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Tactile, beginner-friendly calculator device */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-800">
              
              {/* Calculator Header Brand */}
              <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-mono">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <span className="w-4 h-4 rounded bg-amber-400 text-slate-950 font-serif font-bold text-xs flex items-center justify-center leading-none">
                    π
                  </span>
                  <span>CALCULADORA πTHON</span>
                </span>
                <span className="text-[10px] text-slate-500">v3.x · 4 Operações</span>
              </div>

              {/* Calculator LCD Screen */}
              <div className="bg-[#1c2331] p-4 rounded-xl border border-slate-800 mb-4 text-right">
                {/* Secondary expression history */}
                <div className="text-xs font-mono text-slate-400 h-5 overflow-hidden text-ellipsis whitespace-nowrap">
                  {lastCalculation ? (
                    lastCalculation
                  ) : firstOperand !== null ? (
                    `${firstOperand} ${operator} ${waitingForSecondOperand ? '?' : displayValue}`
                  ) : (
                    'Digite ou escolha um número'
                  )}
                </div>
                {/* Main large display number */}
                <div className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white mt-1 overflow-x-auto ${
                  isDivisionByZero ? 'text-rose-400 text-2xl' : ''
                }`}>
                  {displayValue}
                </div>
              </div>

              {/* Button Keypad */}
              <div className="grid grid-cols-4 gap-2.5">
                {/* Row 1 */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="col-span-2 py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-[#ffb900] font-bold text-sm transition-colors cursor-pointer border border-slate-700"
                  style={{ color: '#ffb900' }}
                >
                  Limpar (C)
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-semibold text-sm transition-colors cursor-pointer border border-slate-700 flex items-center justify-center"
                  title="Apagar último dígito"
                >
                  <Delete className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOperator('/')}
                  className={`py-3 px-2 rounded-xl font-bold text-base transition-colors cursor-pointer border ${
                    operator === '/'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 border-amber-300'
                  }`}
                  title="Divisão (/)"
                >
                  ÷
                </button>

                {/* Row 2 */}
                <button
                  type="button"
                  onClick={() => inputDigit('7')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  7
                </button>
                <button
                  type="button"
                  onClick={() => inputDigit('8')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  8
                </button>
                <button
                  type="button"
                  onClick={() => inputDigit('9')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  9
                </button>
                <button
                  type="button"
                  onClick={() => handleOperator('*')}
                  className={`py-3 px-2 rounded-xl font-bold text-base transition-colors cursor-pointer border ${
                    operator === '*'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 border-amber-300'
                  }`}
                  title="Multiplicação (*)"
                >
                  ×
                </button>

                {/* Row 3 */}
                <button
                  type="button"
                  onClick={() => inputDigit('4')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => inputDigit('5')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  5
                </button>
                <button
                  type="button"
                  onClick={() => inputDigit('6')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  6
                </button>
                <button
                  type="button"
                  onClick={() => handleOperator('-')}
                  className={`py-3 px-2 rounded-xl font-bold text-base transition-colors cursor-pointer border ${
                    operator === '-'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 border-amber-300'
                  }`}
                  title="Subtração (-)"
                >
                  −
                </button>

                {/* Row 4 */}
                <button
                  type="button"
                  onClick={() => inputDigit('1')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => inputDigit('2')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => inputDigit('3')}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => handleOperator('+')}
                  className={`py-3 px-2 rounded-xl font-bold text-base transition-colors cursor-pointer border ${
                    operator === '+'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 border-amber-300'
                  }`}
                  title="Adição (+)"
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  type="button"
                  onClick={() => inputDigit('0')}
                  className="col-span-2 py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={inputDecimal}
                  className="py-3 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-mono font-semibold text-lg transition-colors cursor-pointer border border-slate-700/80"
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={handleEquals}
                  className="py-3 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold text-xl transition-colors cursor-pointer border border-emerald-400 shadow-md"
                  title="Calcular resultado (=)"
                >
                  =
                </button>
              </div>

              {/* Keyboard tip */}
              <div className="mt-3 text-center text-[11px] text-slate-500">
                Você também pode digitar diretamente no teclado físico!
              </div>
            </div>
          </div>

          {/* Right: Real-time Python Engine Explainer */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Explanation Balloon */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDivisionByZero
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-amber-50/70 border-amber-200 text-slate-900'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isDivisionByZero ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {isDivisionByZero ? <AlertTriangle className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-700">
                    O que está acontecendo por trás dos panos:
                  </div>
                  <p className="text-sm leading-relaxed font-medium">
                    {explanationText}
                  </p>
                </div>
              </div>
            </div>

            {/* Segmented Mode: Live Code vs Flow Diagram */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStepTab('codigo')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeStepTab === 'codigo'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TerminalIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Código Python em Execução</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStepTab('fluxo')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeStepTab === 'fluxo'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fluxo dos Dados (4 Etapas)</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-500">Sincronizado ao Vivo</span>
              </div>

              {activeStepTab === 'codigo' ? (
                /* Python Live Snippet */
                <div className="p-4 bg-[#0d1117] text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                  <pre tabIndex={0}>
                    <code
                      dangerouslySetInnerHTML={{ __html: highlightedLiveCode }}
                      className="language-python block"
                    />
                  </pre>
                </div>
              ) : (
                /* Step Flow Visualizer */
                <div className="p-5 space-y-3 bg-slate-50/50">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">Entrada do Usuário com input()</div>
                      <div className="text-slate-500">Você digitou no visor o valor "{displayValue}".</div>
                    </div>
                    <code className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      str: "{displayValue}"
                    </code>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">Conversão de Tipo com float()</div>
                      <div className="text-slate-500">O texto foi convertido em número decimal verdadeiro para fazer contas.</div>
                    </div>
                    <code className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      float({displayValue})
                    </code>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">Execução da Função def {opFunctionName}(a, b)</div>
                      <div className="text-slate-500">A lógica matemática é calculada de forma isolada e limpa.</div>
                    </div>
                    <code className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      return a {currentOp} b
                    </code>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">Exibição Formatada com F-String</div>
                      <div className="text-slate-500">O resultado final é retornado e desenhado na tela para você ver.</div>
                    </div>
                    <code className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      print(f"{'{resultado}'}")
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
