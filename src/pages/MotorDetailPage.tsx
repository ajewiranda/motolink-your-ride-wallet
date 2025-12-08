import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Star, MapPin, Share2, Heart, 
  Phone, Calendar, Fuel, Settings2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/booking/BookingModal";
import { useApp } from "@/contexts/AppContext";

export function MotorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { motors } = useApp();
  const [showBooking, setShowBooking] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const motor = motors.find((m) => m.id === id);

  if (!motor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Motor tidak ditemukan</p>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo, saya tertarik untuk menyewa ${motor.name}. Apakah masih tersedia?`
    );
    window.open(`https://wa.me/${motor.ownerPhone}?text=${message}`, "_blank");
  };

  const specs = [
    { icon: Settings2, label: "Transmisi", value: motor.type === "matic" ? "Matic" : "Manual" },
    { icon: Fuel, label: "Mesin", value: `${motor.cc}cc` },
    { icon: Calendar, label: "Tahun", value: motor.year.toString() },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Image Gallery */}
      <div className="relative aspect-[4/3] bg-muted">
        <motion.img
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={motor.images[activeImage]}
          alt={motor.name}
          className="w-full h-full object-cover"
        />

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center safe-top">
          <Button
            size="icon"
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button size="icon" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Image Thumbnails */}
        {motor.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {motor.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeImage 
                    ? "w-6 bg-primary" 
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-5">
        {/* Title & Rating */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold">{motor.name}</h1>
            <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold text-sm">{motor.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({motor.totalReviews})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{motor.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-secondary rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Harga Sewa</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">
              Rp {motor.pricePerDay.toLocaleString("id-ID")}
            </span>
            <span className="text-muted-foreground">/hari</span>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3">
          {specs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
              <Icon className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Fasilitas
          </h3>
          <div className="flex flex-wrap gap-2">
            {motor.features.map((feature) => (
              <Badge key={feature} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Deskripsi</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {motor.description}
          </p>
        </div>

        {/* Owner */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Pemilik</p>
              <p className="font-medium">{motor.ownerName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleWhatsApp}>
              <Phone className="w-4 h-4 mr-2" />
              Hubungi
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border safe-bottom">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-shrink-0"
            onClick={handleWhatsApp}
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button size="lg" className="flex-1" onClick={() => setShowBooking(true)}>
            Sewa Sekarang
          </Button>
        </div>
      </div>

      <BookingModal 
        motor={motor} 
        open={showBooking} 
        onOpenChange={setShowBooking} 
      />
    </div>
  );
}
