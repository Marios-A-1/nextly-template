"use client";

import Image from "next/image";
import heroImg from "../../public/img/logo-hq.webp";
import CountUp from "./CountUp";
import BlurText from "./BlurText";
import SplitText from "./SplitText";
import AnimatedContent from "./AnimatedContent";
import { ContactModalTrigger } from "./ContactModalTrigger";

export const Hero = () => {
  return (
    <section className="grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] -mt-20 lg:items-center lg:-mt-10 lg:gap-16">
      <div className="space-y-8 text-center lg:order-1 lg:text-left">
        <div className="space-y-6">
          <h1 className="text-center text-4xl font-bold -mb-4 leading-snug tracking-tight text-text lg:text-left lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
            <BlurText
              text="Art of the Possible"
              delay={20}
              animateBy="letters"
              direction="top"
              className="justify-center text-center text-4xl font-bold -mb-4 leading-snug tracking-tight text-text lg:justify-start lg:text-left lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight"
            />
          </h1>

          <div className="text-center text-xl leading-relaxed text-muted lg:hidden lg:text-xl xl:text-2xl">
            <SplitText
              text="Αισθητική & Επανορθωτική Πλαστική, με σχέδιο και ασφάλεια."
              delay={150}
              duration={1.85}
              ease="power3.out"
              splitType="lines"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>

          <div className="hidden text-left text-xl leading-relaxed text-muted sm:block lg:text-xl xl:text-2xl">
            <SplitText
              text={`Αισθητική & Επανορθωτική Πλαστική, με σχέδιο και ασφάλεια.
                Εξατομικευμένη προσέγγιση, σύγχρονες τεχνικές και πλήρης καθοδήγηση
                από την πρώτη επίσκεψη έως την αποθεραπεία.`}
              className="hidden text-left text-xl leading-relaxed text-muted sm:block lg:text-xl xl:text-2xl"
              delay={150}
              duration={1.85}
              ease="power3.out"
              splitType="lines"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center lg:order-2 lg:col-start-2">
        <AnimatedContent>
          <Image
            src={heroImg}
            width={616}
            height={617}
            className="object-cover h-auto w-[250px] sm:w-[300px] lg:w-[616px]"
            alt="Hero Illustration"
            loading="eager"
            placeholder="blur"
          />
        </AnimatedContent>

        <AnimatedContent threshold={-100}>
          <p className="mt-6 text-center text-xl font-medium text-text lg:text-left lg:text-2xl">
            Πάνω από
            <span className="px-2 text-primary">
              <CountUp
                from={0}
                to={2000}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              +
            </span>
            Επεμβάσεις
          </p>
        </AnimatedContent>
      </div>

      <AnimatedContent threshold={-100} className="lg:-mt-40 lg:order-3 lg:col-span-2">
        <div className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:items-center sm:justify-start">
          <ContactModalTrigger className="rounded-md bg-primary px-8 py-4 text-center text-lg font-medium text-text">
            Κλείσε ραντεβού
          </ContactModalTrigger>

          <a
            href="/results"
            target="_self"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-8 text-muted"
          >
            <span>Δες Αποτελέσματα</span>
          </a>
        </div>
      </AnimatedContent>
    </section>
  );
};
