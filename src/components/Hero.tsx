import Image from "next/image";
import heroImg from "../../public/img/logo-hq.webp";
import CountUp from "./CountUp";

export const Hero = () => {
  return (
    <section className="grid gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] -mt-20 lg:items-center lg:-mt-10 lg:gap-16">
      <div className="space-y-8 text-center lg:text-left lg:order-1">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold -mb-4 leading-snug tracking-tight text-text lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
            Art of the Possible
          </h1>
          <p className="text-xl leading-relaxed text-muted lg:text-xl xl:text-2xl lg:text-left lg:hidden ">
            Αισθητική & Επανορθωτική Πλαστική, με σχέδιο και ασφάλεια.
          </p>
          <p className="text-xl leading-relaxed text-muted lg:text-xl xl:text-2xl lg:text-left sm:block hidden ">
            Αισθητική & Επανορθωτική Πλαστική, με σχέδιο και ασφάλεια.
             Εξατομικευμένη προσέγγιση, σύγχρονες τεχνικές και πλήρης καθοδήγηση 
              από την πρώτη επίσκεψη έως την αποθεραπεία.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center lg:order-2 lg:col-start-2 ">
        <Image
          src={heroImg}
          width={616}
          height={617}
          className="object-cover "
          alt="Hero Illustration"
          loading="eager"
          placeholder="blur"
        />
        <p className="text-2xl font-medium text-center text-text lg:text-left mt-6">
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
      </div>

      <div className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:items-center sm:justify-start lg:-mt-40 lg:col-span-2 lg:order-3">
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
    </section>
  );
};
