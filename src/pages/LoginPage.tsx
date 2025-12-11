import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotoLinkLogo } from "@/components/icons/MotoLinkLogo";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Google Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const userInfo = await userInfoResponse.json();

        login({
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          phone: "", // Google doesn't provide phone by default without specific scope/setup
          photoURL: userInfo.picture,
        });

        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${userInfo.name}!`,
        });

        navigate("/");
      } catch (error) {
        console.error("Google Login Error:", error);
        toast({
          title: "Login Gagal",
          description: "Gagal mengambil data pengguna dari Google",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      toast({
        title: "Login Gagal",
        description: "Gagal terhubung ke Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email dan password harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp) {
      if (!name) {
        toast({
          title: "Error",
          description: "Nama harus diisi",
          variant: "destructive",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Password tidak cocok",
          variant: "destructive",
        });
        return;
      }
      if (password.length < 6) {
        toast({
          title: "Error",
          description: "Password minimal 6 karakter",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isSignUp) {
      // Simulate signup
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Akun Anda telah dibuat. Silakan login.",
      });
      setIsSignUp(false);
      setPassword("");
      setConfirmPassword("");
    } else {
      // Simulate login
      login({
        id: `user_${Date.now()}`,
        name: name || email.split("@")[0],
        email: email,
        phone: "",
        photoURL: "",
      });
      navigate("/");
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
          <MotoLinkLogo size="lg" className="mb-6" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold mb-2">
              Sewa Motor <span className="motolink-gradient-text">Mudah & Cepat</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs">
              Temukan motor impian Anda dengan harga terbaik
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Login/Signup section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 pb-10 bg-card rounded-t-3xl border-t border-border safe-bottom"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "login"}
            initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-center mb-6">
              {isSignUp ? "Buat Akun Baru" : "Masuk ke Akun"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 h-12"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isSignUp && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 h-12"
                  />
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isSignUp ? "Mendaftar..." : "Masuk..."}
                  </>
                ) : (
                  isSignUp ? "Daftar" : "Masuk"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full h-12"
              disabled={isLoading}
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

            <p className="text-sm text-center mt-6">
              {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  resetForm();
                }}
                className="text-primary font-semibold hover:underline"
              >
                {isSignUp ? "Masuk" : "Daftar"}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Dengan masuk, Anda menyetujui{" "}
          <span className="text-primary">Syarat & Ketentuan</span> dan{" "}
          <span className="text-primary">Kebijakan Privasi</span> kami
        </p>
      </motion.div>
    </div>
  );
}
