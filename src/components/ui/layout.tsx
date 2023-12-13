import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex justify-center px-2">
      <div className="h-full w-full overflow-y-scroll md:max-w-xl">
        {props.children}
      </div>
    </main>
  );
};
