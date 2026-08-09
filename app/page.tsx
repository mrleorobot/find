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
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] font-sans selection:bg-white/20 selection:text-white pb-16 relative overflow-hidden">
      {/* Subtle Premium Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#050505] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(0,0,0,0))]"></div>
      
      {/* Header Bar */}
      <header className="px-6 sm:px-10 py-5 border-b border-[#222] bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3.5 group cursor-default">
            <div className="p-1 rounded-xl bg-[#111] border border-[#333] shadow-lg group-hover:border-[#555] transition-colors duration-300">
              <AquaOrbLogo className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-xl text-white flex items-center gap-2">
                LedgerIQ
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#1a1a1a] border border-[#333] text-[#aaa]">PRO</span>
              </span>
              <span className="text-[10px] text-[#888] font-medium tracking-wide">Auditoria Fiscais Avançada</span>
            </div>
          </div>
          
          <Link 
            href="/dashboard" 
            className="px-5 py-2.5 premium-button-primary rounded-full text-xs font-bold tracking-wide flex items-center gap-2"
          >
            <span>Acessar o Painel</span>
            <AquaArrowRightIcon className="w-3.5 h-3.5 text-black" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col gap-24 relative">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full premium-pill text-xs font-medium mb-8 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="tracking-wide text-[11px] font-semibold uppercase text-white">Motor de Inteligência Contábil</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl">
            Auditoria Contábil <br />
            <span className="text-[#888]">
              em Tempo Real
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#aaa] max-w-2xl mt-6 leading-relaxed font-normal text-balance">
            Extraia, valide e categorize despesas corporativas com precisão contábil.
            Arquitetura 100% cliente para máxima privacidade de dados.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-5">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 premium-button-primary rounded-full font-extrabold text-sm tracking-wide flex items-center gap-3 group"
            >
              <span>Abrir Dashboard de Auditoria</span>
              <AquaArrowRightIcon className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#888] font-medium">
            <span className="flex items-center gap-2 px-3 py-1.5">
              <AquaCheckIcon className="w-3.5 h-3.5 text-white" /> Sem Login Obrigatório
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5">
              <AquaCheckIcon className="w-3.5 h-3.5 text-white" /> Retenção no Navegador
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5">
              <AquaCheckIcon className="w-3.5 h-3.5 text-white" /> Exportação Direta em CSV
            </span>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="relative z-10">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-2">Arquitetura Premium</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Capacidades da Plataforma</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="group premium-card p-8 rounded-3xl hover:border-[#444] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center mb-6">
                  <AquaScanLensIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Visão Computacional</h3>
                <p className="text-sm text-[#888] leading-relaxed font-normal">
                  Identifica automaticamente CNPJ, chave de acesso, data e valor total a partir de cupons fiscais e DANFEs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between text-xs font-mono text-[#666]">
                <span>Extração NFC-e / NF-e</span>
              </div>
            </div>

            <div className="group premium-card p-8 rounded-3xl hover:border-[#444] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center mb-6">
                  <AquaShieldIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Auditoria Contábil</h3>
                <p className="text-sm text-[#888] leading-relaxed font-normal">
                  Insira o valor esperado para conferência automatizada. Detecta discrepâncias de centavos e alertas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between text-xs font-mono text-[#666]">
                <span>Validação Automática</span>
              </div>
            </div>

            <div className="group premium-card p-8 rounded-3xl hover:border-[#444] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center mb-6">
                  <AquaDocumentIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Centro de Custo</h3>
                <p className="text-sm text-[#888] leading-relaxed font-normal">
                  Segregue despesas por departamentos com retenção local no navegador.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between text-xs font-mono text-[#666]">
                <span>Gestão Departamental</span>
              </div>
            </div>

            <div className="group premium-card p-8 rounded-3xl lg:col-span-2 hover:border-[#444] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center mb-6">
                  <AquaOrbLogo className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Engenharia Contábil IA</h3>
                <p className="text-sm text-[#888] leading-relaxed font-normal mb-6 max-w-lg">
                  Suporte aos modelos Gemini Flash (velocidade) e Pro (precisão analítica), com validação opcional via buscas oficiais online.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-[#aaa] font-mono">
                  <div className="bg-[#111] border border-[#222] p-3 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Gemini Flash
                  </div>
                  <div className="bg-[#111] border border-[#222] p-3 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Gemini Pro
                  </div>
                  <div className="bg-[#111] border border-[#222] p-3 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Google Search
                  </div>
                  <div className="bg-[#111] border border-[#222] p-3 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Processamento Lote
                  </div>
                </div>
              </div>
            </div>

            <div className="group premium-card p-8 rounded-3xl hover:border-[#444] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center mb-6">
                  <AquaUploadIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">Exportação CSV</h3>
                <p className="text-sm text-[#888] leading-relaxed font-normal">
                  Análises armazenadas no navegador, com exportação instantânea para sistemas ERP.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between text-xs font-mono text-[#666]">
                <span>Client-Side</span>
              </div>
            </div>

          </div>
        </section>
      </main>
      
      <footer className="max-w-6xl mx-auto px-6 mt-12 relative">
        <div className="border-t border-[#222] pt-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#666]">
          <p className="flex items-center gap-2">
            &copy; {new Date().getFullYear()} LedgerIQ.
          </p>
          <div className="flex items-center gap-4 text-[#888]">
            <span>Privacidade Total do Usuário</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


