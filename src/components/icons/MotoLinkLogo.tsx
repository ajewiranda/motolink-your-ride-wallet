import { cn } from "@/lib/utils";

interface MotoLinkLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "white";
}

export function MotoLinkLogo({ className, size = "md", showText = true, variant = "default" }: MotoLinkLogoProps) {
  const sizes = {
    sm: { icon: 40, text: "text-sm" },
    md: { icon: 56, text: "text-base" },
    lg: { icon: 72, text: "text-lg" },
    xl: { icon: 96, text: "text-xl" },
  };

  const { icon } = sizes[size];

  const primaryColor = variant === "white" ? "#FFFFFF" : "#1A73E8";
  const secondaryColor = variant === "white" ? "rgba(255,255,255,0.15)" : "#E8F1FD";
  const strokeColor = "#FFFFFF";
  const textOnBadge = "#FFFFFF";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Badge circle background */}
        <circle cx="50" cy="50" r="48" fill={secondaryColor} stroke={strokeColor} strokeWidth="3" />
        
        {/* Inner circle */}
        <circle cx="50" cy="50" r="38" fill={primaryColor} />
        
        {/* Handlebar - left mirror */}
        <circle cx="18" cy="35" r="6" fill={primaryColor} stroke={strokeColor} strokeWidth="2" />
        <line x1="24" y1="35" x2="35" y2="42" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        
        {/* Handlebar - right mirror */}
        <circle cx="82" cy="35" r="6" fill={primaryColor} stroke={strokeColor} strokeWidth="2" />
        <line x1="76" y1="35" x2="65" y2="42" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        
        {/* Handlebar center with speedometer */}
        <path
          d="M35 42 Q50 35 65 42 L62 50 Q50 45 38 50 Z"
          fill={primaryColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        
        {/* Speedometer circle */}
        <circle cx="50" cy="44" r="5" fill={primaryColor} stroke={strokeColor} strokeWidth="1.5" />
        
        {/* Text: MOTO */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill={textOnBadge}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="14"
          letterSpacing="2"
        >
          MOTO
        </text>
        
        {/* Text: LINK */}
        <text
          x="50"
          y="76"
          textAnchor="middle"
          fill={textOnBadge}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="14"
          letterSpacing="2"
        >
          LINK
        </text>
        
        {/* Decorative line */}
        <line x1="30" y1="81" x2="70" y2="81" stroke={textOnBadge} strokeWidth="1" strokeOpacity="0.5" />
        
        {/* Stars */}
        <circle cx="40" cy="86" r="1.5" fill={textOnBadge} />
        <circle cx="50" cy="86" r="1.5" fill={textOnBadge} />
        <circle cx="60" cy="86" r="1.5" fill={textOnBadge} />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-extrabold tracking-tight leading-none",
            sizes[size].text,
            variant === "white" ? "text-white" : "motolink-gradient-text"
          )}>
            MOTOLINK
          </span>
          <span className={cn(
            "text-xs tracking-widest",
            variant === "white" ? "text-white/70" : "text-muted-foreground"
          )}>
            RENTAL
          </span>
        </div>
      )}
    </div>
  );
}
