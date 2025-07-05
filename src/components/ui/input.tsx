import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary/20 selection:text-primary-foreground",
        "flex h-12 w-full min-w-0 rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3",
        "text-base font-medium text-white placeholder:text-white/50",
        "-webkit-backdrop-filter: blur(4px) backdrop-blur-sm shadow-lg shadow-black/20",
        "transition-all duration-300 ease-out",
        "focus-visible:border-white/30 focus-visible:bg-white/10 focus-visible:shadow-xl focus-visible:shadow-white/10",
        "hover:border-white/20 hover:bg-white/8",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
