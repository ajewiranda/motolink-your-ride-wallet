import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { useApp } from "@/contexts/AppContext";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <main className={!hideNav && user ? "pb-20" : ""}>
        {children}
      </main>
      {!hideNav && user && <BottomNav />}
    </div>
  );
}
