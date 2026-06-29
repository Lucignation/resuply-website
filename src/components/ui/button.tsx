import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--market-green)] text-white shadow-sm hover:bg-[var(--market-green-dark)] focus-visible:ring-[var(--market-green)]",
        terracotta:
          "bg-[var(--terracotta)] text-white shadow-sm hover:bg-[var(--terracotta-dark)] focus-visible:ring-[var(--terracotta)]",
        outline:
          "border-2 border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white focus-visible:ring-[var(--ink)]",
        ghost:
          "bg-transparent text-[var(--ink)] hover:bg-[var(--sage)]",
      },
      size: {
        default: "h-12 px-6 py-2 has-[>svg]:px-5",
        sm: "h-9 px-4 has-[>svg]:px-3",
        lg: "h-14 px-8 text-base has-[>svg]:px-7",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
