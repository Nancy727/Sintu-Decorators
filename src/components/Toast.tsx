import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-400" size={24} />;
      case "error":
        return <XCircle className="text-red-400" size={24} />;
      case "warning":
        return <AlertCircle className="text-yellow-400" size={24} />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "from-green-600/20 to-green-500/20 border-green-500/30";
      case "error":
        return "from-red-600/20 to-red-500/20 border-red-500/30";
      case "warning":
        return "from-yellow-600/20 to-yellow-500/20 border-yellow-500/30";
      default:
        return "from-gray-600/20 to-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-8 right-8 z-[60] max-w-md"
          initial={{ opacity: 0, y: -50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div
            className={`bg-zinc-900 border-2 ${getColors()} rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl`}
          >
            <div className="p-4 flex items-center gap-3">
              <div className="flex-shrink-0">{getIcon()}</div>
              <p className="text-white text-sm flex-1">{message}</p>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className={`h-1 ${
                  type === "success"
                    ? "bg-green-500"
                    : type === "error"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
