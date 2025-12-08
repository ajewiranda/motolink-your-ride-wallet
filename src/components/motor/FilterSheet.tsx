import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Check } from "lucide-react";
import { FilterOptions, TransmissionType } from "@/types";
import { locations } from "@/data/mockMotors";
import { cn } from "@/lib/utils";

interface FilterSheetProps {
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

export function FilterSheet({ filters, onApply }: FilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const transmissionOptions: { value: TransmissionType; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "matic", label: "Matic" },
    { value: "manual", label: "Manual" },
  ];

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      transmission: "all",
      minPrice: 0,
      maxPrice: 500000,
      location: "Semua Lokasi",
    };
    setLocalFilters(defaultFilters);
  };

  const hasActiveFilters = 
    filters.transmission !== "all" || 
    filters.minPrice > 0 || 
    filters.maxPrice < 500000 ||
    filters.location !== "Semua Lokasi";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl h-[80vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Filter Motor</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto pb-24">
          {/* Transmission */}
          <div>
            <h4 className="font-medium mb-3">Transmisi</h4>
            <div className="flex gap-2">
              {transmissionOptions.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={localFilters.transmission === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocalFilters({ ...localFilters, transmission: value })}
                  className="flex-1"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Rentang Harga</h4>
            <div className="px-2">
              <Slider
                value={[localFilters.minPrice, localFilters.maxPrice]}
                onValueChange={([min, max]) => 
                  setLocalFilters({ ...localFilters, minPrice: min, maxPrice: max })
                }
                min={0}
                max={500000}
                step={10000}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Rp {localFilters.minPrice.toLocaleString("id-ID")}</span>
                <span>Rp {localFilters.maxPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium mb-3">Lokasi</h4>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocalFilters({ ...localFilters, location: loc })}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors",
                    localFilters.location === loc
                      ? "border-primary bg-secondary text-primary"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span>{loc}</span>
                  {localFilters.location === loc && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex gap-3 safe-bottom">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Terapkan Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
