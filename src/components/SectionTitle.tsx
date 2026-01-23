import React from "react";
import { Container } from "./Container";
import AnimatedContent from "./AnimatedContent";
import BlurText from "./BlurText";
import SplitText from "./SplitText";

interface SectionTitleProps {
  preTitle?: string;
  title?: string;
  align?: "left" | "center";
  titleAnimation?: "blur" | "content";
  children?: React.ReactNode;
}

export const SectionTitle = (props: Readonly<SectionTitleProps>) => {
  const isLeft = props.align === "left";
  const titleAnimation = props.titleAnimation ?? "blur";
  const childrenText = typeof props.children === "string" ? props.children : null;

  return (
    <Container
      className={`flex w-full flex-col mt-8 ${
        isLeft ? "" : "items-center justify-center text-center"
      }`}>
      {props.preTitle && (
        <BlurText
          as="span"
          text={props.preTitle}
          delay={30}
          animateBy="words"
          direction="top"
          className="text-sm font-bold tracking-wider text-primary uppercase"
        />
      )}

      {props.title && titleAnimation === "content" && (
        <AnimatedContent className={isLeft ? "" : "text-center"}>
          <h2 className="max-w-2xl mt-3 text-2xl font-bold leading-snug tracking-tight text-text lg:leading-tight lg:text-4xl dark:text-text">
            {props.title}
          </h2>
        </AnimatedContent>
      )}
      {props.title && titleAnimation === "blur" && (
        <BlurText
          as="h2"
          text={props.title}
          delay={20}
          animateBy="letters"
          direction="top"
          className={`max-w-2xl mt-3 text-2xl font-bold leading-snug tracking-tight text-text lg:leading-tight lg:text-4xl dark:text-text ${
            isLeft ? "" : "justify-center text-center"
          }`}
        />
      )}

      {childrenText ? (
        <SplitText
          text={childrenText}
          className="max-w-2xl py-4 text-lg leading-normal text-muted lg:text-xl xl:text-xl dark:text-muted"
          delay={150}
          duration={1.85}
          ease="power3.out"
          splitType="lines"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign={isLeft ? "left" : "center"}
          tag="p"
        />
      ) : props.children ? (
        <p className="max-w-2xl py-4 text-lg leading-normal text-muted lg:text-xl xl:text-xl dark:text-muted">
          {props.children}
        </p>
      ) : null}
    </Container>
  );
}
