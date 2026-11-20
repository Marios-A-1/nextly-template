import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Reveal } from "./Reveal"

type SectionShellProps = {
  id?: string
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  className?: string
  containerClassName?: string
  children: ReactNode
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  className,
  containerClassName,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-14 text-foreground sm:py-20 lg:py-24",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 md:gap-10",
          containerClassName
        )}
      >
        {(eyebrow || title || description) && (
          <Reveal variant="stagger" className="max-w-3xl space-y-4">
            {eyebrow ? (
              <Reveal as="p" className="inline-flex items-center rounded-full border border-ring/25 bg-champagne px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-bronze">
                {eyebrow}
              </Reveal>
            ) : null}
            {title ? (
              <Reveal as="h2" className="text-[2.25rem] font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
                {title}
              </Reveal>
            ) : null}
            {description ? (
              <Reveal as="p" className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </Reveal>
            ) : null}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
