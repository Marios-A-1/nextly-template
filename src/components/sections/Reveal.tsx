"use client"

import type { ReactNode } from "react"
import {
  Reveal as RevealAnimation,
  type RevealAnimationVariant,
} from "@/components/animations/Reveal"
import { Stagger } from "@/components/animations/Stagger"

type RevealVariant = RevealAnimationVariant | "fadeUp" | "scaleIn" | "stagger"
type NonStaggerRevealVariant = Exclude<RevealVariant, "stagger">

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
  variant?: RevealVariant
  as?: RevealTag
  delay?: number
  once?: boolean
  amount?: number
  stagger?: number
  delayChildren?: number
  childVariant?: RevealAnimationVariant
  inherit?: boolean
}

const normalizeVariant = (variant: NonStaggerRevealVariant): RevealAnimationVariant => {
  if (variant === "fadeUp") {
    return "section"
  }

  if (variant === "scaleIn") {
    return "card"
  }

  return variant
}

export function Reveal({
  children,
  className,
  variant = "section",
  as = "div",
  delay = 0,
  once = true,
  amount,
  stagger,
  delayChildren,
  childVariant = "section",
  inherit,
}: RevealProps) {
  if (variant === "stagger") {
    return (
      <Stagger
        as={as as "div" | "section" | "article" | "ul" | "ol" | "li"}
        className={className}
        stagger={stagger}
        delayChildren={delayChildren}
        once={once}
        amount={amount}
        childVariant={childVariant}
      >
        {children}
      </Stagger>
    )
  }

  return (
    <RevealAnimation
      variant={normalizeVariant(variant)}
      className={className}
      as={as as RevealTag}
      delay={delay}
      once={once}
      amount={amount}
      inherit={inherit}
    >
      {children}
    </RevealAnimation>
  )
}
