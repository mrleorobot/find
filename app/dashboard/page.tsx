"use client";

import React, { useState, useCallback, DragEvent, ChangeEvent, useEffect, useRef } from "react";
import { UploadCloud, FileText, Loader2, Building, Calendar, CheckCircle, FileCheck, Store, CreditCard, Key, User, ArrowLeft, RefreshCw, ChevronDown, Download, AlertTriangle, Copy, Check, Clock, ShieldAlert, ScanLine, Trash2, Printer, Share2, Maximize2, X, Search, BarChart3, Command, RotateCw, Edit2, Save, XCircle, ZoomIn, ZoomOut, Undo, Info, SortDesc, SortAsc, Filter, ArrowUp, ArrowDown, Sparkles, Play } from "lucide-react";
import Link from "next/link";

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}
import { motion, AnimatePresence } from "motion/react";

interface GroundingSource {
  title: string;
  uri: string;
}

interface ReceiptData {
  id: string;
  cnpj: string;
  date: string;
  total_value: number;
  category: string;
  supplier_name?: string;
  payment_method?: string;
  access_key?: string;
  consumer_id?: string;
  confidence_score?: number;
  extraction_notes?: string;
  model_used?: string;
  grounding_sources?: GroundingSource[];
}

interface BatchItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMsg?: string;
  result?: ReceiptData;
}

const HISTORY_KEY = "@ais/receipt-history";

