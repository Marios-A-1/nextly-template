import Link from "next/link";
import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import DoctorSection from "@/src/components/about-us/DoctorSection";
import { MissionSection } from "@/src/components/about-us/MissionSection";
import { VisionSection } from "@/src/components/about-us/VisionSection";

const stats = [
  {
    label: "Patients served",
    value: "2,300+",
    detail: "Greek and international families who ask us to listen.",
  },
  {
    label: "Specialists on staff",
    value: "12",
    detail: "Each surgeon is board certified and mentors the next class.",
  },
  {
    label: "Awards of safety",
    value: "8",
    detail: "Recognitions for transparency in care and clinical excellence.",
  },
  {
    label: "Follow-up support",
    value: "24/7",
    detail: "Patients always reach the same care team after surgery.",
  },
];

const pillars = [
  {
    title: "Evidence-led craft",
    description:
      "Everything we do starts with research, continues with honest coaching, and ends in a plan the patient controls.",
  },
  {
    title: "Care + comfort",
    description:
      "Multiple touchpoints—before, during and after surgery—make sure you never feel like just a file.",
  },
  {
    title: "Transparent decisions",
    description:
      "We share the risks, the recovery notes, and the options so you can make informed choices with confidence.",
  },
];

const timeline = [
  {
    year: "2008",
    title: "Clinic foundation",
    description:
      "A small team of surgeons started with a boutique practice focused on plastic surgery that valued listening.",
  },
  {
    year: "2015",
    title: "Expanded patient services",
    description:
      "We opened the patient experience studio and made support available for every phase of care and travel.",
  },
  {
    year: "2023",
    title: "Growing our global reach",
    description:
      "International referrals doubled, and we now coordinate personalized journeys for visitors from more than ten countries.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SectionTitle
        align="center"
        preTitle="About us"
        title="Art of the Possible"
      >
       Στην κλινική μας, η πλαστική χειρουργική δεν είναι μια μεμονωμένη πράξη.
      Είναι μια ολιστική εμπειρία φροντίδας.
      </SectionTitle>
      <DoctorSection/>
      <Container className="space-y-12 py-10  text-center">
        <MissionSection/>
        <VisionSection/>

        {/* <section className="space-y-6">
          <div className="flex items-end justify-between">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Impact metrics
            </p>
            <div className="text-muted text-sm">Adjust the numbers as you refine.</div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card/10 p-6 text-left"
              >
                <p className="text-4xl font-bold text-text">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-primary">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Pillars
            </p>
            <p className="text-sm text-muted">Feel free to swap these with your own headers.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-[1.5rem] border border-border bg-accent/20 p-6"
              >
                <h3 className="text-xl font-semibold text-text">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-primary/5 p-8 text-text">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-text md:text-3xl">
                Ready to tell your next chapter?
              </h3>
              <p className="mt-2 text-sm text-muted">
                Highlight the person the reader should contact or the next step they
                should take. Replace this copy with your own CTA.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-text transition hover:border-primary hover:text-primary"
            >
              Start the conversation
            </Link>
          </div>
        </section> */}
      </Container>
    </>
  );
}
