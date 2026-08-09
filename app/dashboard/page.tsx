'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AquaShieldIcon, AquaWindowBar } from '@/components/GlassAquaIcons';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { UploadPanel } from '@/components/dashboard/UploadPanel';
import { ResultViewer } from '@/components/dashboard/ResultViewer';
import { HistoryDrawer } from '@/components/dashboard/HistoryDrawer';
import { ToastContainer, Toast } from '@/components/dashboard/ToastContainer';
import { LightboxModal } from '@/components/dashboard/LightboxModal';
import { useReceiptAnalysis } from '@/lib/hooks/useReceiptAnalysis';
import { useHistoryState } from '@/lib/hooks/useHistoryState';
import { ReceiptData } from '@/lib/types/finance';
import { exportHistoryCSV, generateShareSummary } from '@/lib/utils/export';

export default function Dashboard() {
  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // History state management
  const {
    history,
    setHistory,
    historyFilter,
    setHistoryFilter,
    historySort,
    setHistorySort,
    deletedHistoryItem,
    setDeletedHistoryItem,
    saveToHistory,
    deleteHistoryItem,
    undoDelete,
    clearHistory,
    restoreMockData,
  } = useHistoryState(addToast);

  // Analysis Hook
  const {
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
  } = useReceiptAnalysis({
    addToast,
    saveToHistory,
  });

  // Global Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const pastedFile = e.clipboardData.files[0];
        if (pastedFile.type.startsWith("image/") || pastedFile.type === "application/pdf") {
          setFile(pastedFile);
          setError(null);
          addToast("Arquivo colado da área de transferência!", "info");
          if (pastedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(pastedFile);
          } else {
            setFilePreview(null);
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [addToast, setError, setFile, setFilePreview]);

  // Handler for loading a record from history
  const handleLoadFromHistory = useCallback((record: ReceiptData) => {
    setResult(record);
    setIsEditing(false);
    setEditedResult(null);
    setFile(null);
    setFilePreview(null);
    addToast(`Carregado: ${record.supplier_name || 'Documento'}`, "info");
  }, [addToast, setEditedResult, setFile, setFilePreview, setIsEditing, setResult]);

  // Single CSV Export handler
  const handleExportSingleCSV = useCallback(() => {
    if (!result) return;
    exportHistoryCSV([result], `recibo-${result.id || 'export'}.csv`, department);
    addToast("Exportado para CSV com sucesso!", "success");
  }, [addToast, department, result]);

  // Batch / History CSV Export handler
  const handleExportHistoryCSV = useCallback(() => {
    if (history.length === 0) return;
    exportHistoryCSV(history, `historico-auditoria-${new Date().toISOString().slice(0,10)}.csv`);
    addToast("Histórico exportado com sucesso!", "success");
  }, [addToast, history]);

  // Share summary handler
  const handleShareSummary = useCallback(() => {
    if (!result) return;
    const summary = generateShareSummary(result);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      addToast("Resumo copiado para a área de transferência!", "success");
    }
  }, [addToast, result]);

  // Print handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Box click for trigger input
  const handleBoxClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  // Toggle edit mode
  const handleEditToggle = useCallback(() => {
    if (isEditing && editedResult) {
      setResult(editedResult);
      saveToHistory(editedResult);
      addToast("Edição salva no histórico!", "success");
    } else {
      setEditedResult(result);
    }
    setIsEditing(!isEditing);
  }, [addToast, editedResult, isEditing, result, saveToHistory, setEditedResult, setIsEditing, setResult]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] flex flex-col font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Background Decorator */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.03),rgba(0,0,0,0))]" />
      </div>

      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-8">
        {/* Header Component */}
        <DashboardHeader 
          onReset={resetForm} 
          isProcessing={isProcessing} 
        />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
          {/* Upload Panel */}
          <div className="lg:col-span-5 flex flex-col h-full print:hidden">
            <div className="premium-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col flex-1 shadow-2xl">
              <AquaWindowBar 
                title="Upload & Configurações" 
                icon={<AquaShieldIcon className="w-4 h-4 text-white" />} 
              />
              <UploadPanel 
                file={file}
                filePreview={filePreview}
                isDragging={isDragging}
                isBatchMode={isBatchMode}
                batchQueue={batchQueue}
                department={department}
                setDepartment={setDepartment}
                expectedValue={expectedValue}
                setExpectedValue={setExpectedValue}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                useGoogleSearch={useGoogleSearch}
                setUseGoogleSearch={setUseGoogleSearch}
                imageRotation={imageRotation}
                setImageRotation={setImageRotation}
                onFileDrop={handleFileDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onFileInputChange={handleFileInput}
                onBoxClick={handleBoxClick}
                onToggleBatchMode={(batch) => {
                  setIsBatchMode(batch);
                  resetForm();
                }}
                setBatchQueue={setBatchQueue}
                processBatch={processBatch}
                isBatchProcessing={isBatchProcessing}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
                error={error}
                fileInputRef={fileInputRef}
                expectedValueInputRef={expectedValueInputRef}
                setLightboxOpen={setLightboxOpen}
              />
            </div>
          </div>

          {/* Result Viewer */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <ResultViewer 
              isProcessing={isProcessing}
              result={result}
              isEditing={isEditing}
              editedResult={editedResult}
              copiedField={copiedField}
              expectedValue={expectedValue}
              department={department}
              onEditToggle={handleEditToggle}
              onExportCSV={handleExportSingleCSV}
              onShareSummary={handleShareSummary}
              onPrint={handlePrint}
              onReset={resetForm}
              onCancelEdit={() => {
                setIsEditing(false);
                setEditedResult(null);
              }}
              onCopyToClipboard={copyToClipboard}
              setEditedResult={setEditedResult}
            />
          </div>
        </div>

        {/* History Section */}
        <HistoryDrawer 
          history={history}
          historyFilter={historyFilter}
          setHistoryFilter={setHistoryFilter}
          historySort={historySort}
          setHistorySort={setHistorySort}
          deletedHistoryItem={deletedHistoryItem}
          onUndoDelete={undoDelete}
          onDismissDeletedToast={() => setDeletedHistoryItem(null)}
          onRestoreMockData={restoreMockData}
          onExportHistoryCSV={handleExportHistoryCSV}
          onClearHistory={clearHistory}
          onLoadFromHistory={handleLoadFromHistory}
          onDeleteHistoryItem={deleteHistoryItem}
        />
      </div>

      {/* Lightbox Modal */}
      <LightboxModal 
        isOpen={lightboxOpen}
        filePreview={filePreview}
        imageRotation={imageRotation}
        lightboxZoom={lightboxZoom}
        onClose={() => setLightboxOpen(false)}
        setLightboxZoom={setLightboxZoom}
        setImageRotation={setImageRotation}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
