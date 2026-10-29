export interface ExplanationSection {
  id: string;
  title: string;
  subtitle: string;
  category: 'Sintaxe' | 'Lógica' | 'Boas Práticas' | 'Tratamento de Erros';
  pythonSnippet: string;
  explanation: string;
  bulletPoints: string[];
  beginnerPitfall: {
    mistake: string;
    why: string;
    fix: string;
  };
}

export const codeExplanations: ExplanationSection[] = [
  {
    id: 'funcoes',
    title: '1. Funções com "def" e "return"',
    subtitle: 'Organizando o código em blocos reutilizáveis',
    category: 'Boas Práticas',
    pythonSnippet: `def somar(a, b):
    """Retorna a soma de dois números."""
    return a + b

resultado = somar(10, 5)
print(resultado)  # Exibe 15`,
    explanation: `Uma função é como uma pequena máquina ou receita: ela recebe ingredientes (parâmetros 'a' e 'b'), executa uma instrução matemática e devolve o produto final através do comando 'return'. Sem funções, você teria que reescrever a mesma conta várias vezes no programa.`,
    bulletPoints: [
      "'def': Palavra reservada do Python que significa 'definir função'.",
      "Parâmetros (a, b): As variáveis que a função espera receber entre parênteses para trabalhar.",
      "'return': Ação crucial que entrega o resultado de volta para o código que a chamou. Atenção: 'return' NÃO é a mesma coisa que 'print'. 'return' entrega o valor para a memória; 'print' apenas desenha na tela."
    ],
    beginnerPitfall: {
      mistake: `def somar(a, b):\n    print(a + b)  # Erro comum: usar print em vez de return`,
      why: `Se você usar apenas print(), a função mostra o número na tela, mas não devolve nada para o programa. A variável que receberia o resultado ficará com o valor especial 'None'.`,
      fix: `Sempre use 'return a + b' para que você possa guardar o resultado, comparar ou usar em outras contas!`
    }
  },
  {
    id: 'entrada-conversao',
    title: '2. Entrada de Dados com "input()" e "float()"',
    subtitle: 'Por que o texto precisa virar número decimal',
    category: 'Sintaxe',
    pythonSnippet: `# ❌ Sem conversão: concatenação de texto!
# texto1 = input() -> "10"
# texto2 = input() -> "5"
# "10" + "5" = "105" (pegadinha clássica!)

# ✅ Com conversão:
num1 = float(input("Digite o primeiro número: "))
num2 = float(input("Digite o segundo número: "))
resultado = num1 + num2  # 10.0 + 5.0 = 15.0`,
    explanation: `A função 'input()' sempre lê tudo o que o usuário digita no teclado como TEXTO (o tipo 'str' em Python). Se o usuário digitar '5' e '5', para o Python são duas palavras; somar palavras apenas as junta lado a lado ("55"). Por isso usamos 'float()' para converter esse texto em um número decimal de verdade.`,
    bulletPoints: [
      "input('mensagem'): Exibe a pergunta na tela e aguarda o usuário digitar algo e teclar Enter.",
      "float(): Converte texto para número de ponto flutuante (com casas decimais, como 3.14 ou 2.0).",
      "Diferença entre int e float: 'int()' aceita apenas números inteiros (1, 2, 50). Se o usuário digitar 3.5 com int(), o programa gera erro. Usar 'float()' torna a calculadora flexível para qualquer número real."
    ],
    beginnerPitfall: {
      mistake: `n1 = input("Digite um número: ")  # usuário digita 4\nn2 = input("Digite outro: ")     # usuário digita 2\nprint(n1 + n2)                   # Exibe '42', não 6!`,
      why: `Em Python, o sinal de mais (+) entre dois textos une as palavras (concatenação), em vez de fazer soma aritmética.`,
      fix: `Envolva a leitura em float: float(input("Digite um número: "))`
    }
  },
  {
    id: 'condicionais',
    title: '3. Estruturas Condicionais: "if", "elif" e "else"',
    subtitle: 'Como o computador decide qual operação matemática executar',
    category: 'Lógica',
    pythonSnippet: `if opcao == '1':
    resultado = somar(num1, num2)
elif opcao == '2':
    resultado = subtrair(num1, num2)
elif opcao == '3':
    resultado = multiplicar(num1, num2)
elif opcao == '4':
    resultado = dividir(num1, num2)
else:
    print("Opção inválida!")`,
    explanation: `O computador não adivinha a intenção do usuário; ele segue fluxos lógicos. As palavras 'if' (se), 'elif' (senão se) e 'else' (caso contrário) avaliam a escolha do usuário e direcionam o programa para o bloco correto de código.`,
    bulletPoints: [
      "'if': Testa a primeira condição. Se for verdadeira, executa o bloco e ignora os seguintes.",
      "'elif' (abreviação de else if): Testa condições adicionais caso a anterior tenha sido falsa.",
      "'else': Executado apenas quando NENHUMA das opções acima foi atendida (ex: o usuário digitou '9').",
      "Indentação obrigatória: O recuo de 4 espaços à esquerda define o que pertence a cada condição. Em Python, a indentação não é apenas estética, é a sintaxe fundamental da linguagem!"
    ],
    beginnerPitfall: {
      mistake: `if opcao = '1':  # Usando apenas um sinal de igual!`,
      why: `Um único igual '=' é atribuição de valor a uma variável. Dois sinais '==' é a comparação de igualdade.`,
      fix: `Para comparar valores, sempre use dois sinais de igual: if opcao == '1':`
    }
  },
  {
    id: 'divisao-zero',
    title: '4. Proteção contra Divisão por Zero',
    subtitle: 'Evitando a temida falha ZeroDivisionError',
    category: 'Tratamento de Erros',
    pythonSnippet: `def dividir(a, b):
    # Antes de dividir, verificamos se o divisor (b) é zero!
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b`,
    explanation: `Na matemática, dividir qualquer número por zero é uma operação indefinida. No Python, se o seu código tentar executar '10 / 0', o interpretador interrompe a execução na hora com um erro fatal chamado ZeroDivisionError. Para que seu programa seja profissional e confiável, precisamos checar se o segundo número é zero antes de tentar a divisão.`,
    bulletPoints: [
      "ZeroDivisionError: O erro que trava o script caso a divisão por 0 ocorra sem tratamento.",
      "Validação preventiva: O comando 'if b == 0:' verifica o divisor antes que o erro ocorra.",
      "Mensagem amigável: Em vez de o terminal cuspir um log vermelho de erro, o usuário recebe uma explicação clara do que aconteceu."
    ],
    beginnerPitfall: {
      mistake: `def dividir(a, b):\n    return a / b  # Sem nenhuma validação`,
      why: `Se o usuário digitar 10 e 0, o programa fecha na cara do usuário com 'ZeroDivisionError: float division by zero'.`,
      fix: `Coloque sempre um teste if b == 0 antes da linha return a / b.`
    }
  },
  {
    id: 'laco-while',
    title: '5. Laço de Repetição com "while True"',
    subtitle: 'Mantendo a calculadora aberta para várias contas',
    category: 'Lógica',
    pythonSnippet: `while True:
    opcao = input("Escolha a opção (1-4 ou 5 para sair): ")
    if opcao == '5':
        print("Saindo...")
        break  # Interrompe o loop e finaliza

    # Se a opção for inválida, volta para o início do loop:
    if opcao not in ('1', '2', '3', '4'):
        print("Opção inválida!")
        continue  # Pula o resto e recomeça a pergunta`,
    explanation: `Um programa de terminal comum roda de cima para baixo e fecha imediatamente quando chega na última linha. Para que o usuário possa fazer várias contas seguidas sem ter que reiniciar o script pelo terminal todas as vezes, colocamos o menu dentro de um laço 'while True' (enquanto for verdade, repita).`,
    bulletPoints: [
      "'while True': Cria um loop infinito intencional que só para quando encontrar a palavra 'break'.",
      "'break': Rompe e sai imediatamente do laço de repetição.",
      "'continue': Ignora o restante do código daquela rodada e volta diretamente para o topo do loop.",
      "Controle do usuário: Perguntar no final 'Deseja continuar? (s/n)' dá autonomia para quem está usando."
    ],
    beginnerPitfall: {
      mistake: `while True:\n    opcao = input("...")\n    # Esquecer de colocar uma condição com 'break'`,
      why: `O programa ficará preso para sempre em loop infinito e o usuário só conseguirá fechar forçando o encerramento do terminal (Ctrl + C).`,
      fix: `Sempre defina uma opção clara de saída (ex: if opcao == '5': break).`
    }
  },
  {
    id: 'f-strings',
    title: '6. Formatação Moderna com F-Strings',
    subtitle: 'Inserindo variáveis dentro de textos de forma legível',
    category: 'Sintaxe',
    pythonSnippet: `num1 = 8.5
num2 = 2.0
resultado = num1 * num2

# ✅ Forma moderna e legível com f-string:
print(f"Resultado: {num1} * {num2} = {resultado}")
# Saída: Resultado: 8.5 * 2.0 = 17.0`,
    explanation: `Para exibir mensagens amigáveis juntando textos fixos com os valores das contas, o Python introduziu as F-Strings (colocando a letra 'f' antes das aspas). Tudo o que você colocar dentro de chaves { } é avaliado e substituído pelo seu valor real automaticamente.`,
    bulletPoints: [
      "A letra 'f' antes da string: Sinaliza para o interpretador que o texto contém expressões entre chaves.",
      "{variavel}: As chaves inserem diretamente o valor numérico sem precisar de conversões manuais como str(num).",
      "Formatação decimal opcional: Você pode formatar casas decimais facilmente, ex: {resultado:.2f} mostra o número com apenas 2 casas decimais (ex: 3.14)."
    ],
    beginnerPitfall: {
      mistake: `print("Resultado: " + num1 + " + " + num2 + " = " + resultado)`,
      why: `Isso resulta em 'TypeError: can only concatenate str to str, not float'. É confuso e propenso a erros.`,
      fix: `Prefira sempre as f-strings: print(f"Resultado: {num1} + {num2} = {resultado}")`
    }
  }
];
