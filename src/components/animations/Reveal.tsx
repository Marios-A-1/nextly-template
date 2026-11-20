"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import { motion } from "motion/react"
import { useContext, useMemo } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { revealVariants, transitionDefaults, type RevealPreset, viewport } from "@/lib/animations"
import { StaggerContext } from "./Stagger"

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "span"
  | "p"
  | "li"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol"

type RevealProps = {
  children?: ReactNode
  className?: string
  variant?: RevealPreset
  as?: RevealTag
  delay?: number
  once?: boolean
  amount?: number
  inherit?: boolean
}

export function Reveal({
  children,
  className,
  variant,
  as = "div",
  delay = 0,
  once = true,
  amount,
  inherit,
}: RevealProps) {
  const MotionTag = motion[as]
  const prefersReducedMotion = useReducedMotion()
  const staggerContext = useContext(StaggerContext)
  const resolvedVariant = variant ?? (staggerContext.active ? staggerContext.childVariant : "section")
  const resolvedInherit = inherit ?? staggerContext.active
  const variants = useMemo(() => {
    const baseVariants = revealVariants[resolvedVariant]
    const baseShow = baseVariants.show as { transition?: typeof transitionDefaults }

    if (!delay) {
      return baseVariants
    }

    return {
      hidden: baseVariants.hidden,
      show: {
        ...baseShow,
        transition: {
          ...transitionDefaults,
          ...(baseShow.transition ?? {}),
          delay,
        },
      },
    }
  }, [delay, resolvedVariant])

  if (resolvedInherit) {
    return (
      <MotionTag variants={variants} className={cn(className)}>
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      variants={variants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? "show" : undefined}
      whileInView={prefersReducedMotion ? undefined : "show"}
      viewport={{
        ...viewport,
        once,
        amount: amount ?? viewport.amount,
      }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  )
}

export type { RevealPreset as RevealAnimationVariant }
