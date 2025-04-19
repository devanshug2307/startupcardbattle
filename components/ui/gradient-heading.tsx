import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const gradientHeadingVariants = cva("font-bold tracking-tight", {
  variants: {
    size: {
      default: "text-3xl md:text-4xl",
      lg: "text-4xl md:text-5xl",
      xl: "text-5xl md:text-6xl",
      xxl: "text-6xl md:text-7xl",
    },
    variant: {
      default:
        "bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400",
      secondary:
        "bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-400 dark:to-gray-200",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

interface GradientHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof gradientHeadingVariants> {}

export function GradientHeading({
  className,
  size,
  variant,
  ...props
}: GradientHeadingProps) {
  return (
    <h1
      className={cn(
        gradientHeadingVariants({ size, variant }),
        "bg-clip-text text-transparent",
        className,
      )}
      {...props}
    />
  );
}
