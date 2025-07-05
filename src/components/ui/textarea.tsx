import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3",
        "text-base font-medium text-white placeholder:text-white/50",
        "-webkit-backdrop-filter: blur(4px) backdrop-blur-sm shadow-lg shadow-black/20",
        "transition-all duration-300 ease-out",
        "focus-visible:border-white/30 focus-visible:bg-white/10 focus-visible:shadow-xl focus-visible:shadow-white/10",
        "hover:border-white/20 hover:bg-white/8",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50",
        "resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
