/**
 * Motor Matemático Científico com suporte a cálculo avançado, precisão flutuante,
 * constantes e suíte de testes de validação integrados.
 */

export interface TestCase {
  name: string;
  expr: string;
  expected: number;
  mode: 'DEG' | 'RAD';
}

// 21 Test Cases exatos fornecidos pelo script do usuário
export const INITIAL_TEST_CASES: TestCase[] = [
  { name: 'Soma básica', expr: '2 + 2', expected: 4, mode: 'DEG' },
  { name: 'Precedência de operadores', expr: '2 + 3 * 4', expected: 14, mode: 'DEG' },
  { name: 'Parênteses', expr: '(2 + 3) * 4', expected: 20, mode: 'DEG' },
  { name: 'Divisão', expr: '20 / 4', expected: 5, mode: 'DEG' },
  { name: 'Subtração', expr: '10 - 4', expected: 6, mode: 'DEG' },
  { name: 'Seno em Graus: sin(30°)', expr: 'sin(30)', expected: 0.5, mode: 'DEG' },
  { name: 'Cosseno em Graus: cos(60°)', expr: 'cos(60)', expected: 0.5, mode: 'DEG' },
  { name: 'Tangente em Graus: tan(45°)', expr: 'tan(45)', expected: 1.0, mode: 'DEG' },
  { name: 'Arco Seno em Graus: asin(0.5)', expr: 'asin(0.5)', expected: 30.0, mode: 'DEG' },
  { name: 'Arco Cosseno em Graus: acos(0.5)', expr: 'acos(0.5)', expected: 60.0, mode: 'DEG' },
  { name: 'Arco Tangente em Graus: atan(1)', expr: 'atan(1)', expected: 45.0, mode: 'DEG' },
  { name: 'Seno em Radianos: sin(π/2)', expr: 'sin(π/2)', expected: 1.0, mode: 'RAD' },
  { name: 'Cosseno em Radianos: cos(π)', expr: 'cos(π)', expected: -1.0, mode: 'RAD' },
  { name: 'Potência livre: 2^3', expr: '2^3', expected: 8.0, mode: 'DEG' },
  { name: 'Quadrado: 5^2', expr: '5^2', expected: 25.0, mode: 'DEG' },
  { name: 'Raiz Quadrada: sqrt(16)', expr: 'sqrt(16)', expected: 4.0, mode: 'DEG' },
  { name: 'Logaritmo base 10: log(100)', expr: 'log(100)', expected: 2.0, mode: 'DEG' },
  { name: 'Logaritmo Natural: ln(e)', expr: 'ln(e)', expected: 1.0, mode: 'DEG' },
  { name: 'Constante Pi', expr: 'π', expected: Math.PI, mode: 'DEG' },
  { name: 'Constante Euler', expr: 'e', expected: Math.E, mode: 'DEG' },
  { name: 'Expressão combinada: sin(30) + 5', expr: 'sin(30) + 5', expected: 5.5, mode: 'DEG' }
];

