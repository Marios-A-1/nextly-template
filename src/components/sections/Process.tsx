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
                className="relative rounded-2xl border border-zinc-200/90 bg-white/95 p-0"
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <div className="mb-2 inline-flex size-9 items-center justify-center rounded-xl border border-teal-200 bg-teal-50 text-teal-700">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg text-zinc-900 sm:text-xl">
                      {step.title}
                    </CardTitle>
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                      {labels.step} {index + 1} - {step.duration}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-zinc-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 ? (
                  <span className="absolute left-4 top-full block h-5 w-px bg-zinc-200" />
                ) : null}
              </Reveal>
            );
          })}
        </Reveal>

        <Reveal variant="scaleIn">
          <Card className="h-full border-zinc-200/90 bg-linear-to-br from-zinc-100 to-teal-100/70 p-0">
            <CardHeader>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-zinc-500">
                {labels.previewEyebrow}
              </p>
              <p className="text-2xl font-semibold text-zinc-900">
                {labels.previewTitle}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-600">
                {labels.previewDescription}
              </p>
              <div className="rounded-xl border border-white/80 bg-white/90 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                  {labels.touchpoint}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {site.siteDescription}
                </p>
              </div>
              <div className="rounded-xl border border-white/80 bg-white/90 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                  {labels.cycle}
                </p>
                <p className="mt-1 text-sm text-zinc-700">
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
