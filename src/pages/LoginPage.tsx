import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MotoLinkLogo } from "@/components/icons/MotoLinkLogo";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Simulate Google login
    login({
      id: `user_${Date.now()}`,
      name: "User MotoLink",
      email: "user@motolink.id",
      phone: "081234567890",
      photoURL: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center"
        >
          <MotoLinkLogo size="xl" className="mb-8" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-2xl font-bold mb-3">
              Sewa Motor <span className="motolink-gradient-text">Mudah & Cepat</span>
            </h1>
            <p className="text-muted-foreground max-w-xs">
              Temukan motor impian Anda dengan harga terbaik di seluruh Indonesia
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-6 mb-12"
          >
            {[
              { icon: "🏍️", label: "500+ Motor" },
              { icon: "📍", label: "10+ Kota" },
              { icon: "⭐", label: "4.8 Rating" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Login section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 pb-10 bg-card rounded-t-3xl border-t border-border safe-bottom"
      >
        <h2 className="text-lg font-semibold text-center mb-6">
          Masuk untuk Melanjutkan
        </h2>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          size="lg"
          className="w-full h-14 text-base font-medium"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Masuk dengan Google
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Dengan masuk, Anda menyetujui{" "}
          <span className="text-primary">Syarat & Ketentuan</span> dan{" "}
          <span className="text-primary">Kebijakan Privasi</span> kami
        </p>
      </motion.div>
    </div>
  );
}
