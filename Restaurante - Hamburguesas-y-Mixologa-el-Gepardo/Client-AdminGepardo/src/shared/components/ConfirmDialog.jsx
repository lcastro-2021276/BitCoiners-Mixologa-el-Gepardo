import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
  icon: CustomIcon
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onConfirm();
      setIsAnimating(false);
    }, 200);
  };

  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: "bg-gradient-to-br from-red-950/95 to-red-900/95",
      border: "border-red-500/30",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      confirmBg: "bg-red-600 hover:bg-red-700",
      confirmText: "text-white"
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-950/95 to-amber-900/95",
      border: "border-amber-500/30",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      confirmBg: "bg-amber-600 hover:bg-amber-700",
      confirmText: "text-white"
    },
    info: {
      bg: "bg-gradient-to-br from-blue-950/95 to-blue-900/95",
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      confirmBg: "bg-blue-600 hover:bg-blue-700",
      confirmText: "text-white"
    }
  };

  const styles = typeStyles[type] || typeStyles.danger;
  const Icon = CustomIcon || ExclamationTriangleIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md transform rounded-2xl border ${styles.border} ${styles.bg} p-8 shadow-2xl transition-all duration-300 ${
          isAnimating ? "scale-95 opacity-90" : "scale-100 opacity-100"
        }`}
      >
        {/* Icon */}
        <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${styles.iconBg}`}>
          <Icon className={`h-8 w-8 ${styles.iconColor}`} />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            {title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/30"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isAnimating}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${styles.confirmBg} ${styles.confirmText} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAnimating ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
