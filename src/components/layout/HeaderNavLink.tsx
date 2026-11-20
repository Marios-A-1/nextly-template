"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/content"

type HeaderNavLinkProps = {
  item: NavItem
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

export function HeaderNavLink({ item }: HeaderNavLinkProps) {
  const pathname = usePathname()
  const active = isActivePath(pathname, item.href)

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/nav-link relative inline-flex h-full items-center border-l border-white/0 px-3 text-sm font-semibold transition-[color] xl:px-4 duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        active ? "text-white" : "text-white/82",
      )}
      href={item.href}
    >
      <span>{item.label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-px left-1 right-1 h-[2px] origin-center rounded-full bg-white transition-transform duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "scale-x-120" : "scale-x-0 group-hover/nav-link:scale-x-120 group-focus-visible/nav-link:scale-x-100",
        )}
      />
    </Link>
  )
}
