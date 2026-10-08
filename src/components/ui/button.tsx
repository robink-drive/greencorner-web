import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary text-primary-foreground hover:bg-primary/85",
        outline:
          "rounded-full border-border bg-background hover:bg-muted hover:text-foreground",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-full hover:bg-muted hover:text-foreground",
        destructive:
          "rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "rounded-none text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-6 text-[15px]",
        sm: "h-9 gap-1.5 px-4 text-sm",
        lg: "h-14 gap-2 px-8 text-[17px]",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
