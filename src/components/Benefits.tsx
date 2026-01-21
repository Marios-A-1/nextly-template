import Image from "next/image";
import React from "react";
import { Container }  from "./Container";

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
      <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap ">
        <div
          className={`flex items-center justify-center w-full lg:w-1/2 ${
            props.imgPos === "right" ? "lg:order-1" : ""
          }`}>
                <div className="border-2 border-primary/40 rounded-xl bg-primary/20">
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
        </div>

        <div
          className={`flex flex-wrap items-center w-full lg:w-1/2 ${
            data.imgPos === "right" ? "lg:justify-end" : ""
          }`}>
          <div>
            <div className="flex flex-col w-full mt-4">
              <h3 className="max-w-2xl mt-3 text-3xl font-bold leading-snug tracking-tight text-text lg:leading-tight lg:text-4xl dark:text-text">
                {data.title}
              </h3>

              <p className="max-w-2xl py-4 text-lg leading-normal text-muted lg:text-xl xl:text-xl dark:text-muted">
                {data.desc}
              </p>
            </div>

            <div className="w-full mt-5">
              {data.bullets.map((item, index) => (
                <Benefit key={index} title={item.title} icon={item.icon}>
                  {item.desc}
                </Benefit>
              ))}
            </div>
          </div>
        </div>
      </Container>
  );
};

function Benefit(props: any) {
  return (
      <div className="flex items-start mt-8 space-x-3">
        <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-primary rounded-full w-11 h-11 ">
          {React.cloneElement(props.icon, {
            className: "w-7 h-7 text-text",
          })}
        </div>
        <div>
          <h4 className="text-xl font-medium text-text dark:text-text">
            {props.title}
          </h4>
          <p className="mt-1 text-muted dark:text-muted">
            {props.children}
          </p>
        </div>
      </div>
  );
}
