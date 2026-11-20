"use client"

import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react"
import { Mail, MessageCircle, Phone, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ContactForm } from "@/components/sections/ContactForm"
import { cn } from "@/lib/utils"
import type { AppMessages } from "@/content/localized"
import type { SiteConfig } from "@/types/content"
import { AnimatedButton } from "@/components/ui/AnimatedButton"

type ContactChoiceLabels = AppMessages["layout"]["contactChoice"]

type ContactChoiceContextValue = {
  openContactChoice: (source?: HTMLElement | null, showForm?: boolean) => void
}

type StoredRect = {
  centerX: number
  centerY: number
  width: number
  height: number
}

type ContactChoiceProviderProps = {
  site: SiteConfig
  labels: ContactChoiceLabels
  children: ReactNode
}

type ContactChoiceButtonProps = {
  children: ReactNode
  className?: string
  getSourceElement?: () => HTMLElement | null
  variant?: "primary" | "light" | "outline"
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  "aria-label"?: string
}

const ContactChoiceContext = createContext<ContactChoiceContextValue | null>(null)
const modalSpring = { type: "spring" as const, duration: 0.5, bounce: 0 }
const contentSpring = { type: "spring" as const, duration: 0.42, bounce: 0 }

function sanitizePhoneHref(site: SiteConfig) {
  const phone = site.phoneHref ?? site.contact.phone.replace(/[^\d+]/g, "")
  return phone.startsWith("tel:") ? phone : `tel:${phone}`
}

function getStoredRect(source?: HTMLElement | null): StoredRect | null {
  if (!source) {
    return null
  }

  const rect = source.getBoundingClientRect()

  return {
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    width: rect.width,
    height: rect.height,
  }
}

