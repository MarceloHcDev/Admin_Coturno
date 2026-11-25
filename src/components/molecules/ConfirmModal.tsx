import React from "react";
import { AlertTriangle, Trash2, Power, CheckCircle2 } from "lucide-react";

export type ConfirmModalVariant = "danger" | "warning" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  variant?: ConfirmModalVariant;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const VARIANT_STYLES: Record<
  ConfirmModalVariant,
  {
    iconBg: string;
    buttonBg: string;
    Icon: React.FC<{ className?: string }>;
    ConfirmIcon: React.FC<{ className?: string }>;
  }
> = {
  danger: {
    iconBg: "bg-rose-100 text-rose-600",
    buttonBg: "bg-rose-600 hover:bg-rose-700",
    Icon: Trash2,
    ConfirmIcon: AlertTriangle,
  },
  warning: {
    iconBg: "bg-amber-100 text-amber-600",
    buttonBg: "bg-amber-600 hover:bg-amber-700",
    Icon: Power,
    ConfirmIcon: Power,
  },
  success: {
    iconBg: "bg-emerald-100 text-emerald-600",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700",
    Icon: CheckCircle2,
    ConfirmIcon: Power,
  },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Sim, Excluir",
  cancelText = "Cancelar",
  loadingText = "Excluindo...",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  const { iconBg, buttonBg, Icon, ConfirmIcon } = VARIANT_STYLES[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pl-64 p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-2 ${buttonBg}`}
          >
            {loading ? (
              <span>{loadingText}</span>
            ) : (
              <>
                <ConfirmIcon className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
