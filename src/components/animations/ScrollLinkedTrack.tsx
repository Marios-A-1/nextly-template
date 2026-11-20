"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import { motion, useScroll, useTransform } from "motion/react"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type ScrollLinkedTrackProps = {
  children: ReactNode
  className?: string
  distance?: number
}

export function ScrollLinkedTrack({
  children,
  className,
  distance = 12,
}: ScrollLinkedTrackProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const updateViewportState = () => setIsMobileViewport(mediaQuery.matches)

    updateViewportState()
    mediaQuery.addEventListener("change", updateViewportState)

    return () => mediaQuery.removeEventListener("change", updateViewportState)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0, 1], [distance, -distance])

  return (
    <motion.div
      ref={ref}
      style={{ x: prefersReducedMotion || isMobileViewport ? 0 : x }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
