import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { Motor } from "@/types";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BookingModalProps {
  motor: Motor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ motor, open, onOpenChange }: BookingModalProps) {
  const { wallet, createBooking, isLoading } = useApp();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [step, setStep] = useState<"form" | "confirm" | "success" | "error">("form");
  const [errorMessage, setErrorMessage] = useState("");

  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const totalPrice = days * motor.pricePerDay;
  const balance = wallet?.balance || 0;
  const insufficientBalance = balance < totalPrice;

  const handleBooking = async () => {
    if (!startDate || !endDate) return;

    setStep("confirm");
    const result = await createBooking(motor.id, startDate, endDate);

    if (result.success) {
      setStep("success");
    } else {
      setErrorMessage(result.message);
      setStep("error");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
      setStartDate(undefined);
      setEndDate(undefined);
      setErrorMessage("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle>Booking {motor.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Tanggal Mulai
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "d MMM", { locale: id }) : "Pilih"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (date && (!endDate || endDate < date)) {
                              setEndDate(addDays(date, 1));
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Tanggal Selesai
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "d MMM", { locale: id }) : "Pilih"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => 
                            date < new Date() || (startDate ? date < startDate : false)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Summary */}
                {days > 0 && (
                  <div className="bg-muted rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Durasi</span>
                      <span className="font-medium">{days} hari</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Harga per hari</span>
                      <span>Rp {motor.pricePerDay.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-primary">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Wallet Balance */}
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border",
                  insufficientBalance && days > 0
                    ? "border-destructive bg-destructive/5"
                    : "border-border"
                )}>
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Saldo Dompet</p>
                    <p className={cn(
                      "text-sm",
                      insufficientBalance && days > 0 ? "text-destructive" : "text-muted-foreground"
                    )}>
                      Rp {balance.toLocaleString("id-ID")}
                    </p>
                  </div>
                  {insufficientBalance && days > 0 && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        handleClose();
                        navigate("/wallet/topup");
                      }}
                    >
                      Top Up
                    </Button>
                  )}
                </div>

                {insufficientBalance && days > 0 && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>Saldo tidak cukup untuk booking ini</span>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!startDate || !endDate || insufficientBalance}
                  onClick={handleBooking}
                >
                  Konfirmasi Booking
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="w-16 h-16 rounded-full motolink-gradient flex items-center justify-center mb-4 animate-pulse-soft">
                <Wallet className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Memproses Pembayaran</h3>
              <p className="text-sm text-muted-foreground text-center">
                Mohon tunggu sebentar...
              </p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Booking Berhasil!</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Motor {motor.name} telah berhasil dibooking
              </p>
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Tutup
                </Button>
                <Button 
                  onClick={() => {
                    handleClose();
                    navigate("/history");
                  }}
                  className="flex-1"
                >
                  Lihat Riwayat
                </Button>
              </div>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-destructive-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Booking Gagal</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {errorMessage}
              </p>
              <Button onClick={() => setStep("form")} className="w-full">
                Coba Lagi
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
