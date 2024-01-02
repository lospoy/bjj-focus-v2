import type { PropsWithChildren, CSSProperties } from "react";

interface PageLayoutProps extends PropsWithChildren<unknown> {
  style?: CSSProperties;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <main className="flex justify-center px-2">
      <div className="h-full w-full md:max-w-xl">{children}</div>
    </main>
  );
};
