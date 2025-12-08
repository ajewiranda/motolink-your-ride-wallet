import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { WalletCard } from "@/components/ui/WalletCard";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function WalletPage() {
  const { transactions } = useApp();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="min-h-screen pb-4">
        {/* Header */}
        <header className="px-4 pt-12 pb-6 safe-top">
          <h1 className="text-xl font-bold mb-6">Dompet MotoLink</h1>
          <WalletCard />

          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1"
              onClick={() => navigate("/wallet/topup")}
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Top Up
            </Button>
            <Button variant="outline" className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Riwayat
            </Button>
          </div>
        </header>

        {/* Transactions */}
        <div className="px-4">
          <h2 className="font-semibold mb-3">Transaksi Terakhir</h2>

          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-4"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    tx.type === "topup" ? "bg-success/10" : "bg-destructive/10"
                  )}>
                    {tx.type === "topup" ? (
                      <ArrowDownLeft className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(tx.timestamp, "d MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      tx.type === "topup" ? "text-success" : "text-destructive"
                    )}>
                      {tx.type === "topup" ? "+" : "-"}
                      Rp {tx.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Saldo: Rp {tx.balanceAfter.toLocaleString("id-ID")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium mb-1">Belum Ada Transaksi</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Top up sekarang untuk mulai menyewa motor
              </p>
              <Button onClick={() => navigate("/wallet/topup")}>
                Top Up Sekarang
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
