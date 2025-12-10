import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { WalletCard } from "@/components/ui/WalletCard";
import { MotorCard } from "@/components/motor/MotorCard";
import { FilterSheet } from "@/components/motor/FilterSheet";
import { NotificationSheet } from "@/components/notifications/NotificationSheet";
import { useApp } from "@/contexts/AppContext";
import { FilterOptions } from "@/types";
import { locations } from "@/data/mockMotors";

export function HomePage() {
  const { user, motors } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    transmission: "all",
    minPrice: 0,
    maxPrice: 500000,
    location: "Semua Lokasi",
  });

  const filteredMotors = useMemo(() => {
    return motors.filter((motor) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !motor.name.toLowerCase().includes(query) &&
          !motor.brand.toLowerCase().includes(query) &&
          !motor.location.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Transmission filter
      if (filters.transmission !== "all" && motor.type !== filters.transmission) {
        return false;
      }

      // Price filter
      if (motor.pricePerDay < filters.minPrice || motor.pricePerDay > filters.maxPrice) {
        return false;
      }

      // Location filter
      if (filters.location !== "Semua Lokasi" && motor.location !== filters.location) {
        return false;
      }

      return true;
    });
  }, [motors, searchQuery, filters]);

  const popularLocations = locations.slice(1, 5);

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <header className="motolink-gradient px-4 pt-12 pb-6 safe-top">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/80 text-sm">Selamat datang,</p>
              <h1 className="text-xl font-bold text-primary-foreground">
                {user?.name || "User"}
              </h1>
            </div>
            <NotificationSheet />
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari motor atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-0 h-12"
              />
            </div>
            <FilterSheet filters={filters} onApply={setFilters} />
          </div>
        </header>

        <div className="px-4 -mt-2 space-y-6 pb-4">
          {/* Wallet Card */}
          <WalletCard compact />

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl motolink-gradient p-5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <h2 className="text-lg font-bold text-primary-foreground mb-1">
                Sewa Motor Mudah & Cepat
              </h2>
              <p className="text-primary-foreground/80 text-sm mb-3">
                Dapatkan motor impian Anda dengan harga terbaik!
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              >
                Jelajahi Sekarang
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>

          {/* Quick Locations */}
          <div>
            <h3 className="font-semibold mb-3">Lokasi Populer</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {popularLocations.map((loc) => (
                <Button
                  key={loc}
                  variant={filters.location === loc ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ ...filters, location: loc })}
                  className="flex-shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  {loc}
                </Button>
              ))}
            </div>
          </div>

          {/* Motor List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                Motor Tersedia
                <span className="text-muted-foreground font-normal ml-2">
                  ({filteredMotors.length})
                </span>
              </h3>
            </div>

            {filteredMotors.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredMotors.map((motor, index) => (
                  <MotorCard key={motor.id} motor={motor} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">Motor Tidak Ditemukan</h4>
                <p className="text-sm text-muted-foreground">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
