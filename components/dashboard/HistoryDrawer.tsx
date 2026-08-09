import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Search, SortDesc, ChevronDown, RefreshCw, Download, Trash2, Undo, X } from 'lucide-react';
import { ReceiptData } from '@/lib/types/finance';
import { formatCNPJ, formatCurrency, formatDatePTBR } from '@/lib/utils/formatters';

interface HistoryDrawerProps {
  history: ReceiptData[];
  historyFilter: string;
  setHistoryFilter: (filter: string) => void;
  historySort: string;
  setHistorySort: (sort: string) => void;
  deletedHistoryItem: { item: ReceiptData; index: number } | null;
  onUndoDelete: () => void;
  onDismissDeletedToast: () => void;
  onRestoreMockData: () => void;
  onExportHistoryCSV: () => void;
  onClearHistory: () => void;
  onLoadFromHistory: (record: ReceiptData) => void;
  onDeleteHistoryItem: (e: React.MouseEvent, id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  historyFilter,
  setHistoryFilter,
  historySort,
  setHistorySort,
  deletedHistoryItem,
  onUndoDelete,
  onDismissDeletedToast,
  onRestoreMockData,
  onExportHistoryCSV,
  onClearHistory,
  onLoadFromHistory,
  onDeleteHistoryItem,
}) => {
  if (history.length === 0) {
    return (
      <div className="mt-12 border-t border-white/10 pt-8 pb-12 w-full print:hidden">
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">Histórico no localStorage Vazio</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
            O seu histórico de notas fiscais está limpo. Você pode analisar novos documentos acima ou restaurar os dados de exemplo para demonstrar a aplicação.
          </p>
          <button
            onClick={onRestoreMockData}
            className="px-4 py-2 bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 hover:bg-zinc-500/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar Dados de Exemplo (Mock Data)
          </button>
        </div>
      </div>
    );
  }

  const filteredHistory = history
    .filter(
      item =>
        !historyFilter ||
        item.supplier_name?.toLowerCase().includes(historyFilter.toLowerCase()) ||
        item.category.toLowerCase().includes(historyFilter.toLowerCase())
    )
    .sort((a, b) => {
      if (historySort === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (historySort === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (historySort === 'val_desc') return b.total_value - a.total_value;
      if (historySort === 'val_asc') return a.total_value - b.total_value;
      return 0;
    });

  const categoryCounts = history.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValueSum = history.reduce((acc, val) => acc + (val.total_value || 0), 0);

  return (
    <div className="mt-12 border-t border-white/10 pt-8 pb-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-500 print:hidden relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative">
        <AnimatePresence>
          {deletedHistoryItem && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-14 right-0 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg flex items-center gap-4 text-sm w-full sm:w-auto z-20 shadow-2xl"
            >
              <span className="text-zinc-300 font-medium">Item apagado.</span>
              <button
                onClick={onUndoDelete}
                className="text-zinc-400 hover:text-zinc-300 flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
              >
                <Undo className="w-4 h-4" /> Desfazer
              </button>
              <button
                onClick={onDismissDeletedToast}
                className="text-zinc-500 hover:text-zinc-300 ml-auto cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-3">
          <Clock className="w-5 h-5 text-zinc-400 hidden sm:block" />
          <h2 className="text-xl font-bold text-zinc-100">
            Histórico (localStorage)
          </h2>
          <span className="bg-white/10 text-zinc-300 text-xs py-0.5 px-2 rounded-full font-bold">
            {history.length} {history.length === 1 ? 'item' : 'itens'}
          </span>
          <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-xs py-0.5 px-2 rounded-full font-bold">
            Total: {formatCurrency(totalValueSum)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[180px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar fornecedor..."
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-500/50 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={historySort}
              onChange={(e) => setHistorySort(e.target.value)}
              className="pl-9 pr-8 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-500/50 appearance-none cursor-pointer"
              title="Ordenar por"
            >
              <option value="date_desc">Mais recentes</option>
              <option value="date_asc">Mais antigos</option>
              <option value="val_desc">Maior valor</option>
              <option value="val_asc">Menor valor</option>
            </select>
            <SortDesc className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button 
            onClick={onRestoreMockData}
            className="px-3 py-2 text-sm font-medium bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 hover:bg-zinc-500/20 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Restaurar Dados Demonstrativos"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">Restaurar Mocks</span>
          </button>
          <button 
            onClick={onExportHistoryCSV}
            className="px-3 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            title="Exportar Histórico CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button 
            onClick={onClearHistory}
            className="px-3 py-2 text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 shrink-0 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            title="Limpar Histórico"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="mb-6 flex overflow-x-auto pb-2 gap-2 snap-x">
        {Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([cat, count]) => (
            <div key={cat} className="snap-start flex-none bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 whitespace-nowrap">
              {cat} <span className="bg-white/10 text-white px-1.5 py-0.5 rounded ml-1">{count}</span>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredHistory.map((record) => (
          <div 
            key={record.id} 
            className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-zinc-500/40 hover:bg-zinc-900/60 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
            onClick={() => onLoadFromHistory(record)}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-500/10 px-2 py-0.5 rounded-full border border-zinc-500/20">
                  {formatDatePTBR(record.date)}
                </span>
                <span className="text-xs font-semibold text-zinc-400 truncate ml-2 pr-6">
                   {record.category}
                </span>
              </div>
              <p className="font-bold text-zinc-200 truncate mb-1" title={record.supplier_name || 'Desconhecido'}>
                {record.supplier_name || "Fornecedor Local"}
              </p>
              <p className="text-xl font-black bg-gradient-to-br from-zinc-300 to-teal-500 bg-clip-text text-transparent group-hover:scale-105 origin-left transition-transform">
                {formatCurrency(record.total_value)}
              </p>
            </div>
            <div className="mt-3 text-[10px] font-medium text-zinc-500 flex items-center justify-between">
              <div>
                {record.confidence_score !== undefined && (
                  <span>Precisão: {record.confidence_score}%</span>
                )}
              </div>
              {record.payment_method && (
                <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-zinc-400 truncate max-w-[80px]" title={record.payment_method}>
                  {record.payment_method}
                </span>
              )}
            </div>
            <button 
              onClick={(e) => onDeleteHistoryItem(e, record.id)}
              className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-400 rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500/20 transition-all cursor-pointer"
              title="Remover Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
