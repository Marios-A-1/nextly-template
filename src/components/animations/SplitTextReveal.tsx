"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import { useInView } from "motion/react"
import { useEffect, useMemo, useRef, type Ref } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
import { motionDurations } from "@/lib/animations"

type SplitMode = "words" | "chars" | "words-chars"

type GSAPAnimation = {
  kill: () => void
}

type TextTagName = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

type SplitTextRevealProps = {
  text: string
  as?: TextTagName
  className?: string
  highlight?: string
  highlightClassName?: string
  mode?: SplitMode
  delay?: number
  stagger?: number
  duration?: number
}

type SplitTextToken =
  | { kind: "space"; value: string; key: string }
  | { kind: "word"; value: string; key: string }
  | { kind: "words-chars"; chars: string[]; key: string }
  | { kind: "char"; value: string; key: string }

const getTokens = (text: string, mode: SplitMode): SplitTextToken[] => {
  const segments = text.split(/(\s+)/).filter((value) => value.length > 0)

  if (mode === "chars") {
    return text.split("").map((char, index) => ({
      kind: /\s/.test(char) ? "space" : "char",
      value: char,
      key: `char-${index}`,
    }))
  }

  if (mode === "words") {
    return segments.map((segment, index) =>
      /\s+/.test(segment)
        ? {
            kind: "space",
            value: segment,
            key: `space-${index}`,
          }
        : {
            kind: "word",
            value: segment,
            key: `word-${index}`,
          }
    )
  }

  return segments.map((segment, index) =>
    /\s+/.test(segment)
      ? {
          kind: "space",
          value: segment,
          key: `space-${index}`,
        }
      : {
          kind: "words-chars",
          chars: segment.split(""),
          key: `words-chars-${index}`,
        }
  )
}

const maskInlineWrapperClass =
  "inline-block overflow-hidden align-middle [line-height:inherit] pt-[0.12em] pb-[0.16em] -mt-[0.12em] -mb-[0.16em]"
const tokenInlineClass = "inline-block [line-height:inherit]"
const hiddenInlineDefault = { opacity: 0, filter: "blur(4px)" }

const setTokenStyle = (
  token: HTMLSpanElement | null,
  style: { opacity: number; transform: string; filter: string }
) => {
  if (!token) {
    return
  }
  token.style.opacity = style.opacity.toString()
  token.style.transform = style.transform
  token.style.filter = style.filter
}

export function SplitTextReveal({
  text,
  as = "p",
  className,
  highlight,
  highlightClassName = "gradient-word",
  mode = "words",
  delay = 0,
  stagger = motionDurations.staggerMobile + 0.005,
  duration = motionDurations.hero,
}: SplitTextRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLElement | null>(null)
  const tokens = useMemo(() => getTokens(text, mode), [mode, text])
  const inView = useInView(containerRef, { once: true, amount: 0.25 })
  const tokenRefs = useRef<(HTMLSpanElement | null)[]>([])
  const activeAnimations = useRef<GSAPAnimation[]>([])

  useEffect(() => {
    tokenRefs.current = []
  }, [tokens])

  const setVisible = () => {
    for (const tokenRef of tokenRefs.current) {
      setTokenStyle(tokenRef, {
        opacity: 1,
        transform: "translateY(0px)",
        filter: "blur(0px)",
      })
    }
  }

  useEffect(() => {
    if (prefersReducedMotion || !inView) {
      setVisible()
      return
    }

    const targets = tokenRefs.current.filter((ref): ref is HTMLSpanElement => ref !== null)
    if (targets.length === 0) {
      return
    }

    let isActive = true

    try {
      gsap.set(targets, {
        autoAlpha: 0,
        yPercent: 22,
        filter: "blur(4px)",
      })
      activeAnimations.current.push(
        gsap.to(targets, {
          autoAlpha: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration,
          delay,
          stagger,
          ease: "power4.out",
        })
      )
    } catch {
      if (isActive) {
        setVisible()
      }
    }

    return () => {
      isActive = false
      for (const animation of activeAnimations.current) {
        animation.kill()
      }
      activeAnimations.current = []
      setVisible()
    }
  }, [duration, inView, delay, prefersReducedMotion, stagger, tokens])

  const TextTag = as

  const renderReducedText = () => {
    if (!highlight || !text.includes(highlight)) {
      return text
    }

    const [before, ...afterParts] = text.split(highlight)

    return (
      <>
        {before}
        <span className={highlightClassName}>{highlight}</span>
        {afterParts.join(highlight)}
      </>
    )
  }

  const registerTokenRef = (index: number) => (el: HTMLSpanElement | null) => {
    tokenRefs.current[index] = el
  }

  if (prefersReducedMotion) {
    const Tag = TextTag as TextTagName
    return <Tag className={cn(className)}>{renderReducedText()}</Tag>
  }

  if (mode === "words-chars") {
    let tokenIndex = 0
    const Tag = TextTag as TextTagName

    return (
        <Tag ref={containerRef as Ref<HTMLHeadingElement>} className={cn(className)}>
          {tokens.map((token) => {
            if (token.kind === "space") {
              return <span key={token.key}>{token.value}</span>
            }

            if (token.kind === "word" || token.kind === "char") {
              return null
            }

            return (
              <span key={token.key} className="inline-flex" style={{ verticalAlign: "baseline" }}>
                {token.chars.map((character: string) => {
                  const currentIndex = tokenIndex++
                  return (
                    <span
                      key={`${token.key}-${currentIndex}`}
                      className={maskInlineWrapperClass}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <span
                        ref={registerTokenRef(currentIndex)}
                        className={tokenInlineClass}
                        style={hiddenInlineDefault}
                      >
                        {character}
                      </span>
                    </span>
                  )
                })}
              </span>
            )
          })}
        </Tag>
    )
  }

  const Tag = TextTag as TextTagName
  let tokenIndex = 0

  return (
      <Tag ref={containerRef as Ref<HTMLHeadingElement>} className={cn(className)}>
        {tokens.map((token) => {
          if (token.kind === "space") {
            return <span key={token.key}>{token.value}</span>
          }

          if (token.kind === "words-chars") {
            return null
          }

          return (
            <span
              key={token.key}
              className={maskInlineWrapperClass}
              style={{ verticalAlign: "baseline" }}
            >
              <span
                ref={registerTokenRef(tokenIndex++)}
                className={cn(tokenInlineClass, highlight === token.value && highlightClassName)}
                style={hiddenInlineDefault}
              >
                {token.value}
              </span>
            </span>
          )
        })}
      </Tag>
  )
}
