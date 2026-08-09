import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { ToastProps } from '@/lib/types/finance';

export type Toast = ToastProps;

interface ToastContainerProps {
  toasts: ToastProps[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`px-4 py-3 rounded-2xl premium-card text-xs font-semibold flex items-center gap-2.5 shadow-2xl border text-white pointer-events-auto backdrop-blur-xl ${
              toast.type === 'success' ? 'border-zinc-500/50 bg-zinc-950/40' :
              toast.type === 'error' ? 'border-zinc-500/50 bg-zinc-950/40' :
              'border-zinc-500/50 bg-[#333]/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-zinc-400 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-zinc-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#aaa] shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
