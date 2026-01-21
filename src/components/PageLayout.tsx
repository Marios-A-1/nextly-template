import type { ReactNode } from "react";

interface PageRootProps {
  children: ReactNode;
}

interface MainContainerProps extends PageRootProps {
  className?: string;
}

export function PageRoot({ children }: PageRootProps) {
  return <div className="w-full bg-white text-text">{children}</div>;
}

export function MainContainer({ children, className }: MainContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
