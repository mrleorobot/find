import React from 'react';
import Link from 'next/link';
// import { motion } from 'motion/react';
import { FileText, ArrowRight, Search, Target, LayoutDashboard, Code2, User, ChevronDown, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-white pb-16 relative">
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#09090b] bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]"></div>

      <header className="px-8 py-5 border-b border-white/5 bg-[#09090b]/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-9 h-9 bg-gradient-to-tr from-zinc-800 to-zinc-500 rounded-xl flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-4 h-4 text-white drop-shadow-md" />
            </div>
            <span className="font-semibold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">FinCategorizer</span>
          </div>
          <Link href="/dashboard" className="px-5 py-2.5 border border-zinc-700/50 bg-zinc-900/50 text-zinc-300 text-sm font-medium rounded-lg hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
            Acessar o Painel
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col gap-32 relative">
        <section className="flex flex-col items-center text-center relative z-10">
          <div 
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/40 border border-white/5 text-xs font-medium text-zinc-400 mb-8 cursor-default hover:border-emerald-500/20 transition-all duration-300 shadow-sm"
          >
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/80"></span>
            <span>Pronto para Testes e Homologação</span>
          </div>
          
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]"
          >
            Inteligência para as suas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-zinc-400 drop-shadow-lg">
              Notas Fiscais
            </span>
          </h1>
          
          <p 
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mt-8 leading-relaxed font-light text-balance"
          >
            Automatize a extração e classificação de dados financeiros. 
            Uma ferramenta construída para simplificar a rotina e reduzir erros estruturais.
          </p>
          
          <div 
            className="mt-12 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-zinc-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-70 group-hover:opacity-100"></div>
            <Link href="/dashboard" className="relative px-8 py-4 bg-white text-black rounded-lg font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Ir para o Dashboard 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </section>

        <div
          className="absolute top-[85vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 hidden md:flex"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Descubra mais</span>
          <div>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        <section 
          className="relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/60 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-zinc-800/80 border border-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                <Search className="w-6 h-6 text-zinc-300 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight group-hover:text-white transition-colors">Extração Inteligente</h3>
              <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Extraia automaticamente o CNPJ, data e valor total. Classifique despesas em categorias contábeis sem a necessidade de digitação manual extenuante.
              </p>
            </div>

            <div className="group relative bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/60 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-zinc-800/80 border border-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                <Target className="w-6 h-6 text-zinc-300 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight group-hover:text-white transition-colors">Foco em Precisão</h3>
              <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Desenvolvido para setores administrativos e contábeis que lidam com alto volume de despesas e precisam de segurança absoluta na prestação de contas.
              </p>
            </div>

            <div className="group relative bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/60 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-zinc-800/80 border border-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                <LayoutDashboard className="w-6 h-6 text-zinc-300 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight group-hover:text-white transition-colors">Fluxo Simplificado</h3>
              <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Acesse o painel, arraste sua nota fiscal e valide os dados consolidados em instantes através do nosso motor avançado de extração e estruturação automática.
              </p>
            </div>

            <div className="group relative bg-zinc-900/30 border border-white/5 p-8 rounded-3xl lg:col-span-2 hover:bg-zinc-900/60 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-zinc-800/80 border border-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                <Code2 className="w-6 h-6 text-zinc-300 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight group-hover:text-white transition-colors">Arquitetura Moderna</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Construído com os mais recentes padrões da web para garantir escalabilidade, performance e confiabilidade em ambientes empresariais.
              </p>
              <ul className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 hover:text-zinc-200 transition-all hover:translate-x-1 cursor-default">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60 shadow-[0_0_6px_rgba(16,185,129,0.3)]"></span> Next.js 15 & React 19
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 hover:text-zinc-200 transition-all hover:translate-x-1 cursor-default">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60 shadow-[0_0_6px_rgba(16,185,129,0.3)]"></span> Tailwind CSS v4
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 hover:text-zinc-200 transition-all hover:translate-x-1 cursor-default">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60 shadow-[0_0_6px_rgba(16,185,129,0.3)]"></span> Motor Gemini (Flash & Pro)
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 hover:text-zinc-200 transition-all hover:translate-x-1 cursor-default">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60 shadow-[0_0_6px_rgba(16,185,129,0.3)]"></span> Motion/React
                </li>
              </ul>
            </div>

            <div className="group relative bg-gradient-to-br from-zinc-900/30 to-zinc-950/50 border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/60 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 bg-zinc-800/80 border border-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                <User className="w-6 h-6 text-zinc-300 group-hover:text-rose-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight group-hover:text-white transition-colors">O Autor</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Desenvolvido por <span className="text-white font-medium border-b border-white/20 pb-0.5">Léo Souza</span> para demonstrar a união prática de fluxos automatizados com I.A. Generativa.
              </p>
              <div className="text-xs uppercase tracking-widest font-semibold text-zinc-600 mt-8 pt-4 border-t border-white/5">
                Projeto Open Source
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="max-w-5xl mx-auto px-6 mt-16 relative">
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"></div>
        <div className="pt-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500">
          <p className="flex items-center gap-2">
            &copy; {new Date().getFullYear()} FinCategorizer. Todos os direitos reservados.
          </p>
          <p className="hover:text-zinc-300 transition-colors cursor-pointer text-zinc-400">
            Crafted for Brazilian Financial Norms
          </p>
        </div>
      </footer>
    </div>
  );
}
