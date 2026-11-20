import type { Transition, Variants } from "motion/react"

export const easePremium = [0.16, 1, 0.3, 1] as const
export const easeSoft = [0.22, 1, 0.36, 1] as const

export const motionDurations = {
  hero: 1.32,
  heroSupport: 1.12,
  section: 1,
  card: 0.96,
  media: 0.92,
  panel: 0.58,
  hover: 0.46,
  button: 0.46,
  dropdown: 0.58,
  mobileMenu: 0.64,
  faq: 0.44,
  slider: 0.56,
  counter: 3.8,
  staggerDesktop: 0.1,
  staggerMobile: 0.08,
  micro: 0.26,
} as const

export const transitionDefaults = {
  duration: motionDurations.section,
  ease: easePremium,
} as const satisfies Transition

export const transitionSlow = {
  duration: motionDurations.heroSupport,
  ease: easePremium,
} as const satisfies Transition

export const transitionFast = {
  duration: motionDurations.micro,
  ease: easeSoft,
} as const satisfies Transition

export const transitionSlider = {
  duration: motionDurations.slider,
  ease: easeSoft,
} as const satisfies Transition

export const hoverTransition = {
  duration: motionDurations.hover,
  ease: easeSoft,
} as const satisfies Transition

export const viewport = {
  once: true,
  amount: 0.16,
  margin: "0px 0px -12% 0px",
} as const

export type RevealPreset =
  | "fadeIn"
  | "section"
  | "card"
  | "media"
  | "panel"
  | "hero"
  | "heroSupport"

type RevealDefinition = {
  hidden: {
    opacity: number
    y?: number
    scale?: number
    filter?: string
  }
  transition: Transition
}

const revealDefinitions: Record<RevealPreset, RevealDefinition> = {
  fadeIn: {
    hidden: {
      opacity: 0,
    },
    transition: transitionDefaults,
  },
  section: {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(3px)",
    },
    transition: transitionDefaults,
  },
  card: {
    hidden: {
      opacity: 0,
      y: 18,
      scale: 0.985,
      filter: "blur(3px)",
    },
    transition: {
      duration: motionDurations.card,
      ease: easePremium,
    },
  },
  media: {
    hidden: {
      opacity: 0,
      y: 16,
      scale: 0.99,
      filter: "blur(3px)",
    },
    transition: {
      duration: motionDurations.media,
      ease: easePremium,
    },
  },
  panel: {
    hidden: {
      opacity: 0,
      y: 16,
      scale: 0.99,
      filter: "blur(3px)",
    },
    transition: {
      duration: motionDurations.panel,
      ease: easeSoft,
    },
  },
  hero: {
    hidden: {
      opacity: 0,
      y: 28,
      filter: "blur(4px)",
    },
    transition: {
      duration: motionDurations.hero,
      ease: easePremium,
    },
  },
  heroSupport: {
    hidden: {
      opacity: 0,
      y: 24,
      filter: "blur(4px)",
    },
    transition: {
      duration: motionDurations.heroSupport,
      ease: easePremium,
    },
  },
}

export const createRevealVariants = (preset: RevealPreset): Variants => {
  const definition = revealDefinitions[preset]

  return {
    hidden: definition.hidden,
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: definition.transition,
    },
  }
}

export const revealVariants: Record<RevealPreset, Variants> = {
  fadeIn: createRevealVariants("fadeIn"),
  section: createRevealVariants("section"),
  card: createRevealVariants("card"),
  media: createRevealVariants("media"),
  panel: createRevealVariants("panel"),
  hero: createRevealVariants("hero"),
  heroSupport: createRevealVariants("heroSupport"),
}

export const fadeIn = revealVariants.fadeIn
export const fadeUp = revealVariants.section
export const scaleIn = revealVariants.card
export const staggerItem = revealVariants.card

type StaggerOptions = {
  staggerChildren?: number
  delayChildren?: number
  duration?: number
  ease?: typeof easePremium | typeof easeSoft
}

