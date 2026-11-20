"use client"

import { Link } from "@/i18n/navigation"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import type { MouseEvent, ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  buttonArrowIncomingVariants,
  buttonArrowVariants,
  buttonSurfaceVariants,
} from "@/lib/animations"

type AnimatedButtonVariant = "primary" | "light" | "outline"

type AnimatedButtonProps = {
  children: ReactNode
  href?: string
  className?: string
  variant?: AnimatedButtonVariant
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  "aria-label"?: string
}

const variantClassName: Record<AnimatedButtonVariant, string> = {
  primary:
    "bg-[#2b2219] text-white shadow-[0_12px_30px_rgba(40,32,24,0.18)] hover:bg-[#3a2b1d]",
  light:
    "bg-white text-[#201b17] shadow-[0_12px_34px_rgba(40,32,24,0.14)] hover:bg-white/90",
  outline:
    "border border-ring bg-white text-[#201b17] hover:bg-white/90",
}

const arrowClassName: Record<AnimatedButtonVariant, string> = {
  primary: "bg-white text-[#2b2219]",
  light: "bg-[#2b2219] text-white",
  outline: "bg-[#2b2219] text-white",
}

export function AnimatedButton({
  children,
  href,
  className,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: AnimatedButtonProps) {
  const sharedClassName = cn(
    "group/button inline-flex min-h-12 w-full max-w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-center text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-auto sm:px-6",
    variantClassName[variant],
    className,
  )
  const content = (
    <>
      <span className="min-w-0 text-balance leading-tight">{children}</span>
      <span
        className={cn(
          "relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full",
          arrowClassName[variant],
        )}
        aria-hidden="true"
      >
        <motion.span
          className="absolute"
          variants={buttonArrowVariants}
        >
          <ArrowUpRight className="size-4" />
        </motion.span>
        <motion.span
          className="absolute"
          variants={buttonArrowIncomingVariants}
        >
          <ArrowUpRight className="size-4" />
        </motion.span>
      </span>
    </>
  )

  if (href) {
    return (
      <motion.div
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate="rest"
        variants={buttonSurfaceVariants}
        className="inline-flex w-full sm:w-auto"
      >
        <Link
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          className={sharedClassName}
          href={href}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault()
              return
            }

            onClick?.(event)
          }}
          tabIndex={disabled ? -1 : undefined}
        >
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={buttonSurfaceVariants}
      aria-label={ariaLabel}
      className={sharedClassName}
      disabled={disabled}
      onClick={(event) => onClick?.(event)}
      type={type}
    >
      {content}
    </motion.button>
  )
}
