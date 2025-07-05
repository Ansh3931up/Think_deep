import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25 hover:from-red-700 hover:to-pink-700 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5",
        outline:
          "border-2 border-white/20 bg-white/5 text-white backdrop-blur-sm shadow-lg shadow-black/20 hover:bg-white/10 hover:border-white/30 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-0.5",
        secondary:
          "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/25 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:shadow-gray-500/40 hover:-translate-y-0.5",
        ghost:
          "text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5",
        link: "text-purple-400 underline-offset-4 hover:text-purple-300 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-4 text-base font-semibold",
        sm: "h-10 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-sm font-medium",
        lg: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg font-bold",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
