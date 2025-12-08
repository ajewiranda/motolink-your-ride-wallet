import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  compact?: boolean;
  className?: string;
}

export function WalletCard({ compact = false, className }: WalletCardProps) {
  const { wallet, transactions } = useApp();
  const navigate = useNavigate();

  const lastTransaction = transactions[0];
  const balance = wallet?.balance || 0;

  if (compact) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/wallet")}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border card-shadow",
          className
        )}
      >
        <div className="w-10 h-10 rounded-lg motolink-gradient flex items-center justify-center">
          <Wallet className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="text-left">
          <p className="text-xs text-muted-foreground">Saldo Dompet</p>
          <p className="text-lg font-bold">
            Rp {balance.toLocaleString("id-ID")}
          </p>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl motolink-gradient p-5 text-primary-foreground",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Dompet MotoLink</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/wallet/topup")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Top Up
          </motion.button>
        </div>

        <div className="mb-4">
          <p className="text-sm opacity-75 mb-1">Saldo Anda</p>
          <p className="text-3xl font-bold">
            Rp {balance.toLocaleString("id-ID")}
          </p>
        </div>

        {lastTransaction && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10">
            {lastTransaction.type === "topup" ? (
              <ArrowDownLeft className="w-4 h-4 text-green-300" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-red-300" />
            )}
            <span className="text-xs opacity-90 flex-1 truncate">
              {lastTransaction.description}
            </span>
            <span className={cn(
              "text-xs font-medium",
              lastTransaction.type === "topup" ? "text-green-300" : "text-red-300"
            )}>
              {lastTransaction.type === "topup" ? "+" : "-"}
              Rp {lastTransaction.amount.toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
