import BlurText from "./BlurText";
import SplitText from "./SplitText";

export const Cta = () => {
  return (
    <div className="mx-auto mt-10 flex flex-wrap items-center justify-between gap-5 rounded-xl bg-primary px-7 py-7 text-text lg:flex-nowrap lg:px-12 lg:py-12">
      <div className="flex-grow text-center lg:text-left">
        <BlurText
          as="h2"
          text="Ready to try-out this template?"
          delay={20}
          animateBy="letters"
          direction="top"
          className="justify-center lg:justify-start text-2xl font-medium lg:text-3xl"
        />
        <SplitText
          text="Don't let your visitors see a poor landing."
          className="mt-2 text-lg font-medium text-text text-opacity-90 lg:text-xl"
          delay={150}
          duration={1.85}
          ease="power3.out"
          splitType="lines"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="inherit"
          tag="p"
        />
      </div>
      <div className="flex-shrink-0 w-full text-center lg:w-auto">
        <a
          href="https://github.com/web3templates"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-card px-7 py-3 text-lg font-medium text-center text-primary transition hover:text-primary/80 lg:px-10 lg:py-5"
        >
          Download for Free
        </a>
      </div>
    </div>
  );
};