const AccordionSection = ({ title, icon: Icon, children, defaultOpen = true }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden mb-4 shadow-sm">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-zinc-800/50 border border-white/10 shadow-inner">
            <Icon className="w-4 h-4 text-zinc-300" />
          </div>
          <span className="font-semibold text-zinc-200 tracking-tight">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 bg-zinc-900/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Novos Estados da Mega Atualização (Google GenAI 3.5 e Avanços Tecnológicos)
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.5-flash");
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [batchQueue, setBatchQueue] = useState<BatchItem[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);

  // Technical Requirement: Proper cleanup of object URLs
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const [expectedValue, setExpectedValue] = useState<string>("");
  const [department, setDepartment] = useState<string>("Administrativo");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputId = React.useId();
  const rawExpectedValueId = React.useId();
  const expectedValueHelpId = React.useId();

  const [history, setHistory] = useState<ReceiptData[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("");
  const [imageRotation, setImageRotation] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<ReceiptData | null>(null);
  const [historySort, setHistorySort] = useState("date_desc");
  const [deletedHistoryItem, setDeletedHistoryItem] = useState<{item: ReceiptData, index: number} | null>(null);
  const expectedValueInputRef = useRef<HTMLInputElement>(null);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
      const savedDept = localStorage.getItem("@ais/dept");
      if (savedDept) setDepartment(savedDept);
    } catch (err) {
      console.warn("Failed to load history", err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("@ais/dept", department);
  }, [department]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const saveToHistory = useCallback((newResult: ReceiptData) => {
    setHistory(prev => {
      // Evitar duplicatas em caso de re-análises acidentais 
      const filtered = prev.filter(item => item.id !== newResult.id);
      const updated = [newResult, ...filtered].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const loadFromHistory = useCallback((item: ReceiptData) => {
    resetForm();
    setResult(item);
  }, []);

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      addToast("Copiado!", "success");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      addToast("Erro ao copiar", "error");
    }
  }, [addToast]);

  const clearHistory = useCallback(() => {
    if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
      addToast("Histórico apagado", "info");
    }
  }, [addToast]);

  const deleteHistoryItem = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index > -1) {
        setDeletedHistoryItem({ item: prev[index], index });
      }
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
    addToast("Item removido", "info");
  }, [addToast]);

  const exportHistoryCSV = useCallback(() => {
    if (history.length === 0) return;
    const headers = ['Fornecedor', 'CNPJ', 'Data', 'Valor_Total', 'Categoria', 'Centro_de_Custo', 'Confianca', 'Chave_Acesso'];
    const safeCsvString = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
    
    const rows = history.map(item => [
      safeCsvString(item.supplier_name || ''),
      safeCsvString(item.cnpj),
      safeCsvString(item.date),
      item.total_value.toString(),
      safeCsvString(item.category),
      safeCsvString(department),
      (item.confidence_score || 0).toString(),
      safeCsvString(item.access_key || '')
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\\n' + rows.join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historico_despesas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Histórico exportado com sucesso!", "success");
  }, [history, department, addToast]);

  const shareSummary = useCallback(() => {
    if (!result) return;
    const summary = `🧾 *Resumo da Despesa*\\n\\n*Fornecedor:* ${result.supplier_name || 'N/A'}\\n*Valor:* ${formatCurrency(result.total_value)}\\n*Data:* ${formatDatePTBR(result.date)}\\n*Categoria:* ${result.category}\\n*CNPJ:* ${formatCNPJ(result.cnpj)}`;
    navigator.clipboard.writeText(summary);
    addToast("Resumo copiado para compartilhamento!", "success");
  }, [result, addToast]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const addFilesToBatch = useCallback((files: FileList | File[]) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff", "application/pdf"];
    const newItems: BatchItem[] = [];
    let hasInvalid = false;
    let hasOverSize = false;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!validTypes.includes(f.type)) {
        hasInvalid = true;
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        hasOverSize = true;
        continue;
      }
      newItems.push({
        id: crypto.randomUUID(),
        file: f,
        status: 'pending'
      });
    }

    if (hasInvalid) {
      addToast("Alguns arquivos foram ignorados por formato inválido.", "error");
    }
    if (hasOverSize) {
      addToast("Alguns arquivos excederam o limite de 5MB.", "error");
    }

    setBatchQueue(prev => [...prev, ...newItems]);
  }, [addToast]);

  const processBatch = useCallback(async () => {
    if (batchQueue.length === 0 || isBatchProcessing) return;
    setIsBatchProcessing(true);
    setError(null);
    
    const updatedQueue = [...batchQueue];
    
    for (let i = 0; i < updatedQueue.length; i++) {
      if (updatedQueue[i].status !== 'pending' && updatedQueue[i].status !== 'error') {
        continue;
      }
      
      updatedQueue[i] = { ...updatedQueue[i], status: 'processing' };
      setBatchQueue([...updatedQueue]);
      
      const formData = new FormData();
      formData.append("file", updatedQueue[i].file);
      formData.append("model", selectedModel);
      formData.append("google_search", useGoogleSearch ? "true" : "false");
      
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          let errMsg = `Erro (${response.status})`;
          try {
            const data = await response.json();
            errMsg = data.error || data.message || errMsg;
          } catch (_) {}
          throw new Error(errMsg);
        }
        
        const data = await response.json();
        updatedQueue[i] = {
          ...updatedQueue[i],
          status: 'done',
          result: data
        };
        
        // Save to general history and local storage
        setHistory(prev => {
          const exists = prev.some(item => item.id === data.id);
          if (exists) return prev;
          const updated = [data, ...prev];
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
          return updated;
        });

        addToast(`Extraído: ${updatedQueue[i].file.name}`, "success");
      } catch (err: any) {
        updatedQueue[i] = {
          ...updatedQueue[i],
          status: 'error',
          errorMsg: err.message || "Erro desconhecido."
        };
        addToast(`Falha: ${updatedQueue[i].file.name}`, "error");
      }
      
      setBatchQueue([...updatedQueue]);
    }
    
    setIsBatchProcessing(false);
  }, [batchQueue, isBatchProcessing, selectedModel, useGoogleSearch, addToast]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    setResult(null);
    setIsEditing(false);
    setEditedResult(null);

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Formato inválido. Envie apenas JPG, PNG, WEBP, TIFF ou PDF.");
      setFile(null);
      setFilePreview(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("O arquivo excede o limite de 5MB.");
      setFile(null);
      setFilePreview(null);
      return;
    }

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setFile(selectedFile);
    setImageRotation(0);
    setLightboxZoom(1);
    if (selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
    
    setTimeout(() => {
      expectedValueInputRef.current?.focus();
    }, 100);
  }, [filePreview]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData || e.clipboardData.items.length === 0) return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          if (blob) {
            if (isBatchMode) {
              addFilesToBatch([blob]);
            } else {
              handleFileSelect(blob);
            }
            break;
          }
        }
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const formBtn = document.getElementById("submit-analysis-btn");
        if (formBtn && !formBtn.hasAttribute("disabled")) {
          formBtn.click();
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleFileSelect, isBatchMode, addFilesToBatch]);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (isBatchMode) {
        addFilesToBatch(e.dataTransfer.files);
      } else {
        handleFileSelect(e.dataTransfer.files[0]);
      }
      e.dataTransfer.clearData();
    }
  }, [handleFileSelect, isBatchMode, addFilesToBatch]);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isBatchMode) {
        addFilesToBatch(e.target.files);
      } else {
        handleFileSelect(e.target.files[0]);
      }
    }
  }, [handleFileSelect, isBatchMode, addFilesToBatch]);

  const handleBoxClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetForm = useCallback(() => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    setExpectedValue("");
    setDepartment("Administrativo");
    setResult(null);
    setError(null);
    setBatchQueue([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [filePreview]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", selectedModel);
    formData.append("google_search", useGoogleSearch ? "true" : "false");
    
    if (expectedValue) {
      // Aceitar formato BR (vírgula como decimal) e converter para float seguro
      const sanitizedValue = expectedValue.replace(/\./g, '').replace(',', '.');
      formData.append("expected_value", sanitizedValue);
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let serverErrorMsg = `Erro no servidor (${response.status}). Verifique o arquivo e tente novamente.`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            serverErrorMsg = errData.error || errData.message || serverErrorMsg;
            if (errData.details) {
              serverErrorMsg += ` Detalhes: ${JSON.stringify(errData.details)}`;
            }
          }
        } catch (_) {
          // Fallback para o erro genérico com status caso não seja JSON
        }
        throw new Error(serverErrorMsg);
      }

      const data = await response.json();
      setResult(data);
      saveToHistory(data);
      
      // Feedback sutil se houver sucesso
      if (navigator.vibrate) navigator.vibrate([100]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [file, expectedValue, selectedModel, useGoogleSearch]);

  const exportCSV = useCallback(() => {
    if (!result) return;
    const headers = ['Fornecedor', 'CNPJ', 'Data', 'Valor_Total', 'Categoria', 'Centro_de_Custo', 'Confianca', 'Metodo_Pagamento', 'Consumidor', 'Chave_Acesso', 'Anotacoes'];
    const safeCsvString = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
    
    const row = [
      safeCsvString(result.supplier_name || ''),
      safeCsvString(result.cnpj),
      safeCsvString(result.date),
      result.total_value.toString(),
      safeCsvString(result.category),
      safeCsvString(department),
      (result.confidence_score || '').toString(),
      safeCsvString(result.payment_method || ''),
      safeCsvString(result.consumer_id || ''),
      safeCsvString(result.access_key || ''),
      safeCsvString(result.extraction_notes || '')
    ].join(',');

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + row;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const safeCnpj = result.cnpj ? result.cnpj.replace(/\D/g, '') : 'nfe';
    link.setAttribute("download", `despesa_${safeCnpj}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("CSV exportado com sucesso!", "success");
  }, [result, department, addToast]);

  // Utility to format BRL currency
  const formatCurrency = (val: number) => {
    if (isNaN(val) || val === null) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDatePTBR = (dateStr: string) => {
    if (!dateStr || dateStr === "-") return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const formatCNPJ = (cnpjStr: string) => {
    const raw = cnpjStr.replace(/\D/g, '');
    if (raw.length === 14) {
      return raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return cnpjStr;
  };

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
    <div className="min-h-screen bg-black text-zinc-100 font-sans p-4 sm:p-8 lg:p-12 relative overflow-hidden print:bg-white print:text-black print:p-0 print:overflow-visible" aria-busy={isProcessing}>
      
      <div className="max-w-5xl mx-auto space-y-10 relative z-10 w-full print:space-y-0">
        
        {/* Header */}
        <header className="flex items-center gap-5 print:hidden">
          <Link 
            href="/" 
            className="p-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              Análise de Documentos
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-1.5 font-medium">Extração de notas fiscais usando IA de forma automática e precisa.</p>
          </div>
        </header>

        {/* Progress Tracker / Instruções Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 print:hidden relative">
          <div className="hidden sm:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-white/5 z-0" />
          <div className="hidden sm:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-emerald-500/50 z-0 origin-left transition-transform duration-500" style={{ transform: `scaleX(${result ? 1 : file ? 0.5 : 0})` }} />
          
          <div className={`relative z-10 backdrop-blur-sm border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${!file ? 'bg-zinc-800/80 border-emerald-500/30' : 'bg-zinc-900/40 border-white/5 opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${!file ? 'bg-emerald-500 text-zinc-950 border-emerald-500' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{!file ? "1" : <Check className="w-4 h-4" />}</div>
            <div>
              <h3 className="font-semibold text-zinc-100">Envie o recibo</h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">Arraste ou cole (Ctrl+V) a imagem da sua nota fiscal.</p>
            </div>
          </div>
          
          <div className={`relative z-10 backdrop-blur-sm border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${file && !result ? 'bg-zinc-800/80 border-emerald-500/30' : 'bg-zinc-900/40 border-white/5 opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${file && !result ? 'bg-emerald-500 text-zinc-950 border-emerald-500' : result ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-zinc-500 border-white/10'}`}>{result ? <Check className="w-4 h-4" /> : "2"}</div>
            <div>
              <h3 className="font-semibold text-zinc-100">Confirme os Dados</h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">Selecione o centro de custo e digite o valor de verificação (Opcional).</p>
            </div>
          </div>
          
          <div className={`relative z-10 backdrop-blur-sm border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${result ? 'bg-zinc-800/80 border-emerald-500/30' : 'bg-zinc-900/40 border-white/5 opacity-50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${result ? 'bg-emerald-500 text-zinc-950 border-emerald-500' : 'bg-white/5 text-zinc-500 border-white/10'}`}>3</div>
            <div>
              <h3 className="font-semibold text-zinc-100">Analise e Exporte</h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">Extraia os dados com IA, valide e depois exporte para CSV.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
          
          {/* Form Column */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-2xl relative print:hidden"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-1">
              {/* Dropzone */}
              <motion.div
                role="button"
                tabIndex={0}
                aria-label="Área para upload de arquivos"
                animate={isDragging ? { 
                  scale: 1.02, 
                  boxShadow: "0 0 25px rgba(52, 211, 153, 0.4)", 
                  borderColor: "rgba(52, 211, 153, 0.8)",
                  backgroundColor: "rgba(16, 185, 129, 0.1)"
                } : { 
                  scale: 1, 
                  boxShadow: "0 0 0px rgba(52, 211, 153, 0)",
                  borderColor: file ? "rgba(16, 185, 129, 0.4)" : "rgba(63, 63, 70, 1)",
                  backgroundColor: file ? "rgba(16, 185, 129, 0.05)" : "rgba(24, 24, 27, 0.5)"
                }}
                transition={{ 
                  repeat: isDragging ? Infinity : 0, 
                  repeatType: "reverse", 
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                className={`relative flex flex-col items-center justify-center border-2 rounded-2xl p-6 sm:p-8 overflow-hidden ${
                  !isDragging && !file ? "border-dashed hover:border-zinc-500 hover:bg-zinc-800/80 cursor-pointer transition-colors" : "cursor-pointer"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBoxClick}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBoxClick(); }}
              >
                <AnimatePresence mode="wait">
                  {isBatchMode ? (
                    <motion.div 
                      key="batch-upload"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="flex flex-col items-center gap-3 text-zinc-400 pointer-events-none relative z-10 text-center"
                    >
                      <div className="p-3.5 rounded-full bg-emerald-500/10 text-emerald-400">
                        <UploadCloud className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-200 block text-sm">Adicionar Arquivos em Lote</span>
                        <span className="text-[11px] text-zinc-500">Arraste múltiplos recibos ou clique para selecionar</span>
                      </div>
                      {batchQueue.length > 0 && (
                        <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">
                          {batchQueue.length} {batchQueue.length === 1 ? 'arquivo adicionado' : 'arquivos adicionados'}
                        </div>
                      )}
                    </motion.div>
                  ) : file ? (
                    <motion.div 
                      key="file"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="flex flex-col items-center justify-center gap-4 text-zinc-200 w-full relative z-10"
                    >
                      {filePreview ? (
                        <div 
                          className="relative w-full max-w-[180px] aspect-[1/1.4] rounded-xl overflow-hidden border border-white/20 shadow-xl group cursor-pointer"
                          onClick={() => setLightboxOpen(true)}
                          title="Clique para ampliar"
                        >
                          <img src={filePreview} alt="Preview do documento" className="w-full h-full object-cover transition-transform group-hover:scale-105" style={{ transform: `rotate(${imageRotation}deg)` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <span className="flex items-center justify-center text-white p-2 hover:bg-white/20 rounded-full transition-colors"><Maximize2 className="w-6 h-6 drop-shadow-md" /></span>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageRotation(r => r + 90);
                            }}
                            className="absolute bottom-3 right-3 p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-30 shadow-lg"
                            title="Rotacionar imagem"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          
                          {isProcessing && (
                            <motion.div 
                              className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_15px_3px_rgba(52,211,153,0.8)] z-20 pointer-events-none"
                              animate={{ top: ["0%", "100%", "0%"] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            />
                          )}

                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                            className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                          >
                            <CheckCircle className="w-5 h-5 text-zinc-950" strokeWidth={3} />
                          </motion.div>
                        </div>
                      ) : (
                         <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                           <motion.div
                             initial={{ scale: 0, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                           >
                             <CheckCircle className="w-10 h-10 text-emerald-400" />
                           </motion.div>
                         </div>
                      )}
                      <div className="flex flex-col items-center gap-1 mx-4">
                        <span className="font-semibold text-center break-all line-clamp-2 text-sm max-w-[250px]">{file.name}</span>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="flex flex-col items-center gap-4 text-zinc-400 pointer-events-none relative z-10"
                    >
                      <div className={`p-4 rounded-full transition-colors ${isDragging ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5"}`}>
                        <UploadCloud className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-zinc-200 block mb-1">Clique, arraste ou cole (Ctrl+V)</span>
                        <span className="text-xs text-zinc-500">Imagens (JPG, PNG, WEBP, TIFF) ou PDF até 5MB</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  id={fileInputId}
                  ref={fileInputRef}
                  type="file"
                  multiple={isBatchMode}
                  className="sr-only" /* sr-only for better accessibility handling than hidden in some cases */
                  accept="image/jpeg, image/png, application/pdf"
                  onChange={handleFileInput}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </motion.div>

              {/* Optional Values and Department */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="department-select" className="block text-sm font-semibold text-zinc-300">
                    Centro de Custo
                  </label>
                  <div className="relative">
                    <select
                      id="department-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 px-4 pr-10 text-zinc-100 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium appearance-none hover:border-white/20"
                    >
                      <option value="Administrativo">Administrativo</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Operações">Operações</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Marketing">Marketing</option>
                      <option value="TI">Tecnologia (TI)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="w-5 h-5 text-zinc-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor={rawExpectedValueId} className="block text-sm font-semibold text-zinc-300">
                    Verificação de Valor Total <span className="text-zinc-500 font-normal ml-1">(Opcional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-zinc-400 font-medium group-focus-within:text-emerald-400 transition-colors">R$</span>
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
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 text-base sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium hover:border-white/20"
                      aria-describedby={`${expectedValueHelpId} ${error ? 'form-error' : ''}`}
                      aria-invalid={error ? true : false}
                    />
                  </div>
                  <p id={expectedValueHelpId} className="text-xs text-zinc-500 font-medium ml-1">
                    Insira o valor esperado para realizar auditoria automática.
                  </p>
                </div>
              </div>

              {/* Parâmetros da Inteligência Artificial */}
              <div className="border-t border-white/5 pt-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Parâmetros de Inteligência Artificial</h3>
                </div>

                {/* Modo de Execução */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-400">Modo de Operação</label>
                  <div className="grid grid-cols-2 gap-2 bg-black/45 p-1 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBatchMode(false);
                        resetForm();
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${!isBatchMode ? "bg-white text-zinc-950 shadow-md" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                    >
                      Único Arquivo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsBatchMode(true);
                        resetForm();
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${isBatchMode ? "bg-white text-zinc-950 shadow-md" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                    >
                      Lote (Multi-upload)
                    </button>
                  </div>
                </div>

                {/* Modelo da IA */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-400">Modelo Gemini</label>
                  <div className="grid grid-cols-2 gap-2 bg-black/45 p-1 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setSelectedModel("gemini-3.5-flash")}
                      className={`py-2.5 text-xs font-bold rounded-lg transition-all ${selectedModel === "gemini-3.5-flash" ? "bg-emerald-500 text-zinc-955 shadow-md" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                    >
                      Gemini 3.5 Flash
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel("gemini-3.1-pro")}
                      className={`py-2.5 text-xs font-bold rounded-lg transition-all ${selectedModel === "gemini-3.1-pro" ? "bg-emerald-500 text-zinc-955 shadow-md" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                    >
                      Gemini 3.1 Pro
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed ml-1">
                    {selectedModel === "gemini-3.5-flash" ? "⚡ Flash: Recomendado por sua velocidade ultra-responsiva e consistência." : "🧠 Pro: Alta precisão analítica de raciocínio lógico em notas complexas ou rasuradas."}
                  </p>
                </div>

                {/* Google Search Grounding */}
                <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-200">Busca do Google (Grounding)</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-normal">Permite que a IA realize buscas na web para autenticar CNPJ e consolidar a razão social do emitente.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseGoogleSearch(!useGoogleSearch)}
                    className={`w-10 h-6 shrink-0 rounded-full transition-colors relative focus:outline-none ${useGoogleSearch ? "bg-emerald-500" : "bg-zinc-800"}`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${useGoogleSearch ? "translate-x-4" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Fila do Processamento em Lote */}
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
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Analisando
                            </span>
                          )}
                          {item.status === 'done' && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
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
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-zinc-500 text-zinc-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
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

              {/* Submit Button (Apenas em modo arquivo único) */}
              {!isBatchMode && (
                <div className="mt-auto pt-4 relative group">
                  <button
                    id="submit-analysis-btn"
                    type="submit"
                    disabled={!file || isProcessing}
                    aria-disabled={!file || isProcessing}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/50 ${
                      !file || isProcessing
                        ? "bg-white/5 text-zinc-500 cursor-not-allowed border-transparent"
                        : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                        <span className="text-zinc-400">Processando com Gemini...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-5 h-5" />
                        Extrair Informações
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </motion.div>

          {/* Result Column */}
          <div className="bg-zinc-900/20 backdrop-blur-md border border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col shadow-inner min-h-[300px] lg:min-h-[500px] print:shadow-none print:border-none print:bg-transparent print:p-0">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-20"
                >
                  {/* Processing Overlays */}
                  <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    <ScanLine className="w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                    Analisando documento
                  </h3>
                  <p className="text-zinc-400 text-sm mt-2 font-medium">Extraindo CNPJ, valores e categorias com IA...</p>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col h-full z-10 w-full"
                >
                  <div className="flex sm:items-center items-start justify-between mb-8 pb-5 border-b border-white/10 flex-col sm:flex-row gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
                        Dados Estruturados
                      </h2>
                      {result.confidence_score !== undefined && (
                        <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Confiança IA:</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${result.confidence_score >= 90 ? "bg-emerald-500/20 text-emerald-400" : result.confidence_score >= 70 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                            {result.confidence_score}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 self-start mt-1 print:hidden">
                      <button 
                        onClick={() => {
                          if (isEditing && editedResult) {
                            setResult(editedResult);
                            saveToHistory(editedResult); // Re-save updated result
                          } else {
                            setEditedResult(result);
                          }
                          setIsEditing(!isEditing);
                        }}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isEditing ? 'bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400' : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300'}`}
                        title={isEditing ? "Salvar Edição" : "Editar Valores"}
                      >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        {isEditing && <span className="text-xs hidden sm:inline-block">Salvar</span>}
                      </button>
                      
                      {!isEditing && (
                        <>
                          <button 
                            onClick={exportCSV}
                            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center gap-2"
                            title="Exportar CSV"
                            aria-label="Exportar CSV"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">Exportar</span>
                          </button>
                          <button 
                            onClick={shareSummary}
                            className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 transition-colors hidden sm:flex items-center"
                            title="Compartilhar Resumo"
                            aria-label="Compartilhar Resumo"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={handlePrint}
                            className="p-2 rounded-lg bg-zinc-700/50 border border-zinc-600 hover:bg-zinc-600 text-zinc-300 transition-colors hidden sm:flex items-center"
                            title="Imprimir"
                            aria-label="Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => {
                           if (isEditing) {
                             setIsEditing(false);
                             setEditedResult(null);
                           } else {
                             resetForm();
                           }
                        }}
                        className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'}`}
                        title={isEditing ? "Cancelar Edição" : "Nova análise"}
                        aria-label={isEditing ? "Cancelar Edição" : "Nova análise"}
                      >
                        {isEditing ? <X className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
                      <div className="flex items-center gap-3 mb-2">
                         <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Valor Apurado</p>
                      </div>
                      {isEditing ? (
                        <input 
                          type="number"
                          step="0.01"
                          className="w-full bg-black/50 border border-emerald-500/50 rounded px-2 py-1 text-2xl font-black text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                          value={editedResult?.total_value || ''} 
                          onChange={e => setEditedResult(prev => prev ? {...prev, total_value: parseFloat(e.target.value)} : prev)} 
                        />
                      ) : (
                        <p className="text-3xl font-black text-emerald-400 tracking-tight">
                          {formatCurrency(result.total_value)}
                        </p>
                      )}
                      
                      {!isEditing && variance && (
                        <div className={`mt-3 p-2 rounded-lg border text-xs font-medium text-center ${variance.match ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border-red-500/30 text-red-300"}`}>
                          {variance.match ? "✓ Valor Confere" : `⚠ Divergência: ${formatCurrency(Math.abs(variance.difference))}`}
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
                       <div className="flex items-center gap-3 mb-2">
                         <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Categoria</p>
                      </div>
                      {isEditing ? (
                        <input 
                          className="w-full bg-black/50 border border-blue-500/50 rounded px-2 py-1 text-xl font-bold text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          value={editedResult?.category || ''} 
                          onChange={e => setEditedResult(prev => prev ? {...prev, category: e.target.value} : prev)} 
                        />
                      ) : (
                        <p className="text-xl font-bold text-blue-100 truncate pb-1">
                          {result.category}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
                    
                    {/* Avisos da IA */}
                    {result.extraction_notes && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-200/90 leading-relaxed font-medium">
                          <span className="block text-yellow-500 font-bold mb-0.5 text-xs uppercase tracking-widest">Observação da IA</span>
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
                                    className="w-full bg-black/50 border border-emerald-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                                    value={editedResult?.supplier_name || ''} 
                                    onChange={e => setEditedResult(prev => prev ? {...prev, supplier_name: e.target.value} : prev)} 
                                  />
                                ) : (
                                  <p className="text-sm font-semibold text-zinc-200 line-clamp-1">{result.supplier_name}</p>
                                )}
                              </div>
                            </div>
                            {!isEditing && (
                              <button onClick={() => copyToClipboard(result.supplier_name!, 'name')} className="p-2 -m-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-emerald-400 transition-all text-zinc-400">
                                {copiedField === 'name' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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
                                  className="w-full bg-black/50 border border-emerald-500/50 rounded px-2 py-1 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                                  value={editedResult?.cnpj || ''} 
                                  onChange={e => setEditedResult(prev => prev ? {...prev, cnpj: e.target.value} : prev)} 
                                />
                              ) : (
                                <p className="text-sm font-mono font-medium text-zinc-300">{formatCNPJ(result.cnpj)}</p>
                              )}
                            </div>
                          </div>
                          {!isEditing && (
                            <button onClick={() => copyToClipboard(result.cnpj, 'cnpj')} className="p-2 -m-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-emerald-400 transition-all text-zinc-400">
                              {copiedField === 'cnpj' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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
                                className="w-full bg-black/50 border border-emerald-500/50 rounded px-2 py-1 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
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
                                  className="w-full bg-black/50 border border-emerald-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
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
                                  className="w-full bg-black/50 border border-emerald-500/50 rounded px-2 py-1 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
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
                          <button onClick={() => copyToClipboard(result.access_key!, 'key')} className="p-2 -m-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-emerald-400 transition-all text-zinc-400 shrink-0">
                            {copiedField === 'key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </AccordionSection>
                    )}

                    {/* Fontes de Grounding (Google Search) */}
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
                                className="p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-center justify-between text-xs transition-colors group cursor-pointer"
                              >
                                <div className="overflow-hidden mr-3">
                                  <span className="font-bold text-emerald-400 line-clamp-1 group-hover:underline">{src.title || "Pesquisa Google"}</span>
                                  <span className="text-[10px] text-zinc-500 block truncate mt-0.5">{src.uri}</span>
                                </div>
                                <Search className="w-4 h-4 text-emerald-400/60 shrink-0 group-hover:text-emerald-400 transition-colors" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </AccordionSection>
                    )}

                    {/* Metadados da IA */}
                    <div className="pt-2">
                      <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3.5 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 border-b border-white/5 pb-2">
                          <span className="font-bold uppercase tracking-wider">Metadados de Auditoria</span>
                          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">Google Cloud Secure</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                          <div>
                            <span className="text-zinc-500 block text-[10px] font-bold uppercase">Motor de Inferência</span>
                            <span className="font-semibold text-zinc-300 font-mono">{result.model_used || "gemini-3.5-flash"}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[10px] font-bold uppercase">Processamento</span>
                            <span className="font-semibold text-zinc-300">Servidor Protegido</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center px-6 h-full absolute inset-0 pb-10"
                >
                  <div className="w-20 h-20 bg-white/[0.02] rounded-3xl flex items-center justify-center border border-white/5 mb-6 relative">
                    <FileText className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-300 tracking-tight">Nenhum dado extraído</h3>
                  <p className="text-zinc-500 text-sm mt-3 font-medium max-w-[260px] leading-relaxed">
                    Envie o arquivo no painel ao lado e aguarde a Inteligência Artificial estruturar os dados.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Histórico Recente Inferior */}
        {history.length > 0 && (
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
                    <button onClick={() => {
                        setHistory(prev => {
                          const newHistory = [...prev];
                          newHistory.splice(deletedHistoryItem.index, 0, deletedHistoryItem.item);
                          localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
                          return newHistory;
                        });
                        setDeletedHistoryItem(null);
                        addToast("Ação desfeita", "success");
                    }} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold transition-colors">
                      <Undo className="w-4 h-4" /> Desfazer
                    </button>
                    <button onClick={() => setDeletedHistoryItem(null)} className="text-zinc-500 hover:text-zinc-300 ml-auto" title="Fechar">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex flex-wrap items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400 hidden sm:block" />
                <h2 className="text-xl font-bold text-zinc-100">
                  Histórico
                </h2>
                <span className="bg-white/10 text-zinc-300 text-xs py-0.5 px-2 rounded-full font-bold">
                  {history.length} {history.length === 1 ? 'item' : 'itens'}
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs py-0.5 px-2 rounded-full font-bold">
                  Total: {formatCurrency(history.reduce((acc, val) => acc + (val.total_value || 0), 0))}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Buscar fornecedor..."
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <select
                    value={historySort}
                    onChange={(e) => setHistorySort(e.target.value)}
                    className="pl-9 pr-8 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 appearance-none"
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
                  onClick={exportHistoryCSV}
                  className="px-3 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                  title="Exportar Histórico"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <button 
                  onClick={clearHistory}
                  className="px-3 py-2 text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 shrink-0 rounded-lg transition-colors flex items-center justify-center gap-2"
                  title="Limpar Histórico"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="mb-6 flex overflow-x-auto pb-2 gap-2 snap-x">
              {Object.entries(
                history.reduce((acc, curr) => {
                  acc[curr.category] = (acc[curr.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).sort((a,b) => b[1] - a[1]).map(([cat, count]) => (
                 <div key={cat} className="snap-start flex-none bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 whitespace-nowrap">
                   {cat} <span className="bg-white/10 text-white px-1.5 py-0.5 rounded ml-1">{count}</span>
                 </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {history.filter(item => !historyFilter || item.supplier_name?.toLowerCase().includes(historyFilter.toLowerCase()) || item.category.toLowerCase().includes(historyFilter.toLowerCase())).sort((a,b) => {
                if (historySort === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
                if (historySort === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
                if (historySort === 'val_desc') return b.total_value - a.total_value;
                if (historySort === 'val_asc') return a.total_value - b.total_value;
                return 0;
              }).map((record) => (
                <div 
                  key={record.id} 
                  className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                  onClick={() => loadFromHistory(record)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {formatDatePTBR(record.date)}
                      </span>
                      <span className="text-xs font-semibold text-zinc-400 truncate ml-2 pr-6">
                         {record.category}
                      </span>
                    </div>
                    <p className="font-bold text-zinc-200 truncate mb-1" title={record.supplier_name || 'Desconhecido'}>
                      {record.supplier_name || "Fornecedor Local"}
                    </p>
                    <p className="text-xl font-black bg-gradient-to-br from-emerald-300 to-teal-500 bg-clip-text text-transparent group-hover:scale-105 origin-left transition-transform">
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
                    onClick={(e) => deleteHistoryItem(e, record.id)}
                    className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-400 rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                    title="Remover Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxOpen && filePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all">
          <div 
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center pointer-events-none">
            <div 
              className="relative overflow-hidden flex items-center justify-center pointer-events-auto shadow-2xl rounded-xl bg-black/50"
              style={{ maxWidth: '100%', maxHeight: '80vh', padding: '20px' }}
              onWheel={(e) => {
                if (e.deltaY < 0) setLightboxZoom(z => Math.min(z + 0.2, 4));
                setLightboxZoom(z => Math.max(z - 0.2, 0.5));
              }}
            >
              <img 
                src={filePreview} 
                alt="Preview amplo" 
                className="max-w-full max-h-[75vh] object-contain transition-transform duration-200" 
                style={{ transform: `rotate(${imageRotation}deg) scale(${lightboxZoom})` }} 
              />
            </div>
            
            <div className="absolute bottom-[-60px] flex items-center gap-2 bg-zinc-900/80 p-2 rounded-full border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl">
              <button onClick={() => setLightboxZoom(z => Math.max(z - 0.2, 0.5))} className="p-2 hover:bg-white/10 rounded-full text-zinc-300" title="Reduzir zoom">
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-zinc-400 w-12 text-center">{Math.round(lightboxZoom * 100)}%</span>
              <button onClick={() => setLightboxZoom(z => Math.min(z + 0.2, 4))} className="p-2 hover:bg-white/10 rounded-full text-zinc-300" title="Aumentar zoom">
                <ZoomIn className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button onClick={() => setImageRotation(r => r - 90)} className="p-2 hover:bg-white/10 rounded-full text-zinc-300" title="Rotacionar anti-horário">
                <RotateCw className="w-5 h-5 -scale-x-100" />
              </button>
              <button onClick={() => setImageRotation(r => r + 90)} className="p-2 hover:bg-white/10 rounded-full text-zinc-300" title="Rotacionar horário">
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 sm:right-[-40px] sm:top-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors pointer-events-auto"
              aria-label="Fechar preview amplo"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Toasts Container */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md font-medium text-sm pointer-events-auto
                ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 
                  toast.type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-200' : 
                  'bg-zinc-800/80 border-white/10 text-zinc-100'}
              `}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

