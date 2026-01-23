"use client";
import Image from "next/image";
import heroImg from "../../public/img/logo-hq.webp";
import CountUp from "./CountUp";
import BlurText from "./BlurText";
import SplitText from "./SplitText";
import AnimatedContent from "./AnimatedContent";

export const Hero = () => {
  return (
    <section className="grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] -mt-20 lg:items-center lg:-mt-10 lg:gap-16">
      <div className="space-y-8 text-center lg:text-left lg:order-1">
        <div className="space-y-6">
              
          <h1 className="text-center lg:text-left text-4xl font-bold -mb-4 leading-snug tracking-tight text-text lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
            <BlurText
              text="Art of the Possible"
              delay={20}
              animateBy="letters"
              direction="top"
              className="justify-center lg:justify-start text-center lg:text-left text-4xl font-bold -mb-4 leading-snug tracking-tight text-text lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight"
            />
          </h1>
          <div className="text-xl leading-relaxed text-muted text-center lg:text-xl xl:text-2xl lg:text-left lg:hidden ">
          <SplitText
              text="Aισθητική & Επανορθωτική Πλαστική, με σχέδιο και ασφάλεια."
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
          <div className="text-xl leading-relaxed text-muted lg:text-xl xl:text-2xl text-left sm:block hidden ">

              <SplitText
              text="Αισθητική & Επανορθωτική Πλαστική, με σχέδιο και ασφάλεια.
                Εξατομικευμένη προσέγγιση, σύγχρονες τεχνικές και πλήρης καθοδήγηση 
                από την πρώτη επίσκεψη έως την αποθεραπεία."
              className="text-xl leading-relaxed text-muted lg:text-xl xl:text-2xl text-left sm:block hidden "
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

      <div className="flex flex-col items-center justify-center lg:order-2 lg:col-start-2 ">
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
        <p className="text-xl font-medium text-center text-text lg:text-2xl lg:text-left mt-6">
          Πάνω απο
          <span className="px-2 text-primary">
            <CountUp
              from={0}
              to={2000}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />+
          </span>
           Επεμβάσεις
        </p>
        </AnimatedContent>
      </div>

      <AnimatedContent threshold={-100} className="lg:-mt-40 lg:col-span-2 lg:order-3">
        <div className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:items-center sm:justify-start">
        <a
          href="https://web3templates.com/templates/nextly-landing-page-template-for-startups"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 text-lg font-medium text-text bg-primary rounded-md text-center"
        >
          Κλείσε ραντεβού
        </a>
        <a
          href="https://github.com/web3templates/nextly-template/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-muted px-8"
        >
          <span> Δες Αποτελέσματα</span>
        </a>
        </div>
      </AnimatedContent>
    </section>
  );
};
