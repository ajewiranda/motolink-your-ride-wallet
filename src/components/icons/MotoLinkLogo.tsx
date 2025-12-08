import { cn } from "@/lib/utils";

interface MotoLinkLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function MotoLinkLogo({ className, size = "md", showText = true }: MotoLinkLogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-2xl" },
    xl: { icon: 72, text: "text-3xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className="relative flex items-center justify-center rounded-xl motolink-gradient motolink-shadow"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-2/3 h-2/3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="5.5" cy="17.5" r="3.5" className="fill-primary-foreground/20 stroke-primary-foreground" />
          <circle cx="18.5" cy="17.5" r="3.5" className="fill-primary-foreground/20 stroke-primary-foreground" />
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" className="fill-primary-foreground stroke-primary-foreground" />
          <path d="m12 17 2-8h3l.5 2" className="stroke-primary-foreground" />
          <path d="M9 17L7 9h3l2 4 2-4" className="stroke-primary-foreground" />
        </svg>
      </div>
      {showText && (
        <div className={cn("font-bold tracking-tight", text)}>
          <span className="motolink-gradient-text">Moto</span>
          <span className="text-foreground">Link</span>
        </div>
      )}
    </div>
  );
}