export const createStaggerContainer = ({
  staggerChildren = motionDurations.staggerDesktop,
  delayChildren = motionDurations.staggerMobile,
  duration = motionDurations.section,
  ease = easePremium,
}: StaggerOptions = {}): Variants => ({
  hidden: {
    opacity: 1,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
      duration,
      ease,
    },
  },
})

export const staggerContainer = createStaggerContainer()

export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: motionDurations.dropdown,
      ease: easeSoft,
    },
  },
  exit: {
    opacity: 0,
    y: 14,
    scale: 0.99,
    filter: "blur(5px)",
    transition: {
      duration: 0.42,
      ease: easeSoft,
    },
  },
}

export const headerBubbleVariants: Variants = {
  hidden: {
    opacity: 0,
    width: 56,
    y: -26,
    scale: 0.96,
    filter: "blur(4px)",
  },
  show: (width: number) => ({
    opacity: 1,
    width,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      opacity: {
        duration: 0.24,
        ease: easeSoft,
      },
      y: {
        duration: 0.42,
        ease: easeSoft,
      },
      scale: {
        duration: 0.42,
        ease: easeSoft,
      },
      filter: {
        duration: 0.34,
        ease: easeSoft,
      },
      width: {
        delay: 0.18,
        duration: 0.78,
        ease: easeSoft,
      },
    },
  }),
  exit: {
    opacity: 0,
    width: 56,
    y: -22,
    scale: 0.96,
    filter: "blur(4px)",
    transition: {
      width: {
        delay: 0.12,
        duration: 0.58,
        ease: easeSoft,
      },
      opacity: {
        delay: 0.56,
        duration: 0.18,
        ease: easeSoft,
      },
      y: {
        delay: 0.48,
        duration: 0.26,
        ease: easeSoft,
      },
      scale: {
        delay: 0.48,
        duration: 0.26,
        ease: easeSoft,
      },
      filter: {
        delay: 0.5,
        duration: 0.2,
        ease: easeSoft,
      },
    },
  },
}

export const headerBubbleControlsVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 0,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.58,
      duration: 0.32,
      ease: easeSoft,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.14,
      ease: easeSoft,
    },
  },
}

export const menuOverlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.32,
      ease: easeSoft,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.26,
      ease: easeSoft,
    },
  },
}

export const mobileMenuPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 34,
    scale: 0.985,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: motionDurations.mobileMenu,
      ease: easeSoft,
    },
  },
  exit: {
    opacity: 0,
    x: 24,
    scale: 0.99,
    filter: "blur(6px)",
    transition: {
      duration: 0.42,
      ease: easeSoft,
    },
  },
}

export const menuListVariants = createStaggerContainer({
  staggerChildren: motionDurations.staggerMobile,
  delayChildren: 0.04,
  duration: motionDurations.mobileMenu,
  ease: easeSoft,
})

export const menuItemVariants = revealVariants.panel

export const faqContentVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
  },
  show: {
    height: "auto",
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      height: { duration: motionDurations.faq, ease: easeSoft },
      opacity: { duration: 0.32, ease: easeSoft },
      y: { duration: 0.34, ease: easeSoft },
      filter: { duration: 0.34, ease: easeSoft },
    },
  },
}

export const buttonSurfaceVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: {
      duration: motionDurations.button,
      ease: easeSoft,
    },
  },
  tap: {
    y: -1,
    scale: 0.995,
    transition: {
      duration: 0.18,
      ease: easeSoft,
    },
  },
}

export const buttonArrowVariants: Variants = {
  rest: {
    x: 0,
    y: 0,
    opacity: 1,
  },
  hover: {
    x: 14,
    y: -14,
    opacity: 0,
    transition: {
      duration: motionDurations.button,
      ease: easeSoft,
    },
  },
}

export const buttonArrowIncomingVariants: Variants = {
  rest: {
    x: -14,
    y: 14,
    opacity: 0,
  },
  hover: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: motionDurations.button,
      ease: easeSoft,
    },
  },
}

export const listItemVariants = (index = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 14,
    filter: "blur(2px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionDurations.card,
      delay: motionDurations.staggerMobile * index,
      ease: easePremium,
    },
  },
})
