import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  filePreview: string | null;
  file?: File | null;
  lightboxZoom: number;
  setLightboxZoom: React.Dispatch<React.SetStateAction<number>>;
  imageRotation: number;
  setImageRotation: React.Dispatch<React.SetStateAction<number>>;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  filePreview,
  file,
  lightboxZoom,
  setLightboxZoom,
  imageRotation,
  setImageRotation,
}) => {
  if (!isOpen || !filePreview) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        <div 
          className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Controls Bar */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 p-2 rounded-full border border-white/20 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setLightboxZoom(prev => Math.min(prev + 0.25, 3))}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setLightboxZoom(prev => Math.max(prev - 0.25, 0.5))}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setImageRotation(prev => (prev + 90) % 360)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              title="Rotacionar"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-500/20 text-zinc-300 transition-colors"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Canvas */}
          <div className="overflow-auto max-w-full max-h-full flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={filePreview} 
              alt={file?.name || "Visualização do Documento"}
              style={{
                transform: `scale(${lightboxZoom}) rotate(${imageRotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