export function ContactChoiceProvider({
  site,
  labels,
  children,
}: ContactChoiceProviderProps) {
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [originRect, setOriginRect] = useState<StoredRect | null>(null)
  const sourceRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const phoneHref = sanitizePhoneHref(site)

  const openContactChoice = useCallback((source?: HTMLElement | null, startWithForm = false) => {
    sourceRef.current = source ?? null
    setOriginRect(getStoredRect(source))
    setShowForm(startWithForm)
    setOpen(true)
  }, [])

  const contextValue = useMemo(
    () => ({ openContactChoice }),
    [openContactChoice],
  )

  const viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth
  const viewportHeight = typeof window === "undefined" ? 768 : window.innerHeight
  const isCompactViewport = viewportWidth < 640
  const finalWidth = Math.min(viewportWidth - (isCompactViewport ? 24 : 40), 430)
  const finalHeight = isCompactViewport ? 404 : 372
  const targetCenterY = viewportHeight * 0.5
  const originOffset = originRect
    ? {
        x: originRect.centerX - window.innerWidth / 2 - finalWidth / 2,
        y: originRect.centerY - targetCenterY - finalHeight / 2,
        scaleX: Math.max(0.24, originRect.width / finalWidth),
        scaleY: Math.max(0.16, originRect.height / finalHeight),
      }
    : null

  return (
    <ContactChoiceContext.Provider value={contextValue}>
      {children}
      <button
        type="button"
        aria-label="Αίτημα ραντεβού"
        data-booking-widget
        className="fixed bottom-5 right-5 z-50 grid size-12 place-items-center rounded-full border border-white/40 bg-espresso text-gold shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 sm:bottom-7 sm:right-7 sm:size-14"
        onClick={(event) => openContactChoice(event.currentTarget, true)}
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </button>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open ? (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[90] bg-[#161411]/42 backdrop-blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.24 }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content
                asChild
                forceMount
                onCloseAutoFocus={(event) => {
                  if (!sourceRef.current?.isConnected) {
                    return
                  }

                  event.preventDefault()
                  sourceRef.current.focus()
                }}
              >
                <motion.div
                  className="fixed left-1/2 z-[91] origin-center overflow-hidden rounded-[2rem] bg-white/28 p-1.5 text-[#201b17] shadow-[0_28px_90px_rgba(40,32,24,0.30),0_0_0_1px_rgba(255,255,255,0.62)] outline-none backdrop-blur-2xl"
                  style={{
                    top: "50%",
                    width: finalWidth,
                  }}
                  initial={
                    shouldReduceMotion
                      ? {
                          opacity: 0,
                          x: -finalWidth / 2,
                          y: "-50%",
                        }
                      : {
                          opacity: originRect ? 0.94 : 0,
                          x: originOffset?.x ?? -finalWidth / 2,
                          y: originOffset?.y ?? -finalHeight / 2,
                          scaleX: originOffset?.scaleX ?? 0.94,
                          scaleY: originOffset?.scaleY ?? 0.9,
                          borderRadius: originRect ? 999 : 28,
                          filter: "blur(3px)",
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: -finalWidth / 2,
                    y: "-50%",
                    scaleX: 1,
                    scaleY: 1,
                    borderRadius: 32,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: "-50%",
                    scale: shouldReduceMotion ? 1 : 0.985,
                    filter: shouldReduceMotion ? "blur(0px)" : "blur(3px)",
                  }}
                  transition={shouldReduceMotion ? { duration: 0.01 } : modalSpring}
                >
                  <motion.div
                    className="grid max-h-[calc(100svh-2.25rem)] gap-4 overflow-y-auto rounded-[calc(2rem-0.375rem)] bg-ivory/96 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(40,32,24,0.08)] sm:p-6"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 12, filter: "blur(8px)" }
                    }
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.01 }
                        : { ...contentSpring, delay: 0.12 }
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <DialogPrimitive.Title className="max-w-[17rem] text-balance text-[1.72rem] font-semibold leading-[1.05] tracking-normal text-[#201b17] sm:text-[1.82rem]">
                          {showForm ? "Αίτημα ραντεβού" : labels.title}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="mt-3 max-w-[20rem] text-sm font-semibold leading-6 text-muted-foreground">
                          {showForm ? "Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε μαζί σας." : labels.description}
                        </DialogPrimitive.Description>
                      </div>
                      <DialogPrimitive.Close asChild>
                        <button
                          type="button"
                          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/90 text-[#372a1e] shadow-[0_0_0_1px_rgba(40,32,24,0.08),0_10px_28px_rgba(40,32,24,0.12)] transition-[background-color,box-shadow,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 active:scale-[0.98]"
                          aria-label={labels.closeLabel}
                        >
                          <X className="size-4 stroke-[1.7]" />
                        </button>
                      </DialogPrimitive.Close>
                    </div>

                    {showForm ? <ContactForm /> : (
                    <div className="grid gap-2.5">
                      <a
                        className="group/call grid min-h-[4.35rem] grid-cols-[2.35rem_minmax(0,1fr)] items-center gap-3 rounded-[1.45rem] bg-espresso px-4 py-3 text-white shadow-[0_18px_44px_rgba(40,32,24,0.26),inset_0_1px_1px_rgba(255,255,255,0.16)] transition-[background-color,box-shadow,transform] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-[#3a2b1d] hover:shadow-[0_22px_54px_rgba(40,32,24,0.30),inset_0_1px_1px_rgba(255,255,255,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 active:scale-[0.99]"
                        href={phoneHref}
                      >
                        <span
                          className="grid size-9 place-items-center rounded-full bg-white/12 text-white transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/call:translate-x-0.5 group-hover/call:-translate-y-0.5"
                          aria-hidden="true"
                        >
                          <Phone className="size-4 stroke-[1.7]" />
                        </span>
                        <span className="grid min-w-0 gap-0.5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
                          <span className="min-w-0 text-sm font-semibold leading-5">
                            {labels.callLabel}
                          </span>
                          <span className="min-w-0 text-lg font-semibold leading-6 tracking-normal text-white sm:text-base">
                            {site.contact.phone}
                          </span>
                        </span>
                      </a>
                      {site.contact.email && (
                        <a
                          className="flex min-h-12 items-center gap-3 rounded-full bg-white px-4 text-sm font-semibold"
                          href={`mailto:${site.contact.email}`}
                        >
                          <Mail className="size-4" aria-hidden="true" />
                          {site.contact.email}
                        </a>
                      )}
                      <button
                        className="flex min-h-12 items-center gap-3 rounded-full bg-white px-4 text-left text-sm font-semibold hover:bg-champagne"
                        type="button"
                        onClick={() => setShowForm(true)}
                      >
                        <MessageCircle className="size-4" aria-hidden="true" />
                        {labels.messageLabel}
                      </button>
                    </div>
                    )}
                  </motion.div>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          ) : null}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </ContactChoiceContext.Provider>
  )
}

export function useContactChoice() {
  const context = useContext(ContactChoiceContext)

  if (!context) {
    throw new Error("useContactChoice must be used within ContactChoiceProvider")
  }

  return context
}

export function ContactChoiceButton({
  children,
  className,
  getSourceElement,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: ContactChoiceButtonProps) {
  const { openContactChoice } = useContactChoice()

  return (
    <AnimatedButton
      aria-label={ariaLabel}
      className={cn(className)}
      disabled={disabled}
      onClick={(event) => {
        openContactChoice(getSourceElement?.() ?? event.currentTarget)
        onClick?.(event)
      }}
      type={type}
      variant={variant}
    >
      {children}
    </AnimatedButton>
  )
}
