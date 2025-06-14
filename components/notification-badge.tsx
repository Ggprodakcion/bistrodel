import type React from "react"

import { cn } from "@/lib/utils"

interface NotificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number
}

export function NotificationBadge({ count, className, ...props }: NotificationBadgeProps) {
  if (count === 0) {
    return null
  }

  return (
    <span
      className={cn(
        "absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full",
        className,
      )}
      {...props}
    >
      {count}
    </span>
  )
}
