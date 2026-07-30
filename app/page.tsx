import React from 'react';
import Link from 'next/link';
import { 
  AquaOrbLogo, 
  AquaDocumentIcon, 
  AquaUploadIcon, 
  AquaScanLensIcon, 
  AquaShieldIcon, 
  AquaArrowRightIcon,
  AquaCheckIcon,
  AquaWindowBar
} from '@/components/GlassAquaIcons';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-white pb-16 relative overflow-hidden">
      {/* Y2K Frutiger Aero Liquid Glass Background Meshes */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/15 blur-[120px] -z-10 pointer-events-none"></div>

      {/* Header Bar - Apple Aqua Glass Toolbar */}
      <header className="px-6 sm:px-10 py-4 border-b border-white/20 bg-slate-900/60 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3.5 group cursor-default">
            {/* Custom Handcrafted Aqua Orb Logo */}
            <div className="p-1 rounded-2xl glass-aqua-pill shadow-lg group-hover:scale-105 transition-transform duration-300">
              <AquaOrbLogo className="w-9 h-9" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-xl text-white flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                LedgerIQ
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 shadow-inner">PRO</span>
              </span>
              <span className="text-[10px] text-blue-200/70 font-medium tracking-wide">Auditoria & Extração de Documentos Fiscais</span>
            </div>
          </div>
          
          <Link 
            href="/dashboard" 
            className="px-5 py-2.5 glass-aqua-button-primary text-white text-xs font-bold tracking-wide rounded-full transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg"
          >
            <span>Acessar o Painel</span>
            <AquaArrowRightIcon className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-20 flex flex-col gap-24 relative">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-aqua-pill text-xs font-medium text-blue-200 mb-8 shadow-xl cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
            </span>
            <span className="tracking-wide text-[11px] font-semibold uppercase text-blue-100">Motor de Inteligência Fiscal Nível Corporativo</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
            Automação & Auditoria <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-100 to-white drop-shadow-sm">
              de Notas Fiscais
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mt-6 leading-relaxed font-normal text-balance drop-shadow-md">
            Extraia, valide e categorize despesas corporativas com precisão contábil.
            Arquitetura 100% cliente para máxima privacidade de dados financeiros.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-5">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 glass-aqua-button-primary text-white rounded-full font-extrabold text-sm tracking-wide flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-blue-900/50 group"
            >
              <span>Abrir Dashboard de Auditoria</span>
              <AquaArrowRightIcon className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-2 bg-slate-900/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <AquaCheckIcon className="w-3.5 h-3.5 text-cyan-400" /> Sem Login Obrigatório
            </span>
            <span className="flex items-center gap-2 bg-slate-900/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <AquaCheckIcon className="w-3.5 h-3.5 text-cyan-400" /> Retenção no Navegador (localStorage)
            </span>
            <span className="flex items-center gap-2 bg-slate-900/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <AquaCheckIcon className="w-3.5 h-3.5 text-cyan-400" /> Exportação Direta em CSV
            </span>
          </div>
        </section>

        {/* Feature Bento Grid - Glass Cards */}
        <section className="relative z-10">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-300 mb-2 drop-shadow">Arquitetura de Alta Fidelidade</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Capacidades da Plataforma</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="group glass-aqua-card p-8 rounded-3xl hover:border-white/40 transition-all duration-300 flex flex-col justify-between">
              <AquaWindowBar title="Visão Computacional" />
              <div>
                <div className="w-12 h-12 rounded-2xl glass-aqua-pill flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <AquaScanLensIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight drop-shadow-sm">Leitura OCR e Visão Computacional</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Identifica automaticamente CNPJ do fornecedor, chave de acesso de 44 dígitos, data de emissão e valor total a partir de cupons fiscais e DANFEs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-200/80">
                <span>Extração NFC-e / NF-e</span>
                <span>Nível 1</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group glass-aqua-card p-8 rounded-3xl hover:border-white/40 transition-all duration-300 flex flex-col justify-between">
              <AquaWindowBar title="Auditoria Fiscais" />
              <div>
                <div className="w-12 h-12 rounded-2xl glass-aqua-pill flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <AquaShieldIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight drop-shadow-sm">Auditoria Contábil de Divergências</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Insira o valor esperado para realizar uma conferência automatizada. Detecta discrepâncias de centavos e alertas de preenchimento.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-200/80">
                <span>Validação Automática</span>
                <span>Nível 2</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group glass-aqua-card p-8 rounded-3xl hover:border-white/40 transition-all duration-300 flex flex-col justify-between">
              <AquaWindowBar title="Centro de Custo" />
              <div>
                <div className="w-12 h-12 rounded-2xl glass-aqua-pill flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <AquaDocumentIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight drop-shadow-sm">Atribuição por Centro de Custo</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Segregue despesas por departamentos como TI, Financeiro, Vendas, Operações ou Administrativo com retenção local no navegador.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-200/80">
                <span>Gestão Departamental</span>
                <span>Nível 3</span>
              </div>
            </div>

            {/* Wide Card 4 */}
            <div className="group glass-aqua-card p-8 rounded-3xl lg:col-span-2 hover:border-white/40 transition-all duration-300 flex flex-col justify-between">
              <AquaWindowBar title="Engenharia de Motores IA" />
              <div>
                <div className="w-12 h-12 rounded-2xl glass-aqua-pill flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <AquaOrbLogo className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight drop-shadow-sm">Engenharia Contábil e Motores Gemini</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                  Suporte duplo ao modelo <strong className="text-white">Gemini 3.5 Flash</strong> (alta velocidade) e <strong className="text-white">Gemini 3.1 Pro</strong> (máxima precisão analítica), com validação opcional via buscas oficiais da Receita Federal.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-white font-mono">
                  <div className="glass-aqua-pill p-3 rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Gemini 3.5 Flash
                  </div>
                  <div className="glass-aqua-pill p-3 rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span> Gemini 3.1 Pro
                  </div>
                  <div className="glass-aqua-pill p-3 rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> Google Search Grounding
                  </div>
                  <div className="glass-aqua-pill p-3 rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span> Processamento em Lote
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group glass-aqua-card p-8 rounded-3xl hover:border-white/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl glass-aqua-pill flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <AquaUploadIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight drop-shadow-sm">Persistência & Exportação</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Todas as análises são armazenadas no navegador, permitindo exportação instantânea em formato CSV para sistemas ERP corporativos.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-200/80">
                <span>Armazenamento Local</span>
                <span>Client-Side</span>
              </div>
            </div>

          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-12 relative">
        <div className="border-t border-white/15 pt-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p className="flex items-center gap-2">
            &copy; {new Date().getFullYear()} LedgerIQ. Desenvolvido para normas contábeis brasileiras.
          </p>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Privacidade Total do Usuário</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

