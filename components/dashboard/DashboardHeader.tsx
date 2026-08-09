import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onReset: () => void;
  isProcessing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onReset,
  isProcessing
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 print:hidden">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="p-3 premium-button-secondary rounded-full text-[#aaa] hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Auditoria de Documentos
            </h1>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#111] border border-[#333] text-[#aaa] hidden sm:inline-block">
              NFC-e / NF-e
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-medium">
            Processamento fiscal estruturado com conferência de regras contábeis.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={isProcessing}
        className="px-4 py-2 rounded-full premium-button-secondary text-xs font-semibold text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        title="Limpar formulário e reiniciar"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Nova Análise</span>
      </button>
    </header>
  );
};
