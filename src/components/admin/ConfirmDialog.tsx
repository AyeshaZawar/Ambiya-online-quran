import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirm Deletion',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#e5dfd3] shadow-xl overflow-hidden">
        <div className="px-5 py-4 bg-[#FAF7F2] border-b border-[#e5dfd3] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#11382b]">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h4 className="font-serif text-base font-bold">{title}</h4>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#55635c] hover:text-[#11382b] cursor-pointer"
            aria-label="Close confirmation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-sm text-[#333e38] leading-relaxed">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-[#d6cfc1] text-xs font-semibold text-[#4f5953] hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
