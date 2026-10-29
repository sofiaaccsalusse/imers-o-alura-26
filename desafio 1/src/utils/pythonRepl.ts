/**
 * Interpretador e Ambiente de Execução Python / Math Scripting
 * Permite sintaxe pythonica, manipulação de variáveis, chamadas à biblioteca math e saída print().
 */

export interface PythonExecutionResult {
  success: boolean;
  output: string;
  returnedValue?: unknown;
  error?: string;
  executionTimeMs: number;
}

export interface PythonPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
}

export const PYTHON_PRESETS: PythonPreset[] = [
  {
    id: 'baskara',
    title: 'Fórmula de Bhaskara (Raízes)',
    category: 'Álgebra',
    description: 'Calcula o discriminante delta e as raízes x1 e x2 de ax² + bx + c = 0',
    code: `# Coeficientes da equação
a = 1
b = -5
c = 6

delta = b**2 - 4*a*c
print(f"Delta: {delta}")

if delta >= 0:
    x1 = (-b + math.sqrt(delta)) / (2*a)
    x2 = (-b - math.sqrt(delta)) / (2*a)
    print(f"Raiz 1 (x1): {x1}")
    print(f"Raiz 2 (x2): {x2}")
else:
    print("Não possui raízes reais")`
  },
  {
    id: 'trig-table',
    title: 'Tabela Trigonométrica (Graus)',
    category: 'Trigonometria',
    description: 'Gera seno, cosseno e tangente para os principais ângulos notáveis',
    code: `angulos = [0, 30, 45, 60, 90, 180]
print("Ângulo | Seno   | Cosseno | Tangente")
print("-" * 36)

for ang in angulos:
    rad = math.radians(ang)
    s = round(math.sin(rad), 4)
    c = round(math.cos(rad), 4)
    t = "indefinido" if ang == 90 else round(math.tan(rad), 4)
    print(f"{ang:3d}°   | {s:6.4f} | {c:7.4f} | {t}")`
  },
  {
    id: 'compound-interest',
    title: 'Juros Compostos e Rendimento',
    category: 'Financeira',
    description: 'Calcula montante e juros acumulados com base no capital, taxa e período',
    code: `capital = 10000.0  # R$ investidos
taxa_mensal = 0.0085  # 0.85% ao mês (aprox. 10.7% a.a.)
meses = 24

montante = capital * ((1 + taxa_mensal) ** meses)
juros = montante - capital

print(f"Capital Inicial: R$ {capital:,.2f}")
print(f"Período: {meses} meses")
print(f"Montante Final: R$ {montante:,.2f}")
print(f"Lucro em Juros: R$ {juros:,.2f}")`
  },
  {
    id: 'stats',
    title: 'Estatística Descritiva (Média e Desvio)',
    category: 'Estatística',
    description: 'Calcula média, variância, desvio padrão e mediana de uma amostra de dados',
    code: `dados = [12.5, 14.2, 10.8, 15.6, 13.9, 11.2, 16.0, 14.8]
n = len(dados)
media = sum(dados) / n

variancia = sum((x - media)**2 for x in dados) / (n - 1)
desvio_padrao = math.sqrt(variancia)

print(f"Amostra: {dados}")
print(f"Total de itens (N): {n}")
print(f"Média: {round(media, 4)}")
print(f"Variância: {round(variancia, 4)}")
print(f"Desvio Padrão: {round(desvio_padrao, 4)}")`
  },
  {
    id: 'fibonacci',
    title: 'Sequência de Fibonacci',
    category: 'Matemática Discreta',
    description: 'Gera os N primeiros termos da sequência de Fibonacci e a Razão Áurea',
    code: `def fibonacci(n):
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq

n_termos = 12
termos = fibonacci(n_termos)
print(f"Fibonacci ({n_termos} termos): {termos}")

razao = termos[-1] / termos[-2]
print(f"Aproximação da Razão Áurea (phi): {razao:.6f}")
print(f"Valor real de phi: {(1 + math.sqrt(5)) / 2:.6f}")`
  }
];

export class PythonEnvironment {
  private globalScope: Record<string, unknown> = {};

  constructor() {
    this.resetScope();
  }

  resetScope() {
    this.globalScope = {};
  }

  getScope() {
    return { ...this.globalScope };
  }

