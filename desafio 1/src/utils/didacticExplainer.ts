/**
 * Gerador de explicações didáticas passo a passo, conceitos matemáticos e dicas de Python
 * para estudantes e jovens curiosos.
 */

export interface DidacticStep {
  title: string;
  explanation: string;
  concept: string;
  pythonSyntax: string;
  funFact?: string;
}

export function explainExpression(expr: string, angleMode: 'DEG' | 'RAD', result: string): DidacticStep {
  const clean = expr.trim();

  // Caso 1: Seno
  if (/sin\(/i.test(clean)) {
    const isDeg = angleMode === 'DEG';
    return {
      title: 'Função Trigonométrica: Seno (sin)',
      concept: 'O seno de um ângulo em um triângulo retângulo é a razão entre o Cateto Oposto e a Hipotenusa (sen θ = Oposto / Hipotenusa). No Círculo Trigonométrico de raio 1, corresponde à altura vertical (eixo Y).',
      explanation: isDeg
        ? `No modo GRAUS (${angleMode}), o ângulo é medido de 0° a 360°. Para 30°, a projeção vertical no círculo é exatamente 0.5 (metade do raio unitário)!`
        : `No modo RADIANOS (${angleMode}), o ângulo é medido pelo comprimento do arco (π rad = 180°).`,
      pythonSyntax: isDeg ? `import math\nmath.sin(math.radians(${clean.replace(/sin\(|\)/g, '')}))` : `import math\nmath.sin(...)`,
      funFact: 'O termo "seno" vem da tradução do sânscrito "jiva" (corda de arco), que os árabes traduziram como "jaib" (dobra/baía) e os latinos como "sinus"!'
    };
  }

  // Caso 2: Cosseno
  if (/cos\(/i.test(clean)) {
    return {
      title: 'Função Trigonométrica: Cosseno (cos)',
      concept: 'O cosseno representa a projeção horizontal (eixo X) no círculo trigonométrico unitário (Cateto Adjacente / Hipotenusa).',
      explanation: `Em ${angleMode}, cos(60°) = 0.5 e cos(90°) = 0, pois a 90° o triângulo não tem projeção no eixo horizontal.`,
      pythonSyntax: `import math\nmath.cos(math.radians(...))`,
      funFact: 'Seno e Cosseno são ondas "irmãs" defasadas em exatamente 90 graus (π/2 radianos).'
    };
  }

  // Caso 3: Fatorial
  if (/!/.test(clean)) {
    return {
      title: 'Operação Fatorial (n!)',
      concept: 'O fatorial de um número natural n é o produto de todos os inteiros positivos menores ou iguais a n (ex: 5! = 5 × 4 × 3 × 2 × 1 = 120).',
      explanation: `Fatoriais crescem absurdamente rápido! Eles são a base de Análise Combinatória, permutações e probabilidade em jogos.`,
      pythonSyntax: `import math\nmath.factorial(${clean.replace('!', '')})`,
      funFact: '52! (fatorial de 52, número de cartas de um baralho) é maior que o número estimado de átomos em todo o planeta Terra!'
    };
  }

  // Caso 4: Raiz Quadrada
  if (/sqrt\(/i.test(clean)) {
    return {
      title: 'Radiciação: Raiz Quadrada (√)',
      concept: 'A raiz quadrada de um número x é o valor y que, multiplicado por si mesmo, resulta em x (y² = x). É a operação inversa da potência.',
      explanation: `Procuramos que número vezes ele mesmo dá o conteúdo da raiz. Por exemplo, √16 = 4 porque 4 × 4 = 16.`,
      pythonSyntax: `import math\nmath.sqrt(${clean.replace(/sqrt\(|\)/g, '')}) # ou 16 ** 0.5`,
      funFact: 'Calcular raiz de 2 foi o primeiro número irracional descoberto pelos gregos antigos (escola Pitagórica).'
    };
  }

  // Caso 5: Potência
  if (/\^|\*\*/.test(clean)) {
    return {
      title: 'Exponenciação / Potenciação (xʸ)',
      concept: 'Multiplicação repetida da base por ela mesma tantas vezes quanto indicar o expoente (ex: 2³ = 2 × 2 × 2 = 8).',
      explanation: `A potenciação segue regras fascinantes: qualquer número elevado a zero é 1 (x⁰ = 1), e expoente negativo inverte a fração (x⁻¹ = 1/x).`,
      pythonSyntax: `base ** expoente  # Ex: 2 ** 3 = 8`,
      funFact: 'Se você dobrar uma folha de papel comum 42 vezes, a espessura da folha alcançará a distância da Terra até a Lua!'
    };
  }

  // Caso 6: Precedência de Operadores (PEMDAS / BODMAS)
  if (/\+|\-/.test(clean) && (/\*|\/|×|÷/.test(clean) || /\(/.test(clean))) {
    return {
      title: 'Ordem de Precedência (PEMDAS)',
      concept: 'Parênteses () → Expoentes ^ → Multiplicação & Divisão ×/÷ → Adição & Subtração +/-.',
      explanation: `Em "${clean}", as multiplicações e divisões são resolvidas ANTES das somas e subtrações, a menos que haja parênteses forçando a prioridade!`,
      pythonSyntax: `# No Python, a precedência é idêntica à matemática formal:\nresultado = ${clean.replace(/×/g, '*').replace(/÷/g, '/')}`,
      funFact: 'Sem regras de precedência, computadores e calculadoras não saberiam se 2 + 3 × 4 daria 20 ou 14!'
    };
  }

  // Caso 7: Constantes Pi e Euler
  if (/π|Math\.PI/.test(clean)) {
    return {
      title: 'O Número Pi (π ≈ 3.14159...)',
      concept: 'Pi é a razão constante entre o perímetro de qualquer círculo e o seu diâmetro, independentemente do tamanho!',
      explanation: `É um número transcendental irracional: suas casas decimais continuam até o infinito sem jamais se repetirem em ciclo.`,
      pythonSyntax: `import math\nprint(math.pi)`,
      funFact: 'O recorde mundial de memorização de dígitos de Pi é de mais de 70.000 casas decimais!'
    };
  }

  // Padrão Geral Didático
  return {
    title: 'Avaliação da Expressão Matemática',
    concept: 'Processamento aritmético com motor de ponto flutuante de alta precisão.',
    explanation: `A expressão "${clean}" foi simplificada e calculada resultando em ${result}. Você pode testá-la diretamente no Python Shell usando os mesmos operadores!`,
    pythonSyntax: `resultado = ${clean.replace(/×/g, '*').replace(/÷/g, '/')}`,
    funFact: 'Em Python e computação moderna, divisões com barra "/" sempre retornam números de ponto flutuante (float)!'
  };
}
