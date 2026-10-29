export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Por que devemos converter a entrada do usuário com float(input(...)) em uma calculadora?",
    options: [
      "Porque o Python não aceita números sem o comando float.",
      "Porque input() sempre retorna uma string (texto); sem a conversão, '5' + '5' resultaria em '55'.",
      "Para que o código rode duas vezes mais rápido no processador.",
      "Porque a divisão só funciona se as variáveis tiverem exatamente o tipo int."
    ],
    correctIndex: 1,
    explanation: "Exato! A função input() sempre lê tudo o que você digita como texto (string). Se somarmos dois textos, o Python junta as palavras (concatenação). Usar float(...) transforma o texto em um número decimal verdadeiro."
  },
  {
    id: 2,
    question: "O que acontece em Python se tentarmos executar a instrução matemática 12 / 0 sem tratamento?",
    options: [
      "O resultado dá infinito (inf) sem nenhum aviso.",
      "O programa fecha silenciosamente sem mostrar nada.",
      "O Python interrompe o programa com o erro fatal ZeroDivisionError.",
      "O resultado automaticamente assume o valor zero (0)."
    ],
    correctIndex: 2,
    explanation: "Correto! Divisão por zero é matematicamente indefinida. Em Python, tentar dividir por 0 lança uma exceção ZeroDivisionError que encerra o programa abruptamente se não for protegida com 'if b == 0:' ou 'try/except'."
  },
  {
    id: 3,
    question: "Dentro de uma função, qual é a principal diferença entre os comandos 'return' e 'print()'?",
    options: [
      "'return' devolve o valor para a memória do programa para ser reutilizado; 'print()' apenas exibe texto na tela.",
      "'print()' encerra a função imediatamente, enquanto 'return' continua a execução.",
      "Não há diferença, ambos fazem exatamente a mesma coisa em Python.",
      "'return' só pode ser usado para números inteiros, e 'print()' apenas para textos."
    ],
    correctIndex: 0,
    explanation: "Muito bem! O comando 'return' é o que devolve o resultado para a variável que chamou a função, permitindo que você guarde o número ou faça outras contas. O 'print()' apenas desenha caracteres no console."
  },
  {
    id: 4,
    question: "Para que serve a instrução 'break' dentro de um laço de repetição 'while True:'?",
    options: [
      "Serve para pausar a execução por 5 segundos antes de continuar.",
      "Serve para reiniciar o computador caso o código trave.",
      "Serve para interromper imediatamente o laço e sair dele.",
      "Serve para reiniciar o laço do início ignorando as linhas de baixo."
    ],
    correctIndex: 2,
    explanation: "Perfeito! Como 'while True:' cria uma repetição infinita intencional, precisamos de uma condição de saída. Quando o usuário escolhe sair (por exemplo digitando '5'), o comando 'break' rompe o ciclo e finaliza o programa."
  }
];
