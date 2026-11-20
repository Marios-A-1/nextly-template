"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import { createContext } from "react"
import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  createStaggerContainer,
  easePremium,
  motionDurations,
  type RevealPreset,
  viewport,
} from "@/lib/animations"

type StaggerTag = "div" | "section" | "article" | "ul" | "ol" | "li"

type StaggerProps = {
  children: ReactNode
  className?: string
  as?: StaggerTag
  stagger?: number
  delayChildren?: number
  once?: boolean
  amount?: number
  childVariant?: RevealPreset
}

type StaggerContextValue = {
  active: boolean
  childVariant: RevealPreset
}

export const StaggerContext = createContext<StaggerContextValue>({
  active: false,
  childVariant: "section",
})

const clampNonNegative = (value: number | undefined, fallback: number) => {
  if (value === undefined || Number.isNaN(value) || value < 0) {
    return fallback
  }

  return value
}

export function Stagger({
  children,
  className,
  as = "div",
  stagger = motionDurations.staggerDesktop,
  delayChildren = motionDurations.staggerMobile,
  once = true,
  amount,
  childVariant = "section",
}: StaggerProps) {
  const MotionTag = motion[as]
  const prefersReducedMotion = useReducedMotion()

  return (
    <StaggerContext.Provider value={{ active: true, childVariant }}>
      <MotionTag
        variants={createStaggerContainer({
          staggerChildren: clampNonNegative(stagger, motionDurations.staggerDesktop),
          delayChildren: clampNonNegative(delayChildren, motionDurations.staggerMobile),
          duration: motionDurations.section,
          ease: easePremium,
        })}
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
    </StaggerContext.Provider>
  )
}
