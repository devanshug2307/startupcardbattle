import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 0,
  radius = 50,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
          style={{
            width: radius * 2,
            height: radius * 2,
            left: -radius,
            top: -radius,
          }}
        >
          <circle
            className="stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeWidth="1"
          />
        </svg>
      )}

      <div
        style={
          {
            "--radius": `${radius}px`,
            "--duration": `${duration}s`,
            animationDelay: `${delay}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
        className="absolute animate-orbit"
      >
        <div className={cn("flex items-center justify-center", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
