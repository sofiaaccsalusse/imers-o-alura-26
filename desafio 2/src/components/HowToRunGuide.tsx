import React, { useState } from 'react';
import { Terminal, Laptop, Globe, Check, Copy } from 'lucide-react';

export function HowToRunGuide() {
  const [copiedCmd, setCopiedCmd] = useState<string>('');

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  return (
    <section id="como-executar" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-1">
            Passo a Passo Prático
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Como Executar a Calculadora no seu Computador
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Você não precisa de ferramentas complicadas para rodar seu primeiro programa Python. Siga este roteiro simples de 4 passos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Instale o Python
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acesse o site oficial <strong className="text-slate-800">python.org</strong> e baixe a versão recomendada para seu sistema operacional (Windows, Mac ou Linux).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded">
              <strong>Dica no Windows:</strong> Na tela de instalação, marque a caixinha <em>"Add Python to PATH"</em>!
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Salve o Código
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clique no botão <strong>Baixar calculadora.py</strong> no topo desta página ou crie um arquivo com esse nome no Bloco de Notas ou VS Code e cole o código.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
              Nome do arquivo: <strong>calculadora.py</strong>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Abra o Terminal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Abra o <strong>Prompt de Comando (cmd)</strong> ou <strong>PowerShell</strong> no Windows, ou o <strong>Terminal</strong> no Mac/Linux, e navegue até a pasta onde salvou o arquivo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded text-emerald-400 font-mono text-[11px]">
                <code>python --version</code>
                <button
                  type="button"
                  onClick={() => copyCommand('python --version')}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Copiar comando"
                >
                  {copiedCmd === 'python --version' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 font-bold text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Execute o Programa!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digite o comando abaixo e aperte <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Enter</kbd>. A calculadora iniciará imediatamente!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded text-amber-300 font-mono text-[11px]">
                <code>python calculadora.py</code>
                <button
                  type="button"
                  onClick={() => copyCommand('python calculadora.py')}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Copiar comando"
                >
                  {copiedCmd === 'python calculadora.py' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative: Online platforms */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Não quer instalar nada no seu computador agora?
              </div>
              <div className="text-xs text-slate-600">
                Você pode colar o código diretamente em ambientes online gratuitos como <strong>Google Colab</strong>, <strong>Replit</strong> ou <strong>Python.org Shell</strong>.
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Funciona em qualquer navegador
          </div>
        </div>
      </div>
    </section>
  );
}
