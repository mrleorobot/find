import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Edit2, Save, Download, Share2, Printer, RefreshCw, X, 
  AlertTriangle, Store, Building, Calendar, CreditCard, User, Key, Search, Copy, Check 
} from 'lucide-react';
import { AccordionSection } from './AccordionSection';
import { AquaScanLensIcon, AquaShieldIcon, AquaWindowBar } from '@/components/GlassAquaIcons';
import { ReceiptData } from '@/lib/types/finance';
import { formatCNPJ, formatCurrency, formatDatePTBR } from '@/lib/utils/formatters';

interface ResultViewerProps {
  isProcessing: boolean;
  result: ReceiptData | null;
  isEditing: boolean;
  editedResult: ReceiptData | null;
  copiedField: string | null;
  expectedValue: string;
  department: string;
  onEditToggle: () => void;
  onExportCSV: () => void;
  onShareSummary: () => void;
  onPrint: () => void;
  onReset: () => void;
  onCancelEdit: () => void;
  onCopyToClipboard: (text: string, field: string) => void;
  setEditedResult: React.Dispatch<React.SetStateAction<ReceiptData | null>>;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({
  isProcessing,
  result,
  isEditing,
  editedResult,
  copiedField,
  expectedValue,
  department,
  onEditToggle,
  onExportCSV,
  onShareSummary,
  onPrint,
  onReset,
  onCancelEdit,
  onCopyToClipboard,
  setEditedResult,
}) => {
  const getVarianceInfo = () => {
    if (!expectedValue || !result || result.total_value == null) return null;
    const expectedNum = parseFloat(expectedValue.replace(/\./g, "").replace(",", "."));
    if (isNaN(expectedNum)) return null;
    const difference = result.total_value - expectedNum;
    const match = Math.abs(difference) < 0.05;
    return { expectedNum, difference, match };
  };

  const variance = getVarianceInfo();

  return (
    <div className="premium-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col shadow-2xl min-h-[300px] lg:min-h-[500px] print:shadow-none print:border-none print:bg-transparent print:p-0">
      <AquaWindowBar title="Painel de Auditoria & Resultado" icon={<AquaShieldIcon className="w-4 h-4 text-[#aaa]" />} />
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl z-20"
          >
            <motion.div 
              className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-zinc-400/10 to-transparent pointer-events-none"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative w-20 h-20 flex items-center justify-center mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-zinc-400 border-t-transparent shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <AquaScanLensIcon className="w-8 h-8 animate-pulse text-[#aaa]" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Analisando Recibo com Gemini IA
            </h3>
            <p className="text-zinc-500 text-xs mt-1.5 font-mono">Executando extração estruturada de dados via Gemini...</p>
          </motion.div>
        ) : result ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full z-10 w-full"
          >
            <div className="flex sm:items-center items-start justify-between mb-6 pb-4 border-b border-zinc-800/80 flex-col sm:flex-row gap-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2 tracking-tight">
                  Resultado da Auditoria
                </h2>
                {result.confidence_score !== undefined && (
                  <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    <span className="text-[10px] font-mono font-medium text-zinc-400">Precisão:</span>
                    <span className={`text-[10px] font-mono font-bold ${result.confidence_score >= 90 ? "text-zinc-400" : result.confidence_score >= 70 ? "text-zinc-400" : "text-zinc-400"}`}>
                      {result.confidence_score}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 self-start mt-1 print:hidden">
                <button 
                  onClick={onEditToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isEditing ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300'}`}
                  title={isEditing ? "Salvar Edição" : "Editar Valores"}
                >
                  {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                  <span>{isEditing ? "Salvar" : "Editar"}</span>
                </button>
                
                {!isEditing && (
                  <>
                    <button 
                      onClick={onExportCSV}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                      title="Exportar CSV"
                      aria-label="Exportar CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Exportar</span>
                    </button>
                    <button 
                      onClick={onShareSummary}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all hidden sm:flex items-center"
                      title="Compartilhar Resumo"
                      aria-label="Compartilhar Resumo"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={onPrint}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all hidden sm:flex items-center"
                      title="Imprimir"
                      aria-label="Imprimir"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => {
                     if (isEditing) {
                       onCancelEdit();
                     } else {
                       onReset();
                     }
                  }}
                  className={`p-1.5 rounded-lg transition-all ${isEditing ? 'bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                  title={isEditing ? "Cancelar Edição" : "Nova análise"}
                  aria-label={isEditing ? "Cancelar Edição" : "Nova análise"}
                >
                  {isEditing ? <X className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-500/10 border border-zinc-500/20 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-2">
                   <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Valor Apurado</p>
                </div>
                {isEditing ? (
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full bg-black/50 border border-zinc-500/50 rounded px-2 py-1 text-2xl font-black text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500" 
                    value={editedResult?.total_value || ''} 
                    onChange={e => setEditedResult(prev => prev ? {...prev, total_value: parseFloat(e.target.value)} : prev)} 
                  />
                ) : (
                  <p className="text-3xl font-black text-zinc-400 tracking-tight">
                    {formatCurrency(result.total_value)}
                  </p>
                )}
                
                {!isEditing && variance && (
                  <div className={`mt-3 p-2 rounded-lg border text-xs font-medium text-center ${variance.match ? "bg-zinc-500/20 border-zinc-500/30 text-zinc-300" : "bg-red-500/20 border-red-500/30 text-red-300"}`}>
                    {variance.match ? "✓ Valor Confere" : `⚠ Divergência: ${formatCurrency(Math.abs(variance.difference))}`}
                  </div>
                )}
              </div>

              <div className="bg-[#333]/5 border border-zinc-500/20 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
                 <div className="flex items-center gap-3 mb-2">
                   <p className="text-xs font-bold text-[#aaa] uppercase tracking-widest">Categoria</p>
                </div>
                {isEditing ? (
                  <input 
                    className="w-full bg-black/50 border border-zinc-500/50 rounded px-2 py-1 text-xl font-bold text-[#aaa] focus:outline-none focus:ring-2 focus:ring-zinc-500" 
                    value={editedResult?.category || ''} 
                    onChange={e => setEditedResult(prev => prev ? {...prev, category: e.target.value} : prev)} 
                  />
                ) : (
                  <p className="text-xl font-bold text-[#aaa] truncate pb-1">
                    {result.category}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
              
              {result.extraction_notes && (
                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-zinc-300 leading-relaxed font-medium">
                    <span className="block text-zinc-500 font-bold mb-0.5 text-xs uppercase tracking-widest">Observações do Processamento</span>
                    {result.extraction_notes}
                  </div>
                </div>
              )}

              <AccordionSection title="Dados do Estabelecimento" icon={Store} defaultOpen={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(result.supplier_name || isEditing) && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start justify-between gap-4 hover:bg-white/[0.04] transition-colors col-span-1 sm:col-span-2 group">
                      <div className="flex items-start gap-4 overflow-hidden w-full">
                        <div className="w-9 h-9 shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-zinc-500 transition-colors">
                          <Store className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                        </div>
                        <div className="overflow-hidden w-full">
                          <p className="text-[10px] font-bold text-zinc-500 mb-0.5 uppercase tracking-widest">Nome do Fornecedor</p>
                          {isEditing ? (
                            <input 
                              className="w-full bg-black/50 border border-zinc-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-500" 
                              value={editedResult?.supplier_name || ''} 
                              onChange={e => setEditedResult(prev => prev ? {...prev, supplier_name: e.target.value} : prev)} 
                            />
                          ) : (
                            <p className="text-sm font-semibold text-zinc-200 line-clamp-1">{result.supplier_name}</p>
                          )}
                        </div>
                      </div>
                      {!isEditing && (
                        <button onClick={() => onCopyToClipboard(result.supplier_name!, 'name')} className="p-2 -m-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-zinc-400 transition-all text-zinc-400">
                          {copiedField === 'name' ? <Check className="w-4 h-4 text-zinc-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start justify-between gap-4 hover:bg-white/[0.04] transition-colors group sm:col-span-2">
                    <div className="flex items-start gap-4 overflow-hidden w-full">
                      <div className="w-9 h-9 shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-zinc-500 transition-colors">
                        <Building className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                      </div>
                      <div className="overflow-hidden w-full">
                        <p className="text-[10px] font-bold text-zinc-500 mb-0.5 uppercase tracking-widest">CNPJ</p>
                        {isEditing ? (
                          <input 
                            className="w-full bg-black/50 border border-zinc-500/50 rounded px-2 py-1 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-zinc-500" 
                            value={editedResult?.cnpj || ''} 
                            onChange={e => setEditedResult(prev => prev ? {...prev, cnpj: e.target.value} : prev)} 
                          />
                        ) : (
                          <p className="text-sm font-mono font-medium text-zinc-300">{formatCNPJ(result.cnpj)}</p>
                        )}
                      </div>
                    </div>
                    {!isEditing && (
                      <button onClick={() => onCopyToClipboard(result.cnpj, 'cnpj')} className="p-2 -m-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-zinc-400 transition-all text-zinc-400">
                        {copiedField === 'cnpj' ? <Check className="w-4 h-4 text-zinc-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </AccordionSection>

              <AccordionSection title="Detalhes da Transação" icon={FileText} defaultOpen={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start gap-4 hover:bg-white/[0.04] transition-colors group w-full">
                    <div className="w-9 h-9 shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-zinc-500 transition-colors">
                      <Calendar className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                    </div>
                    <div className="overflow-hidden w-full pr-2">
                      <p className="text-[10px] font-bold text-zinc-500 mb-0.5 uppercase tracking-widest">Data Emissão</p>
                      {isEditing ? (
                        <input 
                          className="w-full bg-black/50 border border-zinc-500/50 rounded px-2 py-1 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-zinc-500" 
                          value={editedResult?.date || ''} 
                          onChange={e => setEditedResult(prev => prev ? {...prev, date: e.target.value} : prev)} 
                        />
                      ) : (
                        <p className="text-sm font-mono font-medium text-zinc-300">{formatDatePTBR(result.date)}</p>
                      )}
                    </div>
                  </div>

                  {(result.payment_method || isEditing) && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start gap-4 hover:bg-white/[0.04] transition-colors group w-full">
                      <div className="w-9 h-9 shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-zinc-500 transition-colors">
                        <CreditCard className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                      </div>
                      <div className="overflow-hidden w-full pr-2">
                        <p className="text-[10px] font-bold text-zinc-500 mb-0.5 uppercase tracking-widest">Pagamento</p>
                        {isEditing ? (
                          <input 
                            className="w-full bg-black/50 border border-zinc-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-500" 
                            value={editedResult?.payment_method || ''} 
                            onChange={e => setEditedResult(prev => prev ? {...prev, payment_method: e.target.value} : prev)} 
                          />
                        ) : (
                          <p className="text-sm font-semibold text-zinc-300 capitalize">{result.payment_method}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(result.consumer_id || isEditing) && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start gap-4 hover:bg-white/[0.04] transition-colors group col-span-1 sm:col-span-2 w-full">
                      <div className="w-9 h-9 shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-zinc-500 transition-colors">
                        <User className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                      </div>
                      <div className="overflow-hidden w-full pr-2">
                        <p className="text-[10px] font-bold text-zinc-500 mb-0.5 uppercase tracking-widest">CPF / Dados Consumidor</p>
                        {isEditing ? (
                          <input 
                            className="w-full bg-black/50 border border-zinc-500/50 rounded px-2 py-1 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-zinc-500" 
                            value={editedResult?.consumer_id || ''} 
                            onChange={e => setEditedResult(prev => prev ? {...prev, consumer_id: e.target.value} : prev)} 
                          />
                        ) : (
                          <p className="text-sm font-mono font-medium text-zinc-300 truncate">{result.consumer_id}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionSection>

              {result.access_key && (
                <AccordionSection title="Dados Fiscais" icon={Key} defaultOpen={false}>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-start justify-between gap-4 hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-start gap-4 w-full overflow-hidden">
                      <div className="w-9 h-9 shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-zinc-500 transition-colors">
                        <Key className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                      </div>
                      <div className="overflow-hidden w-full">
                        <p className="text-[10px] font-bold text-zinc-500 mb-0.5 uppercase tracking-widest">Chave de Acesso</p>
                        <p className="text-[12px] sm:text-[13px] font-mono font-medium text-zinc-400 break-all select-all leading-snug">{result.access_key}</p>
                      </div>
                    </div>
                    <button onClick={() => onCopyToClipboard(result.access_key!, 'key')} className="p-2 -m-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-zinc-400 transition-all text-zinc-400 shrink-0">
                      {copiedField === 'key' ? <Check className="w-4 h-4 text-zinc-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </AccordionSection>
              )}

              {result.grounding_sources && result.grounding_sources.length > 0 && (
                <AccordionSection title="Fontes de Pesquisa Google" icon={Search} defaultOpen={true}>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Citações e Validações Encontradas:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {result.grounding_sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-zinc-500/5 hover:bg-zinc-500/10 border border-zinc-500/10 rounded-xl flex items-center justify-between text-xs transition-colors group cursor-pointer"
                        >
                          <div className="overflow-hidden mr-3">
                            <span className="font-bold text-zinc-400 line-clamp-1 group-hover:underline">{src.title || "Pesquisa Google"}</span>
                            <span className="text-[10px] text-zinc-500 block truncate mt-0.5">{src.uri}</span>
                          </div>
                          <Search className="w-4 h-4 text-zinc-400/60 shrink-0 group-hover:text-zinc-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                </AccordionSection>
              )}

              <div className="pt-2">
                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-white/5 pb-2">
                    <span className="font-bold uppercase tracking-widest">Registro de Processamento</span>
                    <span className="text-[9px] bg-zinc-800 border border-white/5 text-zinc-400 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" /> Canal Seguro HTTPS
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-semibold uppercase tracking-wider">Motor Executado</span>
                      <span className="font-semibold text-zinc-300 font-mono text-[11px]">{result.model_used === 'gemini-3.1-pro' ? 'Pro Engine' : 'Flash Engine'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-semibold uppercase tracking-wider">Servidor</span>
                      <span className="font-semibold text-zinc-300 text-[11px]">América Latina (São Paulo)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center px-6 h-full absolute inset-0 pb-10"
          >
            <div className="w-20 h-20 bg-white/[0.02] rounded-3xl flex items-center justify-center border border-white/5 mb-6 relative">
              <FileText className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300 tracking-tight">Pronto para Análise</h3>
            <p className="text-zinc-500 text-sm mt-3 font-medium max-w-[260px] leading-relaxed">
              Envie o arquivo no painel ao lado para iniciar a extração e estruturação automática de dados.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
