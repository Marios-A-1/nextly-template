import { Phone } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { MobileMenu } from "@/components/layout/MobileMenu"
import { ServicesDropdown } from "@/components/layout/ServicesDropdown"
import { HeaderRevealBubble } from "@/components/layout/HeaderRevealBubble"
import { HeaderNavLink } from "@/components/layout/HeaderNavLink"
import { Reveal } from "@/components/sections/Reveal"
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal"
import type { NavItem, Service, SiteConfig } from "@/types/content"

type HeaderProps = {
  navigation: NavItem[]
  services: Service[]
  site: SiteConfig
  labels: {
    homeAria: string
    primaryNav: string
    appointment: string
    scrollToTop: string
    allServicesTitle: string
    allServicesDescription: string
  }
  mobileLabels: {
    toggle: string
    close: string
    nav: string
    navLabel: string
    popular: string
    appointment: string
  }
}

export function Header({
  navigation,
  services,
  site,
  labels,
  mobileLabels,

}: HeaderProps) {
  const logoInitial = site.logoText.trim().slice(0, 1) || "M"
  const phoneHref = site.phoneHref ?? site.contact.phone.replace(/[^\d+]/g, "")
  const normalizedPhoneHref = phoneHref.startsWith("tel:")
    ? phoneHref
    : `tel:${phoneHref}`

  return (
    <>
      <header
        data-site-header
        className="relative z-40 border-b border-white/60 bg-[#282018]/15 text-white backdrop-blur-xl"
      >
        <div className="site-container flex h-[64px] items-center justify-between gap-4 sm:h-[68px] lg:gap-6">
          <Reveal as="div" variant="panel" className="flex items-center gap-3">
            <Link
              className="group flex items-center gap-3"
              href="/"
              aria-label={labels.homeAria}
            >
              {site.logoImage ? (
                <span className="grid h-10 w-11 place-items-center">
                  <Image
                    src={site.logoImage.src}
                    alt={site.logoImage.alt}
                    width={site.logoImage.width}
                    height={site.logoImage.height}
                    className="h-full w-full object-contain"
                    priority
                  />
                </span>
              ) : (
                <span className="grid size-9 place-items-center rounded-full bg-white text-base font-semibold text-[#282018] shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
                  {logoInitial}
                </span>
              )}
              <span className="hidden leading-tight sm:block">
                <span className="block text-base font-semibold tracking-tight text-white">
                  {site.logoText}
                </span>
                <span className="block text-[11px] text-white/62">
                  {site.logoByline}
                </span>
              </span>
            </Link>
          </Reveal>

          <Reveal variant="panel" delay={0.08} className="hidden h-full lg:block">
            <nav
              className="hidden h-full items-center gap-0 lg:flex"
              aria-label={labels.primaryNav}
            >
              {navigation.map((item) =>
                item.id === "services" ? (
                  <ServicesDropdown
                    item={item}
                    labels={{
                      allServicesTitle: labels.allServicesTitle,
                      allServicesDescription: labels.allServicesDescription,
                    }}
                    services={services}
                    key={item.href}
                  />
                ) : (
                  <HeaderNavLink item={item} key={item.href} />
                ),
              )}
            </nav>
          </Reveal>

          <Reveal as="div" variant="panel" delay={0.14} className="hidden items-center gap-3 lg:flex">
            <a
              className="hidden shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-white/82 2xl:inline-flex"
              href={normalizedPhoneHref}
            >
              <Phone className="size-4 text-white" />
              {site.contact.phone}
            </a>
            <ContactChoiceButton variant="light" className="whitespace-nowrap px-4">
              {labels.appointment}
            </ContactChoiceButton>
          </Reveal>

          <div className="lg:hidden">
            <Reveal variant="panel" delay={0.1}>
              <MobileMenu
                items={navigation}
                labels={mobileLabels}
                services={services}
                site={site}
              />
            </Reveal>
          </div>
        </div>
      </header>
      <HeaderRevealBubble
        appointmentLabel={labels.appointment}
        scrollToTopLabel={labels.scrollToTop}
      />
    </>
  )
}
