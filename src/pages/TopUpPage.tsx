import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

export function TopUpPage() {
  const { wallet, topUp, isLoading } = useApp();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const handleQuickAmount = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    const numValue = parseInt(value.replace(/\D/g, ""));
    setCustomAmount(value);
    setAmount(isNaN(numValue) ? "" : numValue);
  };

  const handleTopUp = async () => {
    if (!amount || amount < 10000) {
      toast({
        title: "Jumlah Tidak Valid",
        description: "Minimum top up adalah Rp 10.000",
        variant: "destructive",
      });
      return;
    }

    const result = await topUp(amount);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/wallet");
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-6"
        >
          <Check className="w-10 h-10 text-success-foreground" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          Top Up Berhasil!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-center"
        >
          Rp {(amount as number).toLocaleString("id-ID")} telah ditambahkan ke dompet Anda
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border safe-top">
        <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Top Up Dompet</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Current Balance */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
          <div className="w-10 h-10 rounded-lg motolink-gradient flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo Saat Ini</p>
            <p className="text-lg font-bold">
              Rp {(wallet?.balance || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Amount Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">Pilih Nominal</label>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((value) => (
              <Button
                key={value}
                variant={amount === value ? "default" : "outline"}
                onClick={() => handleQuickAmount(value)}
                className="h-12"
              >
                Rp {(value / 1000).toFixed(0)}K
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Atau Masukkan Nominal
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              Rp
            </span>
            <Input
              type="text"
              placeholder="0"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              className="pl-10 h-14 text-lg font-semibold"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Minimum top up Rp 10.000
          </p>
        </div>

        {/* Summary */}
        {amount && amount >= 10000 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted rounded-xl p-4 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nominal Top Up</span>
              <span>Rp {(amount as number).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biaya Admin</span>
              <span className="text-success">Gratis</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold text-primary">
                Rp {(amount as number).toLocaleString("id-ID")}
              </span>
            </div>
          </motion.div>
        )}

        {/* Action */}
        <Button
          className="w-full h-14 text-base"
          disabled={!amount || (amount as number) < 10000 || isLoading}
          onClick={handleTopUp}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Top Up Sekarang"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Ini adalah simulasi top up. Saldo akan langsung ditambahkan.
        </p>
      </div>
    </div>
  );
}
