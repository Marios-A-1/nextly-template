"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { ChevronRight, Menu, Phone, X } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal"
import type { NavItem, Service, SiteConfig } from "@/types/content"
import {
  menuItemVariants,
  menuListVariants,
  menuOverlayVariants,
  mobileMenuPanelVariants,
} from "@/lib/animations"

type MobileMenuProps = {
  items: NavItem[]
  services: Service[]
  site: SiteConfig
  labels: {
    toggle: string
    close: string
    nav: string
    navLabel: string
    popular: string
    appointment: string
  }
}

export function MobileMenu({
  items,
  labels,
  site,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const portalTarget = typeof document === "undefined" ? null : document.body

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const focusedTrigger = triggerRef.current

    const getFocusableElements = (): HTMLElement[] => {
      if (!panelRef.current) {
        return []
      }

      const selector =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      const all = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(selector),
      ).filter((element) => element.tabIndex >= 0)

      return all
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        return
      }

      if (event.key !== "Tab") {
        return
      }

      const focusableElements = getFocusableElements()
      const firstElement = focusableElements[0] ?? closeButtonRef.current
      const lastElement = focusableElements[focusableElements.length - 1] ?? firstElement
      const activeElement = document.activeElement

      if (!panelRef.current || !activeElement) {
        event.preventDefault()
        firstElement?.focus()
        return
      }

      if (!panelRef.current.contains(activeElement)) {
        event.preventDefault()
        firstElement?.focus()
        return
      }

      if (focusableElements.length === 0) {
        event.preventDefault()
        firstElement?.focus()
        return
      }

      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
        return
      }

      if (activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
      if (!closeButtonRef.current) {
        getFocusableElements()[0]?.focus()
      }
    })

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.removeEventListener("keydown", onKeyDown)
      focusedTrigger?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/0 bg-none text-white shadow-sm transition-[transform,box-shadow] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-px"
        aria-expanded={open}
        aria-label={labels.toggle}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {portalTarget
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  className="fixed inset-0 z-[80] lg:hidden"
                  variants={menuOverlayVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <button
                    type="button"
                    aria-label={labels.close}
                    className="absolute inset-0 bg-espresso/24 backdrop-blur-[3px]"
                    onClick={() => setOpen(false)}
                  />
                  <motion.aside
                    ref={panelRef}
                    role="dialog"
                    aria-label={labels.nav}
                    aria-modal="true"
                    className="absolute inset-y-0 right-0 flex w-[min(calc(100vw-1rem),390px)] flex-col overflow-hidden border-l border-white/70 bg-[#fffcf6] pb-[env(safe-area-inset-bottom)] text-foreground shadow-[0_30px_90px_rgba(40,32,24,0.26)]"
                    variants={mobileMenuPanelVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <div className="shrink-0 border-b border-primary/10 px-5 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top))] sm:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          href="/"
                          className="group flex min-w-0 items-center"
                          onClick={() => setOpen(false)}
                        >
                          {site.logoImage ? (
                            <span className="grid h-12 w-32 place-items-center">
                              <Image
                                src={site.logoImage.src}
                                alt={site.logoImage.alt}
                                width={site.logoImage.width}
                                height={site.logoImage.height}
                                className="h-auto w-full"
                              />
                            </span>
                          ) : (
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-espresso text-base font-semibold text-white shadow-[0_14px_34px_rgba(40,32,24,0.18)]">
                              {site.logoText.trim().slice(0, 1) || "M"}
                            </span>
                          )}
                        </Link>
                        <button
                          type="button"
                          ref={closeButtonRef}
                          className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/10 bg-white text-[#372a1e] shadow-sm transition-[transform,background-color,box-shadow] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-px hover:bg-ivory hover:shadow-md"
                          aria-label={labels.close}
                          onClick={() => setOpen(false)}
                        >
                          <X className="size-4 shrink-0" />
                        </button>
                      </div>
                    </div>
                    <motion.div
                      className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6"
                      variants={menuListVariants}
                      initial="hidden"
                      animate="show"
                    >
                      <motion.nav
                        data-mobile-menu-nav
                        className="divide-y divide-primary/10 border-y border-primary/10"
                        aria-label={labels.navLabel}
                        variants={menuListVariants}
                        initial="hidden"
                        animate="show"
                      >
                        {items.map((item) => (
                          <motion.div
                            variants={menuItemVariants}
                            key={item.href}
                          >
                            <Link
                              className="flex min-h-[60px] min-w-0 items-center justify-between gap-3 px-2 py-4 text-[1rem] font-medium text-foreground transition-[color,transform] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-primary motion-safe:hover:-translate-y-[0.5px]"
                              href={item.href}
                              onClick={() => setOpen(false)}
                            >
                              <span className="min-w-0 flex-1 break-words">
                                {item.label}
                              </span>
                              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                            </Link>
                          </motion.div>
                        ))}
                      </motion.nav>

                      {/* {popularServices.length > 0 ? (
                        <motion.div
                          className="mt-6 border-y border-primary/10"
                          variants={menuListVariants}
                          initial="hidden"
                          animate="show"
                        >
                          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {labels.popular}
                          </p>
                          <div className="divide-y divide-primary/10">
                            {popularServices.map((service) => (
                              <motion.div variants={menuItemVariants} key={service.slug}>
                                <Link
                                  className="flex min-h-[50px] min-w-0 items-center justify-between gap-3 px-1 py-3 text-sm font-medium text-foreground transition-[color,transform] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-primary motion-safe:hover:-translate-y-[0.5px]"
                                  href={`/epemvaseis/${service.slug}`}
                                  onClick={() => setOpen(false)}
                                >
                                  <span className="min-w-0 flex-1 break-words">
                                    {service.title}
                                  </span>
                                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ) : null} */}
                    </motion.div>
                    <motion.div
                      className="shrink-0 border-t border-primary/10 bg-[#fffcf6]/95 px-5 py-4 shadow-[0_-18px_50px_rgba(40,32,24,0.08)] backdrop-blur sm:px-6"
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="show"
                    >
                      <ContactChoiceButton
                        className="min-h-12 w-full flex-nowrap justify-between px-3 py-2 text-center leading-tight"
                        getSourceElement={() => triggerRef.current}
                        onClick={() => setOpen(false)}
                      >
                        <span
                          data-mobile-menu-cta
                          className="inline-flex min-w-0 flex-1 flex-nowrap items-center justify-center gap-2"
                        >
                          <Phone className="size-4 shrink-0" />
                          <span className="min-w-0 text-nowrap">
                            {labels.appointment}
                          </span>
                        </span>
                      </ContactChoiceButton>
                    </motion.div>
                  </motion.aside>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            portalTarget,
          )
        : null}
    </>
  )
}
