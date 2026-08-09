import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle, Maximize2, RotateCw, ChevronDown, Loader2, Play, ShieldAlert } from 'lucide-react';
import { AquaGearIcon, AquaSearchIcon, AquaScanLensIcon, AquaDocumentIcon } from '@/components/GlassAquaIcons';
import { BatchItem } from '@/lib/types/finance';

interface UploadPanelProps {
  file: File | null;
  filePreview: string | null;
  isDragging: boolean;
  isBatchMode: boolean;
  batchQueue: BatchItem[];
  department: string;
  setDepartment: (dept: string) => void;
  expectedValue: string;
  setExpectedValue: (val: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  useGoogleSearch: boolean;
  setUseGoogleSearch: (use: boolean) => void;
  imageRotation: number;
  setImageRotation: React.Dispatch<React.SetStateAction<number>>;
  onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBoxClick: () => void;
  onToggleBatchMode: (batch: boolean) => void;
  setBatchQueue: React.Dispatch<React.SetStateAction<BatchItem[]>>;
  processBatch: () => Promise<void>;
  isBatchProcessing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  expectedValueInputRef: React.RefObject<HTMLInputElement>;
  setLightboxOpen: (open: boolean) => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  file,
  filePreview,
  isDragging,
  isBatchMode,
  batchQueue,
  department,
  setDepartment,
  expectedValue,
  setExpectedValue,
  selectedModel,
  setSelectedModel,
  useGoogleSearch,
  setUseGoogleSearch,
  imageRotation,
  setImageRotation,
  onFileDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onFileInputChange,
  onBoxClick,
  onToggleBatchMode,
  setBatchQueue,
  processBatch,
  isBatchProcessing,
  onSubmit,
  isProcessing,
  error,
  fileInputRef,
  expectedValueInputRef,
  setLightboxOpen,
}) => {
  const fileInputId = React.useId();
  const rawExpectedValueId = React.useId();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 flex-1">
      {/* Dropzone */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Área para upload de arquivos"
        animate={isDragging ? { 
          scale: 1.01, 
          borderColor: "rgba(255, 255, 255, 0.4)",
          backgroundColor: "rgba(255, 255, 255, 0.04)"
        } : { 
          scale: 1, 
          borderColor: file ? "rgba(255, 255, 255, 0.2)" : "rgba(63, 63, 70, 0.6)",
          backgroundColor: file ? "rgba(255, 255, 255, 0.02)" : "rgba(18, 18, 22, 0.5)"
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`relative flex flex-col items-center justify-center border-2 rounded-2xl p-6 sm:p-8 overflow-hidden ${
          !isDragging && !file ? "border-dashed hover:border-zinc-600 hover:bg-zinc-900/60 cursor-pointer transition-all" : "cursor-pointer"
        }`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onFileDrop}
        onClick={onBoxClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onBoxClick(); }}
      >
        <AnimatePresence mode="wait">
          {isBatchMode ? (
            <motion.div 
              key="batch-upload"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center gap-3 text-zinc-400 pointer-events-none relative z-10 text-center"
            >
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200">
                <UploadCloud className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div>
                <span className="font-semibold text-zinc-200 block text-sm">Adicionar Arquivos em Lote</span>
                <span className="text-[11px] text-zinc-500 font-mono">Arraste múltiplos recibos ou clique para selecionar</span>
              </div>
              {batchQueue.length > 0 && (
                <div className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-mono">
                  {batchQueue.length} {batchQueue.length === 1 ? 'arquivo adicionado' : 'arquivos adicionados'}
                </div>
              )}
            </motion.div>
          ) : file ? (
            <motion.div 
              key="file"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 text-zinc-200 w-full relative z-10"
            >
              {filePreview ? (
                <div 
                  className="relative w-full max-w-[180px] aspect-[1/1.4] rounded-xl overflow-hidden border border-zinc-700/80 shadow-2xl group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  title="Clique para ampliar"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={filePreview} 
                    alt="Preview do documento" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    style={{ transform: `rotate(${imageRotation}deg)` }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="flex items-center justify-center text-white p-2 hover:bg-white/20 rounded-full transition-colors">
                      <Maximize2 className="w-5 h-5 drop-shadow-md" />
                    </span>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageRotation(r => r + 90);
                    }}
                    className="absolute bottom-3 right-3 p-1.5 bg-zinc-950/80 hover:bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-30 shadow-lg border border-zinc-800"
                    title="Rotacionar imagem"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                    className="absolute top-3 right-3 bg-zinc-500 rounded-full p-1 shadow-md z-10"
                  >
                    <CheckCircle className="w-4 h-4 text-zinc-950" strokeWidth={3} />
                  </motion.div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  >
                    <CheckCircle className="w-8 h-8 text-zinc-400" />
                  </motion.div>
                </div>
              )}
              <div className="flex flex-col items-center gap-1 mx-4">
                <span className="font-semibold text-center break-all line-clamp-2 text-sm max-w-[250px] text-zinc-200">{file.name}</span>
                <span className="text-[11px] font-mono font-medium text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded-md border border-zinc-800">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center gap-3.5 text-zinc-400 pointer-events-none relative z-10"
            >
              <div className={`p-3.5 rounded-xl border transition-colors ${isDragging ? "bg-zinc-800 border-zinc-600 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-300"}`}>
                <UploadCloud className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <span className="font-semibold text-zinc-200 block mb-1 text-sm">Clique, arraste ou cole (Ctrl+V)</span>
                <span className="text-xs text-zinc-500 font-mono">Arquivos válidos: Imagens (JPG, PNG, WEBP) ou PDF até 5MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          id={fileInputId}
          ref={fileInputRef}
          type="file"
          multiple={isBatchMode}
          className="sr-only"
          accept="image/jpeg, image/png, application/pdf, image/webp"
          onChange={onFileInputChange}
          tabIndex={-1}
          aria-hidden="true"
        />
      </motion.div>

      {/* Department & Expected Value */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="department-select" className="block text-xs font-mono uppercase tracking-wider text-[#aaa]/80 font-bold">
            Centro de Custo (Departamento)
          </label>
          <div className="relative">
            <select
              id="department-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full premium-input rounded-2xl py-3 px-4 pr-10 text-white text-sm focus:outline-none focus:border-zinc-400 transition-all font-medium appearance-none hover:border-white/30"
            >
              <option value="Administrativo" className="bg-slate-900 text-white">Administrativo</option>
              <option value="Financeiro" className="bg-slate-900 text-white">Financeiro</option>
              <option value="Operações" className="bg-slate-900 text-white">Operações</option>
              <option value="Vendas" className="bg-slate-900 text-white">Vendas</option>
              <option value="Marketing" className="bg-slate-900 text-white">Marketing</option>
              <option value="TI" className="bg-slate-900 text-white">Tecnologia (TI)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-[#aaa]" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={rawExpectedValueId} className="block text-xs font-mono uppercase tracking-wider text-[#aaa]/80 font-bold">
            Verificação de Valor Total <span className="text-slate-400 font-normal ml-1">(Opcional)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[#aaa] font-mono text-xs font-bold">R$</span>
            </div>
            <input
              id={rawExpectedValueId}
              ref={expectedValueInputRef}
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={expectedValue}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.,]/g, '');
                setExpectedValue(val);
              }}
              className="w-full premium-input rounded-2xl py-3 pl-11 pr-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-zinc-400 transition-all font-mono hover:border-white/30"
            />
          </div>
        </div>
      </div>

      {/* Preferences & Engine Mode */}
      <div className="border-t border-white/10 pt-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <AquaGearIcon className="w-4 h-4 text-[#aaa]" />
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#aaa]">Preferências de Extração</h3>
        </div>

        {/* Input Mode */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Modo de Entrada</label>
          <div className="grid grid-cols-2 gap-2 premium-input p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => onToggleBatchMode(false)}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${!isBatchMode ? "premium-button-primary shadow-md" : "text-slate-300 hover:text-white"}`}
            >
              Documento Único
            </button>
            <button
              type="button"
              onClick={() => onToggleBatchMode(true)}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${isBatchMode ? "premium-button-primary shadow-md" : "text-slate-300 hover:text-white"}`}
            >
              Processamento em Lote
            </button>
          </div>
        </div>

        {/* AI Model */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Motor de Análise (Gemini)</label>
          <div className="grid grid-cols-2 gap-2 premium-input p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedModel("gemini-3.5-flash")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${selectedModel === "gemini-3.5-flash" ? "premium-button-primary shadow-md" : "text-slate-300 hover:text-white"}`}
            >
              Flash (Ultra Rápido)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel("gemini-3.1-pro")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${selectedModel === "gemini-3.1-pro" ? "premium-button-primary shadow-md" : "text-slate-300 hover:text-white"}`}
            >
              Pro (Alta Precisão)
            </button>
          </div>
        </div>

        {/* Google Search Grounding */}
        <div className="flex items-center justify-between p-3.5 premium-input rounded-2xl">
          <div className="space-y-0.5 pr-4">
            <div className="flex items-center gap-1.5">
              <AquaSearchIcon className="w-3.5 h-3.5 text-[#aaa]" />
              <span className="text-xs font-bold text-white">Enriquecimento Cadastral Web</span>
            </div>
            <p className="text-[10px] text-slate-300 font-normal">Valida Razão Social do CNPJ com dados oficiais online.</p>
          </div>
          <button
            type="button"
            onClick={() => setUseGoogleSearch(!useGoogleSearch)}
            className={`w-10 h-6 shrink-0 rounded-full transition-colors relative focus:outline-none border border-white/20 ${useGoogleSearch ? "bg-[#333]/40 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-slate-800"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${useGoogleSearch ? "translate-x-4 bg-[#333] shadow-md" : "bg-slate-400"}`} />
          </button>
        </div>
      </div>

      {/* Batch Processing Queue */}
      {isBatchMode && batchQueue.length > 0 && (
        <div className="space-y-3 mt-4 border-t border-white/5 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Fila de Processamento ({batchQueue.length})</span>
            <button 
              type="button" 
              onClick={() => setBatchQueue([])} 
              className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              Limpar Fila
            </button>
          </div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {batchQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs gap-3">
                <div className="overflow-hidden min-w-0 flex-1">
                  <p className="font-semibold text-zinc-300 truncate" title={item.file.name}>{item.file.name}</p>
                  <p className="text-[10px] text-zinc-500">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'pending' && (
                    <span className="bg-zinc-800/80 text-zinc-400 border border-white/5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">Aguardando</span>
                  )}
                  {item.status === 'processing' && (
                    <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" /> Analisando
                    </span>
                  )}
                  {item.status === 'done' && (
                    <span className="bg-zinc-500/20 text-zinc-300 border border-zinc-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                      ✓ Concluído
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="bg-red-500/10 text-red-400 border border-red-500/15 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" title={item.errorMsg}>
                      Falha
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={processBatch}
            disabled={isBatchProcessing || batchQueue.every(i => i.status === 'done')}
            className="w-full py-3.5 bg-zinc-500 hover:bg-zinc-400 disabled:bg-white/5 disabled:text-zinc-500 text-zinc-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-zinc-500/10"
          >
            {isBatchProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Processando Lote...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-zinc-950 stroke-zinc-950" />
                <span>Processar Lote</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }} 
            animate={{ opacity: 1, height: "auto", marginTop: 8 }} 
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div id="form-error" className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 font-medium flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single File Submit Button */}
      {!isBatchMode && (
        <div className="mt-auto pt-4 relative group">
          <button
            id="submit-analysis-btn"
            type="submit"
            disabled={!file || isProcessing}
            className="w-full py-4 premium-button-primary rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#aaa]" />
                <span className="text-[#aaa]">Processando com Gemini...</span>
              </>
            ) : (
              <>
                <AquaScanLensIcon className="w-5 h-5" />
                <span>Analisar Documento Fiscal</span>
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
};
