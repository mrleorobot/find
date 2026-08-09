import { useState, useRef, useCallback } from 'react';
import { ReceiptData, BatchItem } from '@/lib/types/finance';

interface UseReceiptAnalysisOptions {
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  saveToHistory: (data: ReceiptData) => void;
}

export function useReceiptAnalysis({ addToast, saveToHistory }: UseReceiptAnalysisOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReceiptData | null>(null);

  // Advanced options
  const [department, setDepartment] = useState('Administrativo');
  const [expectedValue, setExpectedValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);

  // Preview options
  const [imageRotation, setImageRotation] = useState(0);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<ReceiptData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Batch Mode
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchQueue, setBatchQueue] = useState<BatchItem[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const expectedValueInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    if (isBatchMode) {
      const validFiles = droppedFiles.filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
      if (validFiles.length === 0) {
        setError('Nenhum arquivo válido encontrado (JPG, PNG, PDF até 5MB).');
        return;
      }
      const newItems: BatchItem[] = validFiles.map(f => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        status: 'pending'
      }));
      setBatchQueue(prev => [...prev, ...newItems]);
      setError(null);
      addToast(`${validFiles.length} arquivo(s) adicionado(s) à fila!`, 'info');
      return;
    }

    const droppedFile = droppedFiles[0];
    if (droppedFile.size > 5 * 1024 * 1024) {
      setError('O arquivo excede o limite máximo permitido de 5MB.');
      return;
    }

    if (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
      setImageRotation(0);
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(droppedFile);
      } else {
        setFilePreview(null);
      }
    } else {
      setError('Tipo de arquivo não suportado. Por favor, envie uma imagem (JPG, PNG, WEBP) ou PDF.');
    }
  }, [addToast, isBatchMode]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);

    if (isBatchMode) {
      const validFiles = selectedFiles.filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
      if (validFiles.length === 0) {
        setError('Nenhum arquivo válido selecionado.');
        return;
      }
      const newItems: BatchItem[] = validFiles.map(f => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        status: 'pending'
      }));
      setBatchQueue(prev => [...prev, ...newItems]);
      setError(null);
      addToast(`${validFiles.length} arquivo(s) adicionado(s) à fila!`, 'info');
      return;
    }

    const selectedFile = selectedFiles[0];
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('O arquivo excede o limite de 5MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setImageRotation(0);
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  }, [addToast, isBatchMode]);

  const resetForm = useCallback(() => {
    setFile(null);
    setFilePreview(null);
    setError(null);
    setResult(null);
    setExpectedValue('');
    setIsEditing(false);
    setEditedResult(null);
    setImageRotation(0);
  }, []);

  const copyToClipboard = useCallback((text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast(`${fieldName.toUpperCase()} copiado!`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  }, [addToast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo de recibo ou nota fiscal para realizar a análise.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', selectedModel);
      formData.append('useGoogleSearch', useGoogleSearch ? 'true' : 'false');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar o documento fiscal.');
      }

      const receiptWithMeta: ReceiptData = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        department: department || 'Administrativo',
        model_used: selectedModel,
        confidence_score: data.confidence_score ?? 95,
      };

      setResult(receiptWithMeta);
      saveToHistory(receiptWithMeta);
      addToast('Auditoria concluída e salva no histórico!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na comunicação com o servidor de IA.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [addToast, department, file, saveToHistory, selectedModel, useGoogleSearch]);

  const processBatch = useCallback(async () => {
    if (batchQueue.length === 0 || isBatchProcessing) return;

    setIsBatchProcessing(true);
    let successCount = 0;

    for (const item of batchQueue) {
      if (item.status === 'done') continue;

      setBatchQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i));

      try {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('model', selectedModel);
        formData.append('useGoogleSearch', useGoogleSearch ? 'true' : 'false');

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro na requisição.');
        }

        const receiptWithMeta: ReceiptData = {
          ...data,
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          department: department || 'Administrativo',
          model_used: selectedModel,
          confidence_score: data.confidence_score ?? 90,
        };

        saveToHistory(receiptWithMeta);
        successCount++;

        setBatchQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done', result: receiptWithMeta } : i));
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao processar.';
        setBatchQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', errorMsg } : i));
      }
    }

    setIsBatchProcessing(false);
    addToast(`Lote finalizado! ${successCount} arquivo(s) processado(s) com sucesso.`, 'success');
  }, [addToast, batchQueue, department, isBatchProcessing, saveToHistory, selectedModel, useGoogleSearch]);

  return {
    file,
    setFile,
    filePreview,
    setFilePreview,
    isDragging,
    isProcessing,
    error,
    setError,
    result,
    setResult,
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
    isEditing,
    setIsEditing,
    editedResult,
    setEditedResult,
    copiedField,
    lightboxOpen,
    setLightboxOpen,
    lightboxZoom,
    setLightboxZoom,
    isBatchMode,
    setIsBatchMode,
    batchQueue,
    setBatchQueue,
    isBatchProcessing,
    fileInputRef,
    expectedValueInputRef,
    handleFileDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleFileInput,
    resetForm,
    copyToClipboard,
    handleSubmit,
    processBatch,
  };
}
