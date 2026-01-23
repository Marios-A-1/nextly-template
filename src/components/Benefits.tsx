import Image from "next/image";
import React from "react";
import BlurText from "./BlurText";
import SplitText from "./SplitText";
import AnimatedContent from "./AnimatedContent";

interface BenefitsProps {
  imgPos?: "left" | "right";
  data: {
    imgPos?: "left" | "right";
    title: string;
    desc: string;
    image: any;
    bullets: {
      title: string;
      desc: string;
      icon: React.ReactNode;
    }[];
  };
}
export const Benefits = (props: Readonly<BenefitsProps>) => {
  const { data } = props;
  return (
      <section
        className={`grid gap-10 mb-20 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center ${props.imgPos === "right" ? "lg:grid-flow-col-dense" : ""}`}
      >
        <AnimatedContent
          className={`hidden lg:flex items-center justify-center ${
            props.imgPos === "right" ? "lg:order-2" : ""
          }`}
        >
          <div className="border-0 border-primary rounded-xl bg-primarySoft">
            <Image
              src={data.image}
              width={321}
              height={321}
              alt="Benefits"
              className="object-contain w-72 h-auto sm:w-80 lg:w-96 rounded-xl"
              placeholder="blur"
              blurDataURL={data.image.src}
            />
          </div>
        </AnimatedContent>

        <div
          className={`flex flex-col items-center w-full text-center ${
            props.imgPos === "right" ? "lg:order-1" : ""
          } lg:items-start lg:text-left`}
        >
          <div className="flex flex-col w-full mt-2 space-y-5">
            <BlurText
              as="h3"
              text={data.title}
              delay={20}
              animateBy="letters"
              direction="top"
              className="justify-center lg:justify-start text-2xl font-bold leading-snug tracking-tight text-text lg:text-4xl text-center lg:text-left"
            />
            <AnimatedContent className="flex items-center justify-center lg:hidden">
              <div className="border-0 border-primary rounded-xl bg-primarySoft">
                <Image
                  src={data.image}
                  width={321}
                  height={321}
                  alt="Benefits"
                  className="object-contain w-72 h-auto sm:w-80 rounded-xl"
                  placeholder="blur"
                  blurDataURL={data.image.src}
                />
              </div>
            </AnimatedContent>
            <SplitText
              text={data.desc}
              className="text-lg leading-relaxed text-muted lg:text-xl text-center lg:text-left"
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

          <AnimatedContent className="w-full mt-4 space-y-6">
            {data.bullets.map((item, index) => (
              <Benefit key={index} title={item.title} icon={item.icon}>
                {item.desc}
              </Benefit>
            ))}
          </AnimatedContent>
        </div>
      </section>
  );
};

function Benefit(props: any) {
  return (
      <div className="flex items-center mt-8 space-x-3 lg:items-start text-center sm:text-left">
        <div className="flex items-center -mt-2 justify-center flex-shrink-0 bg-primary rounded-2xl lg:mt-0 w-14 h-14 ">
          {React.cloneElement(props.icon, {
            className: "w-7 h-7 text-text",
          })}
        </div>
        <div className="w-full text-left">
          <h4 className="text-xl font-medium text-text dark:text-text">
            {props.title}
          </h4>
          <p className="mt-1 text-muted dark:text-muted text-left">
            {props.children}
          </p>
        </div>
      </div>
  );
}
