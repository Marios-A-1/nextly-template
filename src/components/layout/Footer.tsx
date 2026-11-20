import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";
import type { NavItem, SiteConfig } from "@/types/content";

type FooterProps = {
  navigation: NavItem[];
  site: SiteConfig;
  labels: {
    nav: string;
    navigationHeading: string;
    follow: string;
    appointment: string;
    copyright: string;
  };
};

export function Footer({ navigation, site, labels }: FooterProps) {
  const logoInitial = site.logoText.trim().slice(0, 1) || "M";
  const phoneHref = site.phoneHref ?? site.contact.phone.replace(/[^\d+]/g, "");
  const normalizedPhoneHref = phoneHref.startsWith("tel:")
    ? phoneHref
    : `tel:${phoneHref}`;

  return (
    <footer className="border-t-4 border-[#2b2219] bg-[#fbf1e6] text-[#201b17]">
      <div className="site-container py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Link className="inline-flex items-center gap-3" href="/">
            {site.logoImage ? (
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white p-2 shadow-[0_12px_32px_rgba(40,32,24,0.12)]">
                <Image
                  src={site.logoImage.src}
                  alt={site.logoImage.alt}
                  width={site.logoImage.width}
                  height={site.logoImage.height}
                  className="h-full w-full object-contain"
                />
              </span>
            ) : (
              <span className="grid size-10 place-items-center rounded-full bg-espresso text-sm font-bold text-white">
                {logoInitial}
              </span>
            )}
            <span className="text-xl font-semibold tracking-normal sm:text-2xl">
              {site.logoText}
            </span>
          </Link>

          <div className="space-y-4 break-words text-left text-xl font-semibold leading-tight tracking-normal sm:text-4xl lg:text-right lg:text-5xl">
            <a
              className="flex min-h-11 min-w-0 items-center gap-3 transition-[color] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-bronze lg:justify-end"
              href={normalizedPhoneHref}
            >
              <Phone className="size-6 shrink-0 sm:size-7" />
              <span className="min-w-0">{site.contact.phone}</span>
            </a>
            {site.contact.email ? (
              <a
                className="flex min-h-11 min-w-0 items-center gap-3 transition-[color] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-bronze lg:justify-end"
                href={`mailto:${site.contact.email}`}
              >
                <Mail className="size-6 shrink-0 sm:size-7" />
                <span className="min-w-0 break-all">{site.contact.email}</span>
              </a>
            ) : null}
          </div>
        </div>

        <Separator className="my-10 bg-[#201b17]/20 sm:my-12" />

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr] lg:gap-16">
          <div className="max-w-sm space-y-8">
            <p className="text-lg font-medium leading-relaxed text-[#201b17]">
              {site.shortIntro}
            </p>
            <ContactChoiceButton
              className="h-16 border-[#7a6449]/50 bg-transparent px-7 text-base text-[#201b17] shadow-none hover:border-[#2b2219] hover:bg-white/70"
              variant="outline"
            >
              {labels.appointment}
            </ContactChoiceButton>
          </div>

          <nav className="space-y-5" aria-label={labels.nav}>
            <h2 className="text-base font-semibold">{labels.navigationHeading}</h2>
            <ul className="space-y-3 text-lg font-medium text-[#201b17]/62">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    className="transition-[color] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#201b17]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>


          <div className="space-y-5">
            <h2 className="text-base font-semibold">{labels.follow}</h2>
            <ul className="space-y-3 text-lg font-medium text-[#201b17]/62">
              {site.social.map((item) => (
                <li key={item.id}>
                  <a
                    className="inline-flex items-center gap-3 transition-[color] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#201b17]"
                    href={item.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="w-5 text-center text-sm font-semibold uppercase">
                      {item.label.slice(0, 1)}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>


        <div className="mt-16 flex flex-col gap-4 text-base font-medium text-[#201b17]/62 md:flex-row md:items-center md:justify-between">
          <p>
            {labels.copyright} {new Date().getFullYear()} {site.legalName}.
          </p>
        </div>
      </div>
    </footer>
  );
}
