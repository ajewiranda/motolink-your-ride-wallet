import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, MessageCircle, ArrowLeft, Send, Check, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "owner";
  timestamp: Date;
}

interface Notification {
  id: string;
  type: "booking" | "chat" | "promo";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  motorId?: string;
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
}

export function NotificationSheet() {
  const { bookings, motors } = useApp();
  const [open, setOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Notification | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [inputMessage, setInputMessage] = useState("");

  // Generate notifications from bookings and motors
  const notifications: Notification[] = [
    ...bookings.map((booking) => ({
      id: `notif_${booking.id}`,
      type: "booking" as const,
      title: booking.status === "confirmed" ? "Booking Dikonfirmasi" : "Status Booking",
      message: `Booking ${booking.motor?.name} telah ${booking.status === "confirmed" ? "dikonfirmasi" : booking.status}`,
      timestamp: booking.createdAt,
      read: false,
      motorId: booking.motorId,
      ownerId: booking.motor?.ownerId,
      ownerName: booking.motor?.ownerName,
      ownerPhone: booking.motor?.ownerPhone,
    })),
    // Sample promo notification
    {
      id: "promo_1",
      type: "promo" as const,
      title: "Promo Spesial!",
      message: "Dapatkan diskon 20% untuk sewa motor akhir pekan ini!",
      timestamp: new Date(),
      read: false,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChat) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
    }));
    setInputMessage("");

    // Simulate owner reply after 1 second
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `msg_${Date.now()}_reply`,
        text: getAutoReply(inputMessage),
        sender: "owner",
        timestamp: new Date(),
      };
      setChatMessages((prev) => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), reply],
      }));
    }, 1000);
  };

  const getAutoReply = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("harga") || lowerMessage.includes("berapa")) {
      return "Untuk harga sudah tertera di aplikasi ya kak. Ada yang bisa saya bantu lagi?";
    }
    if (lowerMessage.includes("tersedia") || lowerMessage.includes("available")) {
      return "Motor masih tersedia kak. Silakan langsung booking melalui aplikasi ya!";
    }
    if (lowerMessage.includes("lokasi") || lowerMessage.includes("ambil")) {
      return "Lokasi pengambilan sesuai yang tertera di detail motor. Bisa juga kami antarkan dengan biaya tambahan.";
    }
    return "Terima kasih sudah menghubungi kami. Ada yang bisa saya bantu?";
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Check className="w-4 h-4" />;
      case "chat":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-success/10 text-success";
      case "chat":
        return "bg-primary/10 text-primary";
      default:
        return "bg-warning/10 text-warning";
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-primary-foreground hover:bg-white/10 relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div
              key="chat"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setActiveChat(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                  <h3 className="font-semibold">{activeChat.ownerName}</h3>
                  <p className="text-xs text-muted-foreground">Pemilik Motor</p>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {/* Initial context message */}
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      Chat dimulai dari notifikasi booking
                    </span>
                  </div>

                  {(chatMessages[activeChat.id] || []).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex",
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        )}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            msg.sender === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {format(msg.timestamp, "HH:mm")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t border-border safe-bottom">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="flex flex-col h-full"
            >
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle>Notifikasi</SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-1">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-border">
                    {notifications.map((notif, index) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 hover:bg-muted/50 transition-colors",
                          !notif.read && "bg-secondary/50"
                        )}
                      >
                        <div className="flex gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                              getIconBg(notif.type)
                            )}
                          >
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm">{notif.title}</h4>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {format(notif.timestamp, "HH:mm", { locale: id })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            {notif.ownerName && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => setActiveChat(notif)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat {notif.ownerName}
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium mb-1">Belum Ada Notifikasi</h4>
                    <p className="text-sm text-muted-foreground text-center">
                      Notifikasi booking dan pesan akan muncul di sini
                    </p>
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
