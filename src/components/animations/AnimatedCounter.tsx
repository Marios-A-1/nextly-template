"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { easePremium, motionDurations } from "@/lib/animations"

type ParsedCounter = {
  value: number
  prefix: string
  suffix: string
  decimals: number
  shouldAnimate: boolean
}

type AnimatedCounterProps = {
  value: number | string
  className?: string
  duration?: number
  delay?: number
  from?: number
  prefix?: string
  suffix?: string
  viewportAmount?: number
}

const numberRegex =
  /^([^0-9+\-.]*)([+-]?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?)(.*?)$/

const parseValue = (value: number | string): ParsedCounter => {
  const raw = String(value).trim()
  const match = raw.match(numberRegex)

  if (/[0-9]\s*\/\s*[0-9]/.test(raw)) {
    return {
      value: 0,
      prefix: raw,
      suffix: "",
      decimals: 0,
      shouldAnimate: false,
    }
  }

  if (!match) {
    const numeric = Number.parseFloat(raw)
    return {
      value: Number.isFinite(numeric) ? numeric : 0,
      prefix: raw,
      suffix: "",
      decimals: 0,
      shouldAnimate: Number.isFinite(numeric),
    }
  }

  const prefix = match[1] ?? ""
  const numericPart = match[2]
  const suffix = match[3] ?? ""
  const normalized = numericPart.replace(/,/g, "")
  const number = Number.parseFloat(normalized)
  const decimals = numericPart.includes(".") ? Math.max(0, numericPart.split(".")[1]?.length ?? 0) : 0

  return {
    value: Number.isFinite(number) ? number : 0,
    prefix,
    suffix,
    decimals,
    shouldAnimate: true,
  }
}

const formatValue = (value: number, parsed: ParsedCounter) =>
  parsed.shouldAnimate
    ? `${parsed.prefix}${
    parsed.decimals > 0 ? value.toFixed(parsed.decimals) : Math.round(value).toString()
  }${parsed.suffix}`
    : `${parsed.prefix}${parsed.suffix}`

export function AnimatedCounter({
  value,
  className,
  duration = motionDurations.counter,
  delay = 0,
  from = 0,
  prefix,
  suffix,
  viewportAmount = 0.25,
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion()
  const counterRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(counterRef, { once: true, amount: viewportAmount })
  const parsed = useMemo(() => {
    const parsedValue = parseValue(value)

    return {
      ...parsedValue,
      prefix: prefix ?? parsedValue.prefix,
      suffix: suffix ?? parsedValue.suffix,
    }
  }, [prefix, suffix, value])
  const motionValue = useMotionValue(from)
  const [renderedValue, setRenderedValue] = useState(() => formatValue(from, parsed))

  useMotionValueEvent(motionValue, "change", (latest) => {
    setRenderedValue(formatValue(latest, parsed))
  })

  useEffect(() => {
    if (prefersReducedMotion || !inView || !parsed.shouldAnimate) {
      return
    }

    motionValue.set(from)

    const controls = animate(motionValue, parsed.value, {
      duration,
      delay,
      ease: easePremium,
    })

    return () => {
      controls.stop()
    }
  }, [delay, duration, from, inView, parsed, prefersReducedMotion, motionValue])

  const displayValue = !parsed.shouldAnimate
    ? formatValue(parsed.value, parsed)
    : prefersReducedMotion
    ? formatValue(parsed.value, parsed)
    : inView
      ? renderedValue
      : formatValue(from, parsed)

  return (
    <motion.span ref={counterRef} className={cn(className)}>
      {displayValue}
    </motion.span>
  )
}