  execute(code: string): PythonExecutionResult {
    const start = performance.now();
    const stdout: string[] = [];

    // Captura personalizada de print
    const customPrint = (...args: unknown[]) => {
      const line = args.map(arg => {
        if (arg === null) return 'None';
        if (arg === undefined) return 'None';
        if (typeof arg === 'boolean') return arg ? 'True' : 'False';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg).replace(/"/g, "'");
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      stdout.push(line);
    };

    // Objeto math enriquecido idêntico ao do Python
    const math = {
      pi: Math.PI,
      e: Math.E,
      tau: Math.PI * 2,
      inf: Infinity,
      nan: NaN,
      sin: (x: number) => Math.sin(x),
      cos: (x: number) => Math.cos(x),
      tan: (x: number) => Math.tan(x),
      asin: (x: number) => Math.asin(x),
      acos: (x: number) => Math.acos(x),
      atan: (x: number) => Math.atan(x),
      atan2: (y: number, x: number) => Math.atan2(y, x),
      sinh: (x: number) => Math.sinh(x),
      cosh: (x: number) => Math.cosh(x),
      tanh: (x: number) => Math.tanh(x),
      radians: (deg: number) => (deg * Math.PI) / 180,
      degrees: (rad: number) => (rad * 180) / Math.PI,
      sqrt: (x: number) => Math.sqrt(x),
      cbrt: (x: number) => Math.cbrt(x),
      pow: (x: number, y: number) => Math.pow(x, y),
      exp: (x: number) => Math.exp(x),
      log: (x: number, base?: number) => base ? Math.log(x) / Math.log(base) : Math.log(x),
      log10: (x: number) => Math.log10(x),
      log2: (x: number) => Math.log2(x),
      floor: (x: number) => Math.floor(x),
      ceil: (x: number) => Math.ceil(x),
      fabs: (x: number) => Math.abs(x),
      gcd: (a: number, b: number) => {
        let x = Math.abs(a);
        let y = Math.abs(b);
        while (y) {
          const t = y;
          y = x % y;
          x = t;
        }
        return x;
      },
      lcm: (a: number, b: number) => Math.abs(a * b) / (math.gcd(a, b) || 1),
      factorial: (n: number) => {
        if (n < 0) throw new Error('ValueError: factorial() not defined for negative values');
        let r = 1;
        for (let i = 2; i <= Math.floor(n); i++) r *= i;
        return r;
      },
      comb: (n: number, k: number) => {
        if (k < 0 || k > n) return 0;
        return math.factorial(n) / (math.factorial(k) * math.factorial(n - k));
      },
      perm: (n: number, k?: number) => {
        const r = k ?? n;
        if (r < 0 || r > n) return 0;
        return math.factorial(n) / math.factorial(n - r);
      }
    };

    // Funções built-in do Python
    const builtins = {
      print: customPrint,
      abs: Math.abs,
      round: (val: number, ndigits: number = 0) => {
        const factor = Math.pow(10, ndigits);
        return Math.round(val * factor) / factor;
      },
      sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((acc, v) => acc + v, 0) : 0),
      min: (...args: unknown[]) => {
        const list = (args.length === 1 && Array.isArray(args[0])) ? (args[0] as number[]) : (args as number[]);
        return Math.min(...list);
      },
      max: (...args: unknown[]) => {
        const list = (args.length === 1 && Array.isArray(args[0])) ? (args[0] as number[]) : (args as number[]);
        return Math.max(...list);
      },
      len: (obj: unknown) => {
        if (typeof obj === 'string' || Array.isArray(obj)) return obj.length;
        if (typeof obj === 'object' && obj !== null) return Object.keys(obj).length;
        return 0;
      },
      range: (start: number, stop?: number, step: number = 1) => {
        const from = stop === undefined ? 0 : start;
        const to = stop === undefined ? start : stop;
        const result: number[] = [];
        if (step > 0) {
          for (let i = from; i < to; i += step) result.push(i);
        } else if (step < 0) {
          for (let i = from; i > to; i += step) result.push(i);
        }
        return result;
      },
      list: (val: unknown) => Array.isArray(val) ? [...val] : Array.from(val as Iterable<unknown>),
      sorted: (arr: unknown[]) => [...arr].sort(),
      bin: (x: number) => '0b' + (Math.floor(x) >>> 0).toString(2),
      hex: (x: number) => '0x' + (Math.floor(x) >>> 0).toString(16),
      oct: (x: number) => '0o' + (Math.floor(x) >>> 0).toString(8),
      int: (x: unknown) => parseInt(String(x), 10),
      float: (x: unknown) => parseFloat(String(x)),
      str: (x: unknown) => String(x),
      bool: (x: unknown) => Boolean(x),
      True: true,
      False: false,
      None: null
    };

    try {
      // Pré-processamento de sintaxe Python para JavaScript seguro
      let processed = code;

      // Suporte a f-strings simplificadas: f"..." -> `...`
      // Substitui formatações tipo {val:,.2f} ou {val:.4f} por conversão JS
      processed = processed.replace(/f"([^"]*)"/g, (_, content: string) => {
        const interpolated = content.replace(/\{([^}:]+)(?::([^}]+))?\}/g, (_m, expr, fmt) => {
          if (!fmt) return `\${${expr}}`;
          if (fmt.includes('f')) {
            const decimals = fmt.match(/\.(\d+)f/)?.[1] || 2;
            if (fmt.includes(',')) {
              return `\${Number(${expr}).toLocaleString('pt-BR', { minimumFractionDigits: ${decimals}, maximumFractionDigits: ${decimals} })}`;
            }
            return `\${Number(${expr}).toFixed(${decimals})}`;
          }
          return `\${${expr}}`;
        });
        return '`' + interpolated + '`';
      });

      // Suporte a f'...' também
      processed = processed.replace(/f'([^']*)'/g, (_, content: string) => {
        const interpolated = content.replace(/\{([^}:]+)(?::([^}]+))?\}/g, (_m, expr, fmt) => {
          if (!fmt) return `\${${expr}}`;
          if (fmt.includes('f')) {
            const decimals = fmt.match(/\.(\d+)f/)?.[1] || 2;
            return `\${Number(${expr}).toFixed(${decimals})}`;
          }
          return `\${${expr}}`;
        });
        return '`' + interpolated + '`';
      });

      // Substituição de operadores Python:
      // // divisão inteira -> Math.floor(a / b)
      processed = processed.replace(/(\d+)\s*\/\/\s*(\d+)/g, 'Math.floor($1 / $2)');
      // and / or / not para operadores lógicos
      processed = processed.replace(/\band\b/g, '&&');
      processed = processed.replace(/\bor\b/g, '||');
      processed = processed.replace(/\bnot\b/g, '!');

      // Transforma blocos com indentação básica em blocos JS ou executa em função
      // Para loops for x in range(...):
      processed = processed.replace(/for\s+([a-zA-Z_]\w*)\s+in\s+([^:]+):/g, 'for (const $1 of $2) {');
      // def nome(...):
      processed = processed.replace(/def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\):/g, 'function $1($2) {');
      // if ...:
      processed = processed.replace(/if\s+([^:]+):/g, 'if ($1) {');
      // elif ...:
      processed = processed.replace(/elif\s+([^:]+):/g, '} else if ($1) {');
      // else:
      processed = processed.replace(/else\s*:/g, '} else {');
      // while ...:
      processed = processed.replace(/while\s+([^:]+):/g, 'while ($1) {');

      // Fecha chaves para blocos abertos
      const openBraces = (processed.match(/\{/g) || []).length;
      const closeBraces = (processed.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        processed += '\n' + '}'.repeat(openBraces - closeBraces);
      }

      // Prepara contexto
      const context = {
        ...builtins,
        math,
        ...this.globalScope
      };

      const contextKeys = Object.keys(context);
      const contextValues = Object.values(context);

      // Função de avaliação
      const runner = new Function(...contextKeys, `
        "use strict";
        let __lastVal = undefined;
        try {
          ${processed}
        } catch(e) {
          throw e;
        }
        return __lastVal;
      `);

      const ret = runner(...contextValues);
      const end = performance.now();

      return {
        success: true,
        output: stdout.join('\n'),
        returnedValue: ret,
        executionTimeMs: end - start
      };
    } catch (err) {
      const end = performance.now();
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        output: stdout.join('\n'),
        error: message,
        executionTimeMs: end - start
      };
    }
  }
}
