import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-xl border-2 border-[var(--ink)]/15 bg-white px-4 py-2 text-base text-[var(--ink)] shadow-sm transition-colors outline-none placeholder:text-[var(--ink)]/40 focus-visible:border-[var(--market-green)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
