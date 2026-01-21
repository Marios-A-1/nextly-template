export const Cta = () => {
  return (
    <div className="mx-auto mt-10 flex flex-wrap items-center justify-between gap-5 rounded-xl bg-primary px-7 py-7 text-text lg:flex-nowrap lg:px-12 lg:py-12">
      <div className="flex-grow text-center lg:text-left">
        <h2 className="text-2xl font-medium lg:text-3xl">
          Ready to try-out this template?
        </h2>
        <p className="mt-2 text-lg font-medium text-text text-opacity-90 lg:text-xl">
          Don&apos;t let your visitors see a poor landing.
        </p>
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
