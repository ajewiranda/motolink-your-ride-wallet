import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Camera, LogOut, ChevronRight, 
  Wallet, Phone, Mail, HelpCircle, Shield, Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function ProfilePage() {
  const { user, wallet, logout, setUser } = useApp();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveEdit = () => {
    if (user) {
      setUser({
        ...user,
        name: editName,
        phone: editPhone,
      });
      setShowEdit(false);
      toast({
        title: "Profil Diperbarui",
        description: "Data profil Anda telah berhasil diperbarui",
      });
    }
  };

  const menuItems = [
    {
      icon: Wallet,
      label: "Dompet Saya",
      value: `Rp ${(wallet?.balance || 0).toLocaleString("id-ID")}`,
      onClick: () => navigate("/wallet"),
    },
    {
      icon: Settings,
      label: "Pengaturan",
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: "Bantuan",
      onClick: () => {},
    },
    {
      icon: Shield,
      label: "Kebijakan Privasi",
      onClick: () => {},
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen pb-4">
        {/* Header */}
        <header className="motolink-gradient px-4 pt-12 pb-16 safe-top">
          <h1 className="text-xl font-bold text-primary-foreground">Profil</h1>
        </header>

        {/* Profile Card */}
        <div className="px-4 -mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-5 card-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">{user?.name}</h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEditName(user?.name || "");
                setEditPhone(user?.phone || "");
                setShowEdit(true);
              }}
            >
              Edit Profil
            </Button>
          </motion.div>
        </div>

        {/* Menu */}
        <div className="px-4 mt-6 space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.value ? (
                <span className="text-sm text-primary font-semibold">{item.value}</span>
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.button>
          ))}

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: menuItems.length * 0.05 }}
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 bg-card border border-destructive/20 rounded-xl p-4 hover:bg-destructive/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="flex-1 text-left font-medium text-destructive">Keluar</span>
          </motion.button>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          MotoLink v1.0.0
        </p>

        {/* Edit Dialog */}
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Masukkan nama"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">No. Telepon</label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <Button className="w-full" onClick={handleSaveEdit}>
                Simpan Perubahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout Confirmation */}
        <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Keluar dari Akun?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan keluar dari akun MotoLink. Data lokal akan dihapus.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                Ya, Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
