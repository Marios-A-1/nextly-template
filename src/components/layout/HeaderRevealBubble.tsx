"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowUp } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { useContactChoice } from "@/components/common/ContactChoiceModal"
import {
  headerBubbleControlsVariants,
  headerBubbleVariants,
} from "@/lib/animations"
import { scrollToTopEventName } from "@/lib/smoothScrollEvents"

type HeaderRevealBubbleProps = {
  appointmentLabel: string
  scrollToTopLabel: string
}

export function HeaderRevealBubble({
  appointmentLabel,
  scrollToTopLabel,
}: HeaderRevealBubbleProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [bubbleWidth, setBubbleWidth] = useState(390)
  const shouldReduceMotion = useReducedMotion()
  const { openContactChoice } = useContactChoice()

  useEffect(() => {
    const updateBubbleWidth = () => {
      setBubbleWidth(Math.min(window.innerWidth * 0.94, 390))
    }

    updateBubbleWidth()
    window.addEventListener("resize", updateBubbleWidth)

    return () => {
      window.removeEventListener("resize", updateBubbleWidth)
    }
  }, [])

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]")

    if (!header || !("IntersectionObserver" in window)) {
      const onScroll = () => {
        setIsVisible(window.scrollY > 96)
      }

      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true })

      return () => {
        window.removeEventListener("scroll", onScroll)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting)
    })

    observer.observe(header)
    return () => {
      observer.disconnect()
    }
  }, [])

  const onScrollToTop = () => {
    const isHandledBySmoothScroll = !window.dispatchEvent(
      new CustomEvent(scrollToTopEventName, { cancelable: true }),
    )

    if (isHandledBySmoothScroll) {
      return
    }

    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    })
  }

  const bubbleMotionProps = shouldReduceMotion
    ? {
        initial: false,
        animate: {
          opacity: 1,
          width: bubbleWidth,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
        exit: { opacity: 0 },
        transition: { duration: 0.01 },
      }
    : {
        initial: "hidden",
        animate: "show",
        exit: "exit",
        custom: bubbleWidth,
        variants: headerBubbleVariants,
      }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          data-header-reveal-bubble
          className="fixed left-1/2 top-2 z-[30] h-14 -translate-x-1/2 overflow-hidden rounded-full border border-white/45 bg-espresso/72 p-1.5 shadow-[0_18px_54px_rgba(40,32,24,0.22)] backdrop-blur-xl"
          role="presentation"
          {...bubbleMotionProps}
        >
          <div className="flex h-full items-center gap-2">
            <motion.button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-white/70 bg-white text-[#282018] shadow-[0_10px_24px_rgba(40,32,24,0.12)] transition-[background-color,transform] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              onClick={onScrollToTop}
              aria-label={scrollToTopLabel}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="show"
              exit="exit"
              variants={headerBubbleControlsVariants}
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ y: 0, scale: 0.98 }}
            >
              <ArrowUp className="size-4" />
            </motion.button>
            <motion.div
              className="flex min-w-0 grow"
              initial={shouldReduceMotion ? false : "hidden"}
              animate="show"
              exit="exit"
              variants={headerBubbleControlsVariants}
            >
              <button
                type="button"
                className="group/bubble-cta grid min-h-11 w-full min-w-0 grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-2 overflow-hidden rounded-full bg-white py-1.5 pl-4 pr-1.5 text-center text-sm font-semibold leading-tight text-[#201b17] shadow-[0_12px_34px_rgba(40,32,24,0.14)] transition-[background-color,box-shadow] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                onClick={(event) => openContactChoice(event.currentTarget)}
              >
                <span aria-hidden="true" />
                <span className="min-w-0 truncate">{appointmentLabel}</span>
                {/* <span
                  className="grid size-8 place-items-center justify-self-center rounded-full bg-espresso text-gold"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="size-4" />
                </span> */}
              </button>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
