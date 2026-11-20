import { CalendarDays, ClipboardList, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";
import { type ProcessStep, type SiteConfig } from "@/types/content";
import { SectionShell } from "./SectionShell";
import { Reveal } from "./Reveal";

type ProcessProps = {
  id?: string;
  title?: string;
  description?: string;
  steps: ProcessStep[];
  ctaLabel?: string;
  site: SiteConfig;
  labels: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    step: string;
    previewEyebrow: string;
    previewTitle: string;
    previewDescription: string;
    touchpoint: string;
    cycle: string;
    cycleDescription: string;
  };
};

const ICON_BY_INDEX = [ClipboardList, CalendarDays, ShieldCheck];

export function Process({
  id,
  title,
  description,
  steps,
  ctaLabel,
  site,
  labels,
}: ProcessProps) {
  return (
    <SectionShell
      id={id}
      eyebrow={labels.eyebrow}
      title={title ?? labels.title}
      description={description ?? labels.description}
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <Reveal variant="stagger" className="space-y-4">
          {steps.map((step, index) => {
            const Icon = ICON_BY_INDEX[index % ICON_BY_INDEX.length];

            return (
              <Reveal
                key={step.id}
                className="relative rounded-2xl border border-border bg-white/95 p-0"
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <div className="mb-2 inline-flex size-9 items-center justify-center rounded-xl border border-ring/25 bg-champagne text-bronze">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg text-foreground sm:text-xl">
                      {step.title}
                    </CardTitle>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {labels.step} {index + 1} - {step.duration}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 ? (
                  <span className="absolute left-4 top-full block h-5 w-px bg-border" />
                ) : null}
              </Reveal>
            );
          })}
        </Reveal>

        <Reveal variant="scaleIn">
          <Card className="h-full border-border bg-linear-to-br from-ivory to-champagne p-0">
            <CardHeader>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {labels.previewEyebrow}
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {labels.previewTitle}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {labels.previewDescription}
              </p>
              <div className="rounded-xl border border-white/80 bg-white/90 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {labels.touchpoint}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {site.siteDescription}
                </p>
              </div>
              <div className="rounded-xl border border-white/80 bg-white/90 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {labels.cycle}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {labels.cycleDescription}
                </p>
              </div>
              <ContactChoiceButton className="w-full justify-center">
                {ctaLabel ?? labels.cta}
              </ContactChoiceButton>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </SectionShell>
  );
}
