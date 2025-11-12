import toast from "react-hot-toast";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react"; // clean modern icons

export const Toaster = (message, status = "info") => {
  const common = {
    icon: null,
    style: {
      color: "#fff",
      display: "flex",
      alignItems: "center",
      fontWeight: 500,
    },
  };

  const variants = {
    success: {
      icon: <CheckCircle2 size={20} color="#22c55e" />,
      style: { background: "rgba(34,197,94,0.15)", color: "#16a34a" },
    },
    error: {
      icon: <XCircle size={20} color="#ef4444" />,
      style: { background: "rgba(239,68,68,0.15)", color: "#dc2626" },
    },
    warning: {
      icon: <AlertTriangle size={20} color="#f59e0b" />,
      style: { background: "rgba(245,158,11,0.15)", color: "#b45309" },
    },
    info: {
      icon: <Info size={20} color="#3b82f6" />,
      style: { background: "rgba(59,130,246,0.15)", color: "#1d4ed8" },
    },
  };

  const { icon, style } = variants[status] || variants.info;

  toast.custom(
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 backdrop-blur-md border border-white/10 shadow-lg"
      style={{
        ...common.style,
        ...style,
      }}
    >
      {icon}
      <span className="text-[15px]">{message}</span>
    </div>,
    { duration: 3000 }
  );
};