// Fatorial Matemático
export const factorial = (n: number): number => {
  if (n < 0 || isNaN(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Limite de ponto flutuante JS
  let res = 1;
  for (let i = 2; i <= Math.floor(n); i++) res *= i;
  return res;
};

// Limpeza de precisão flutuante para evitar 0.49999999999999994
export const cleanPrecision = (val: number, precision: number = 10): number => {
  if (!isFinite(val)) return val;
  // Se for extremamente próximo de zero (ex: 6.123233995736766e-17 para cos(90))
  if (Math.abs(val) < 1e-14) return 0;
  return Number(val.toFixed(precision));
};

export const formatResult = (val: number): string => {
  if (isNaN(val)) return 'Erro';
  if (!isFinite(val)) return val > 0 ? '∞' : '-∞';

  const cleaned = cleanPrecision(val, 10);
  // Se o número for muito grande ou muito pequeno (fora de 1e-7 a 1e11), usa notação científica amigável
  if (Math.abs(cleaned) !== 0 && (Math.abs(cleaned) >= 1e12 || Math.abs(cleaned) < 1e-7)) {
    return cleaned.toExponential(6).replace('e+', 'e');
  }

  return cleaned.toString();
};

/**
 * Traduz e avalia expressões científicas com parênteses, funções trigonométricas,
 * fatoriais e multiplicação implícita.
 */
export const parseAndEvaluate = (expr: string, angleMode: 'DEG' | 'RAD' = 'DEG'): number => {
  if (!expr || expr.trim() === '') return 0;

  let code = expr.trim();
  code = code.replace(/×/g, '*').replace(/÷/g, '/');

  // Multiplicação Implícita (ex: 2π -> 2*π, 2(3) -> 2*(3), 2sin -> 2*sin)
  code = code.replace(/(\d)\(/g, '$1*(');
  code = code.replace(/\)(\d)/g, ')*$1');
  code = code.replace(/\)\(/g, ')*(');
  code = code.replace(/(\d)(π|\be\b)/g, '$1*$2');
  code = code.replace(/(π|\be\b)(\d)/g, '$1*$2');
  code = code.replace(/\)(π|\be\b)/g, ')*$1');
  code = code.replace(/(\d)(asin|acos|atan|sinh|cosh|tanh|sin|cos|tan|log|ln|sqrt|cbrt|abs)/g, '$1*$2');
  code = code.replace(/\)(asin|acos|atan|sinh|cosh|tanh|sin|cos|tan|log|ln|sqrt|cbrt|abs)/g, ')*$1');

  // Fatoriais
  code = code.replace(/\(([^()]+)\)!/g, 'factorial($1)');
  code = code.replace(/(\d+(\.\d+)?|π|\be\b)!/g, 'factorial($1)');

  // Constantes
  code = code.replace(/π/g, 'Math.PI');
  code = code.replace(/\be\b/g, 'Math.E');

  // Funções Trigonométricas protegidas por limites de palavra (\b)
  if (angleMode === 'DEG') {
    code = code.replace(/\basin\(/g, '(180/Math.PI)*Math.asin(');
    code = code.replace(/\bacos\(/g, '(180/Math.PI)*Math.acos(');
    code = code.replace(/\batan\(/g, '(180/Math.PI)*Math.atan(');
    code = code.replace(/\bsin\(/g, 'Math.sin((Math.PI/180)*');
    code = code.replace(/\bcos\(/g, 'Math.cos((Math.PI/180)*');
    code = code.replace(/\btan\(/g, 'Math.tan((Math.PI/180)*');
  } else {
    code = code.replace(/\basin\(/g, 'Math.asin(');
    code = code.replace(/\bacos\(/g, 'Math.acos(');
    code = code.replace(/\batan\(/g, 'Math.atan(');
    code = code.replace(/\bsin\(/g, 'Math.sin(');
    code = code.replace(/\bcos\(/g, 'Math.cos(');
    code = code.replace(/\btan\(/g, 'Math.tan(');
  }

  // Funções hiperbólicas
  code = code.replace(/\bsinh\(/g, 'Math.sinh(');
  code = code.replace(/\bcosh\(/g, 'Math.cosh(');
  code = code.replace(/\btanh\(/g, 'Math.tanh(');

  // Outras funções
  code = code.replace(/\blog\(/g, 'Math.log10(');
  code = code.replace(/\bln\(/g, 'Math.log(');
  code = code.replace(/\bsqrt\(/g, 'Math.sqrt(');
  code = code.replace(/\bcbrt\(/g, 'Math.cbrt(');
  code = code.replace(/\babs\(/g, 'Math.abs(');
  code = code.replace(/\^/g, '**');

  // Porcentagem: 50% de x ou 50%
  // Substitui número% seguido de nada ou operador por (número/100)
  code = code.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

  // Auto-fechar parênteses
  const openCount = (code.match(/\(/g) || []).length;
  const closeCount = (code.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    code += ')'.repeat(openCount - closeCount);
  }

  // Cria avaliador seguro com escopo restrito
  const evaluator = new Function('factorial', 'return ' + code);
  const result = evaluator(factorial);

  return result;
};

export interface TestResult {
  name: string;
  expr: string;
  expected: number;
  calculated: number;
  diff: number;
  passed: boolean;
  mode: 'DEG' | 'RAD';
  durationMs: number;
}

/**
 * Executa a bateria de testes automatizados conforme o script de validação
 */
export const runTestSuite = (testCases: TestCase[] = INITIAL_TEST_CASES): TestResult[] => {
  return testCases.map(test => {
    const start = performance.now();
    let calculated = NaN;
    try {
      calculated = parseAndEvaluate(test.expr, test.mode);
    } catch {
      calculated = NaN;
    }
    const end = performance.now();
    const diff = Math.abs(calculated - test.expected);
    // Tolerância idêntica à do script de validação PowerShell ($diff -lt 1e-9)
    const passed = !isNaN(calculated) && diff < 1e-9;

    return {
      name: test.name,
      expr: test.expr,
      expected: test.expected,
      calculated,
      diff,
      passed,
      mode: test.mode,
      durationMs: end - start
    };
  });
};
