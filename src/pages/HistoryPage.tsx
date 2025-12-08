import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Wallet, ChevronRight, Calendar, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function HistoryPage() {
  const { bookings, transactions, cancelBooking } = useApp();
  const navigate = useNavigate();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const handleCancel = async () => {
    if (cancelId) {
      await cancelBooking(cancelId);
      setCancelId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      case "completed":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Dikonfirmasi";
      case "pending":
        return "Menunggu";
      case "cancelled":
        return "Dibatalkan";
      case "completed":
        return "Selesai";
      default:
        return status;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen">
        <header className="px-4 pt-12 pb-4 safe-top">
          <h1 className="text-xl font-bold">Riwayat</h1>
        </header>

        <Tabs defaultValue="booking" className="px-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="booking" className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Booking
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex-1">
              <Wallet className="w-4 h-4 mr-2" />
              Transaksi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking">
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={booking.motor?.images[0]}
                        alt={booking.motor?.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold truncate">
                            {booking.motor?.name}
                          </h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0",
                            getStatusColor(booking.status)
                          )}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{booking.motor?.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {format(booking.startDate, "d MMM", { locale: id })} - {format(booking.endDate, "d MMM yyyy", { locale: id })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-t border-border">
                      <div>
                        <span className="text-xs text-muted-foreground">Total: </span>
                        <span className="font-semibold text-primary">
                          Rp {booking.totalPrice.toLocaleString("id-ID")}
                        </span>
                      </div>
                      {booking.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setCancelId(booking.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Batalkan
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">Belum Ada Booking</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Mulai sewa motor sekarang!
                </p>
                <Button onClick={() => navigate("/")}>
                  Cari Motor
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wallet">
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
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      tx.type === "topup" ? "bg-success/10" : "bg-destructive/10"
                    )}>
                      <Wallet className={cn(
                        "w-5 h-5",
                        tx.type === "topup" ? "text-success" : "text-destructive"
                      )} />
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
                  Top up untuk mulai bertransaksi
                </p>
                <Button onClick={() => navigate("/wallet/topup")}>
                  Top Up Sekarang
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AlertDialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Batalkan Booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Saldo akan dikembalikan ke dompet Anda. Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Tidak</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                Ya, Batalkan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
