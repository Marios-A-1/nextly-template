"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { dropdownVariants, menuItemVariants, menuListVariants } from "@/lib/animations"
import { cn } from "@/lib/utils"
import type { NavItem, Service } from "@/types/content"

type ServicesDropdownProps = {
  item: NavItem
  services: Service[]
  labels: {
    allServicesTitle: string
    allServicesDescription: string
  }
}

function normalizePathname(pathname: string) {
  if (pathname === "") {
    return "/"
  }

  const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname

  return withoutTrailingSlash || "/"
}

function isActivePath(pathname: string, href: string) {
  const currentPathname = normalizePathname(pathname)
  const targetPathname = normalizePathname(href)

  if (targetPathname === "/") {
    return currentPathname === "/"
  }

  return currentPathname === targetPathname || currentPathname.startsWith(`${targetPathname}/`)
}

export function ServicesDropdown({ item, services, labels }: ServicesDropdownProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const pathname = usePathname()
  const active = isActivePath(pathname, item.href)
  const rootRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
      clearCloseTimer()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative flex h-full items-center"
      onMouseEnter={() => {
        clearCloseTimer()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        className={cn(
          "group/services-trigger relative inline-flex h-full cursor-pointer items-center gap-1.5 border-l border-white/0 px-3 text-sm font-semibold transition-[color] xl:px-4 duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          active || open ? "text-white" : "text-white/82",
        )}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{item.label}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "rotate-180" : ""}`} />
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-px left-5 right-5 h-[3px] origin-center rounded-full bg-white transition-transform duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            active || open
              ? "scale-x-100"
              : "scale-x-0 group-hover/services-trigger:scale-x-100 group-focus-visible/services-trigger:scale-x-100",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            id={panelId}
            data-services-dropdown-panel
            className="absolute left-1/2 top-full z-50 w-[min(680px,calc(100vw-2rem))] origin-top -translate-x-1/2 translate-y-4 overflow-hidden rounded-[0.85rem] border border-white/15 bg-[#161411] p-2 text-white shadow-[0_24px_70px_rgba(0,32,36,0.28)] ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-3 py-2.5">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/56">
                {item.label}
              </span>
              <span className="h-px w-20 shrink-0 rounded-full bg-white/18" aria-hidden="true" />
            </div>

            <motion.div className="divide-y divide-white/10" variants={menuListVariants}>
              <motion.div variants={menuItemVariants}>
                <Link
                  data-services-dropdown-row
                  className="group/dropdown-row grid min-h-[76px] gap-3 rounded-[0.65rem] bg-white px-4 py-3 text-[#201b17] transition-[background-color,color,translate] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0.5 hover:bg-[#f9f5ed] focus-visible:translate-x-0.5 focus-visible:bg-[#f9f5ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:grid-cols-[minmax(12rem,0.72fr)_minmax(0,1fr)_2.5rem] sm:items-center"
                  href="/epemvaseis"
                  onClick={() => setOpen(false)}
                >
                  <span className="block text-sm font-semibold text-[#201b17]">
                    {labels.allServicesTitle}
                  </span>
                  <span className="block text-xs leading-5 text-[#516866]">
                    {labels.allServicesDescription}
                  </span>
                  <span
                    className="grid size-10 place-items-center rounded-full bg-[#282018] text-white transition-[background-color,color,rotate,scale] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/dropdown-row:rotate-[-45deg] group-hover/dropdown-row:scale-105 group-focus-visible/dropdown-row:rotate-[-45deg] group-focus-visible/dropdown-row:scale-105 sm:justify-self-end"
                    aria-hidden="true"
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </motion.div>
              {services.slice(0, 6).map((service) => (
                <motion.div variants={menuItemVariants} key={service.slug}>
                  <Link
                    data-services-dropdown-row
                    className="group/dropdown-row grid min-h-[76px] gap-3 rounded-[0.65rem] px-4 py-3 text-white transition-[background-color,color,translate] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0.5 hover:bg-white/8 focus-visible:translate-x-0.5 focus-visible:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 sm:grid-cols-[minmax(12rem,0.72fr)_minmax(0,1fr)_2.5rem] sm:items-center"
                    href={`/epemvaseis/${service.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="block text-sm font-semibold text-white">
                      {service.shortTitle ?? service.title}
                    </span>
                    <span className="line-clamp-2 block text-xs leading-5 text-white/68">
                      {service.summary}
                    </span>
                    <span
                      className="grid size-10 place-items-center rounded-full bg-white/14 text-white transition-[background-color,color,rotate,scale] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/dropdown-row:rotate-[-45deg] group-hover/dropdown-row:scale-105 group-hover/dropdown-row:bg-white group-hover/dropdown-row:text-[#282018] group-focus-visible/dropdown-row:rotate-[-45deg] group-focus-visible/dropdown-row:scale-105 group-focus-visible/dropdown-row:bg-white group-focus-visible/dropdown-row:text-[#282018] sm:justify-self-end"
                      aria-hidden="true"
                    >
                      <ArrowRight className="size-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
