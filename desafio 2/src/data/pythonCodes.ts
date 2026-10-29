export interface CodeLevel {
  id: 'basico' | 'estruturado' | 'robusto';
  title: string;
  badge: string;
  description: string;
  code: string;
  filename: string;
}

export const pythonCodeLevels: CodeLevel[] = [
  {
    id: 'estruturado',
    title: 'Nível 2: Estruturado com Funções (Recomendado)',
    badge: 'Boas Práticas',
    description: 'Código modular com funções dedicadas para cada operação, menu interativo e validação de divisão por zero.',
    filename: 'calculadora.py',
    code: `# ==========================================================
# CALCULADORA SIMPLES EM PYTHON - QUATRO OPERAÇÕES BÁSICAS
# Criada especialmente para iniciantes em programação!
# ==========================================================

# 1. DEFINIÇÃO DAS FUNÇÕES MATEMÁTICAS
# O comando 'def' cria uma função reutilizável.
# O comando 'return' devolve o resultado da conta.

def somar(a, b):
    """Realiza a adição de dois números."""
    return a + b

def subtrair(a, b):
    """Realiza a subtração de dois números."""
    return a - b

def multiplicar(a, b):
    """Realiza a multiplicação de dois números."""
    return a * b

def dividir(a, b):
    """Realiza a divisão de dois números.
    Importante: protege o programa contra divisão por zero!
    """
    if b == 0:
        return "Erro: Impossível dividir por zero!"
    return a / b

# 2. FUNÇÃO PRINCIPAL QUE CONTROLA O MENU E FLUXO DO PROGRAMA
def calculadora():
    print("=" * 40)
    print("        CALCULADORA EM PYTHON        ")
    print("=" * 40)
    print("1 - Adição (+)")
    print("2 - Subtração (-)")
    print("3 - Multiplicação (*)")
    print("4 - Divisão (/)")
    print("5 - Sair")
    print("=" * 40)

    # Loop 'while True' mantém a calculadora aberta até o usuário pedir para sair
    while True:
        # Entrada da opção escolhida
        opcao = input("\\nEscolha uma operação (1 a 5): ").strip()

        # Condição para encerrar o programa
        if opcao == '5':
            print("Obrigado por usar a calculadora. Até mais!")
            break

        # Validação se a opção é válida
        if opcao not in ('1', '2', '3', '4'):
            print("Opção inválida! Escolha um número entre 1 e 5.")
            continue

        # Entrada dos números com conversão de texto (str) para número decimal (float)
        num1 = float(input("Digite o primeiro número: "))
        num2 = float(input("Digite o segundo número: "))

        # Estrutura condicional (if / elif) para chamar a função correta
        if opcao == '1':
            resultado = somar(num1, num2)
            print(f"Resultado: {num1} + {num2} = {resultado}")

        elif opcao == '2':
            resultado = subtrair(num1, num2)
            print(f"Resultado: {num1} - {num2} = {resultado}")

        elif opcao == '3':
            resultado = multiplicar(num1, num2)
            print(f"Resultado: {num1} * {num2} = {resultado}")

        elif opcao == '4':
            resultado = dividir(num1, num2)
            if isinstance(resultado, str):
                print(resultado)  # Mostra a mensagem de erro da divisão por zero
            else:
                print(f"Resultado: {num1} / {num2} = {resultado}")

        # Pergunta se o usuário quer fazer outro cálculo
        continuar = input("\\nDeseja fazer outra operação? (s/n): ").strip().lower()
        if continuar != 's':
            print("Encerrando a calculadora. Bons estudos de programação!")
            break

# 3. PONTO DE PARTIDA DO PROGRAMA
if __name__ == "__main__":
    calculadora()
`
  },
  {
    id: 'basico',
    title: 'Nível 1: Super Simples (Direto ao Ponto)',
    badge: '1º Dia de Aula',
    description: 'Sem funções e sem loops repetitivos. Ideal para quem acabou de instalar o Python e quer ver o resultado em 15 linhas.',
    filename: 'calculadora_basica.py',
    code: `# ==========================================================
# CALCULADORA BÁSICA (DIRETO AO PONTO)
# Sem loops ou funções extras - perfeito para os primeiros passos!
# ==========================================================

print("=== CALCULADORA BÁSICA ===")
print("Operações disponíveis: +, -, *, /")

# 1. Recebendo os dados do usuário
num1 = float(input("Digite o primeiro número: "))
operacao = input("Digite o símbolo da operação (+, -, *, /): ")
num2 = float(input("Digite o segundo número: "))

# 2. Tomando decisões com if, elif e else
if operacao == "+":
    resultado = num1 + num2
    print(f"Resultado: {num1} + {num2} = {resultado}")

elif operacao == "-":
    resultado = num1 - num2
    print(f"Resultado: {num1} - {num2} = {resultado}")

elif operacao == "*":
    resultado = num1 * num2
    print(f"Resultado: {num1} * {num2} = {resultado}")

elif operacao == "/":
    if num2 == 0:
        print("Erro: Não é possível dividir por zero!")
    else:
        resultado = num1 / num2
        print(f"Resultado: {num1} / {num2} = {resultado}")

else:
    print("Operação inválida! Use apenas +, -, * ou /.")
`
  },
  {
    id: 'robusto',
    title: 'Nível 3: Robusto com Tratamento de Erros (Try/Except)',
    badge: 'Pronto para Produção',
    description: 'Protegido contra o usuário digitar letras ou símbolos nos números usando blocos try/except ValueError.',
    filename: 'calculadora_robusta.py',
    code: `# ==========================================================
# CALCULADORA ROBUSTA COM TRATAMENTO DE ERROS (TRY / EXCEPT)
# Não quebra mesmo se o usuário digitar letras no lugar de números!
# ==========================================================

def somar(a, b): return a + b
def subtrair(a, b): return a - b
def multiplicar(a, b): return a * b
def dividir(a, b):
    if b == 0:
        return None  # Indica que a divisão não pôde ser calculada
    return a / b

def ler_numero(mensagem):
    """Função auxiliar que insiste até o usuário digitar um número válido."""
    while True:
        try:
            return float(input(mensagem))
        except ValueError:
            print("❌ Entrada inválida! Por favor, digite um número (ex: 10 ou 3.5).")

def main():
    while True:
        print("\\n" + "=" * 35)
        print("    CALCULADORA SEGURA EM PYTHON   ")
        print("=" * 35)
        print("1. Adição (+)")
        print("2. Subtração (-)")
        print("3. Multiplicação (*)")
        print("4. Divisão (/)")
        print("0. Sair")

        opcao = input("Escolha uma opção (0-4): ").strip()

        if opcao == '0':
            print("Saindo do programa. Até a próxima!")
            break

        if opcao not in ('1', '2', '3', '4'):
            print("Opção inválida! Escolha entre 0 e 4.")
            continue

        # Usando a função segura de leitura
        n1 = ler_numero("Digite o 1º número: ")
        n2 = ler_numero("Digite o 2º número: ")

        if opcao == '1':
            print(f"✅ Resultado: {n1} + {n2} = {somar(n1, n2)}")
        elif opcao == '2':
            print(f"✅ Resultado: {n1} - {n2} = {subtrair(n1, n2)}")
        elif opcao == '3':
            print(f"✅ Resultado: {n1} * {n2} = {multiplicar(n1, n2)}")
        elif opcao == '4':
            res = dividir(n1, n2)
            if res is None:
                print("❌ Erro matemático: Não é possível dividir nenhum número por zero!")
            else:
                print(f"✅ Resultado: {n1} / {n2} = {res}")

if __name__ == "__main__":
    main()
`
  }
];
