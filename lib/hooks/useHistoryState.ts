import { useState, useEffect, useCallback } from 'react';
import { ReceiptData, INITIAL_MOCK_DATA } from '@/lib/types/finance';

const HISTORY_KEY = 'receipt_audit_history';

export function useHistoryState(addToast: (msg: string, type: 'success' | 'error' | 'info') => void) {
  const [history, setHistory] = useState<ReceiptData[]>([]);
  const [historyFilter, setHistoryFilter] = useState('');
  const [historySort, setHistorySort] = useState('date_desc');
  const [deletedHistoryItem, setDeletedHistoryItem] = useState<{ item: ReceiptData; index: number } | null>(null);

  // Load history from localStorage or fallback to INITIAL_MOCK_DATA
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          return;
        }
      }
      setHistory(INITIAL_MOCK_DATA);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_MOCK_DATA));
    } catch {
      setHistory(INITIAL_MOCK_DATA);
    }
  }, []);

  const saveToHistory = useCallback((newItem: ReceiptData) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== newItem.id);
      const updated = [newItem, ...filtered];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save history to localStorage', err);
      }
      return updated;
    });
  }, []);

  const deleteHistoryItem = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => {
      const index = prev.findIndex(i => i.id === id);
      if (index !== -1) {
        const itemToDelete = prev[index];
        setDeletedHistoryItem({ item: itemToDelete, index });
      }
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update localStorage after delete', err);
      }
      return updated;
    });
  }, []);

  const undoDelete = useCallback(() => {
    if (!deletedHistoryItem) return;
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory.splice(deletedHistoryItem.index, 0, deletedHistoryItem.item);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (err) {
        console.error('Failed to restore item in localStorage', err);
      }
      return newHistory;
    });
    setDeletedHistoryItem(null);
    addToast('Ação desfeita com sucesso', 'success');
  }, [addToast, deletedHistoryItem]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (err) {
      console.error('Failed to clear localStorage history', err);
    }
    addToast('Histórico limpo com sucesso!', 'info');
  }, [addToast]);

  const restoreMockData = useCallback(() => {
    setHistory(INITIAL_MOCK_DATA);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_MOCK_DATA));
    } catch (err) {
      console.error('Failed to restore mock data in localStorage', err);
    }
    addToast('Dados demonstrativos restaurados!', 'success');
  }, [addToast]);

  return {
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
  };
}
