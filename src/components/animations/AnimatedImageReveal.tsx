"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import { motion } from "motion/react"
import { useMemo } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { easePremium, viewport } from "@/lib/animations"

type AnimatedImageRevealVariant = "default" | "subtle" | "card"
type AnimatedImageRevealTag = "div" | "article" | "figure" | "aside"

type AnimatedImageRevealProps = {
  children?: ReactNode
  className?: string
  imageClassName?: string
  delay?: number
  once?: boolean
  amount?: number
  variant?: AnimatedImageRevealVariant
  as?: AnimatedImageRevealTag
  frameMotion?: boolean
}

const imageRevealSettings: Record<
  AnimatedImageRevealVariant,
  {
    opacity: number
    y: number
    scale: number
    filter: string
    frameY: number
    frameDuration: number
    imageDuration: number
  }
> = {
  default: {
    opacity: 0,
    y: 22,
    scale: 1.7,
    filter: "blur(16px)",
    frameY: 10,
    frameDuration: 0.96,
    imageDuration: 3.1,
  },
  subtle: {
    opacity: 0,
    y: 14,
    scale: 1.3,
    filter: "blur(13px)",
    frameY: 8,
    frameDuration: 0.9,
    imageDuration: 2.65,
  },
  card: {
    opacity: 0,
    y: 20,
    scale: 1.6,
    filter: "blur(16px)",
    frameY: 12,
    frameDuration: 1,
    imageDuration: 3.25,
  },
}

export function AnimatedImageReveal({
  children,
  className,
  imageClassName,
  delay = 0,
  once = true,
  amount,
  variant = "default",
  as = "div",
  frameMotion = true,
}: AnimatedImageRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const MotionTag = motion[as]
  const StaticTag = as
  const frameVariants = useMemo(() => {
    const settings = imageRevealSettings[variant]

    return {
      hidden: {
        opacity: frameMotion ? settings.opacity : 1,
        y: frameMotion ? settings.frameY : 0,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          delay,
          duration: settings.frameDuration,
          ease: easePremium,
        },
      },
    }
  }, [delay, frameMotion, variant])
  const imageVariants = useMemo(() => {
    const settings = imageRevealSettings[variant]

    return {
      hidden: {
        opacity: settings.opacity,
        y: settings.y,
        scale: settings.scale,
        filter: settings.filter,
      },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          delay: delay + 0.04,
          duration: settings.imageDuration,
          ease: easePremium,
        },
      },
    }
  }, [delay, variant])

  if (prefersReducedMotion) {
    return (
      <StaticTag className={cn("relative overflow-hidden", className)} data-image-reveal={variant}>
        {imageClassName ? <div className={cn("absolute inset-0", imageClassName)} /> : null}
        {children}
      </StaticTag>
    )
  }

  return (
    <MotionTag
      className={cn("relative overflow-hidden will-change-transform", className)}
      data-image-reveal={variant}
      variants={frameVariants}
      initial="hidden"
      whileInView="show"
      viewport={{
        ...viewport,
        once,
        amount: amount ?? viewport.amount,
      }}
    >
      {imageClassName ? (
        <motion.div className={cn("absolute inset-0", imageClassName)} variants={imageVariants} />
      ) : (
        <motion.div className="h-full w-full" variants={imageVariants}>
          {children}
        </motion.div>
      )}
      {imageClassName ? children : null}
    </MotionTag>
  )
}

export type { AnimatedImageRevealTag, AnimatedImageRevealVariant }
