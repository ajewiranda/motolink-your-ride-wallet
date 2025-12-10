import { cn } from "@/lib/utils";

interface MotoLinkLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "white";
}

export function MotoLinkLogo({ className, size = "md", variant = "default" }: MotoLinkLogoProps) {
  const sizes = {
    sm: { main: "text-xl", sub: "text-[8px]" },
    md: { main: "text-2xl", sub: "text-[10px]" },
    lg: { main: "text-3xl", sub: "text-xs" },
    xl: { main: "text-4xl", sub: "text-sm" },
  };

  const { main, sub } = sizes[size];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Main Logo Text */}
      <div className="relative">
        <span
          className={cn(
            "font-extrabold tracking-tight",
            main,
            variant === "white" ? "text-white" : ""
          )}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {variant === "white" ? (
            <>
              <span className="text-white">Moto</span>
              <span className="text-white/80">Link</span>
            </>
          ) : (
            <>
              <span className="text-primary">Moto</span>
              <span className="text-foreground">Link</span>
            </>
          )}
        </span>
        
        {/* Decorative underline */}
        <div
          className={cn(
            "absolute -bottom-1 left-0 right-0 h-[3px] rounded-full",
            variant === "white" ? "bg-white/50" : "motolink-gradient"
          )}
        />
      </div>

      {/* Tagline */}
      <span
        className={cn(
          "tracking-[0.3em] uppercase font-semibold mt-2",
          sub,
          variant === "white" ? "text-white/70" : "text-muted-foreground"
        )}
      >
        Motor Rental
      </span>
    </div>
  );
}
