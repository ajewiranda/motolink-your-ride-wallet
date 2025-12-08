import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Motor } from "@/types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MotorCardProps {
  motor: Motor;
  index?: number;
  variant?: "default" | "compact";
  className?: string;
}

export function MotorCard({ motor, index = 0, variant = "default", className }: MotorCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/motor/${motor.id}`)}
      className={cn(
        "bg-card rounded-xl overflow-hidden border border-border card-shadow cursor-pointer hover:card-shadow-hover transition-shadow",
        variant === "compact" && "flex gap-3 p-3",
        className
      )}
    >
      {/* Image */}
      <div className={cn(
        "relative overflow-hidden bg-muted",
        variant === "default" ? "aspect-[4/3]" : "w-24 h-24 rounded-lg flex-shrink-0"
      )}>
        <img
          src={motor.images[0]}
          alt={motor.name}
          className="w-full h-full object-cover"
        />
        {motor.type === "manual" && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-warning text-warning-foreground text-xs font-medium">
            Manual
          </span>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1",
        variant === "default" && "p-3"
      )}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {motor.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-xs font-medium">{motor.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{motor.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-primary font-bold">
              Rp {motor.pricePerDay.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-muted-foreground">/hari</span>
          </div>
          {variant === "default" && (
            <span className="text-xs text-muted-foreground">
              {motor.cc}cc • {motor.year}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
