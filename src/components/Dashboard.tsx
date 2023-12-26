// Dashboard

import { SignInButton, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { JitFeed } from "~/components/JitFeed";
import { api } from "~/utils/api";
import { Icons } from "./ui/icons";

export const Dashboard = () => {
  const user = useUser().user;
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const allJits = api.jits.getAll.useQuery().data;

  return (
    <PageLayout>
      <div className="flex flex-col">
        <div className="flex px-4 py-2">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
        </div>

        {user && allJits && (
          <>
            <div className="mb-6 flex w-full flex-col items-center -space-y-8 text-center">
              <Icons.eyeHalf className="-mt-4 h-1/4 w-1/4" />
              <h1 className="w-full whitespace-nowrap text-[3.5rem] font-bold tracking-tighter text-accent md:text-[10vw] lg:text-[6vw]">
                FOCUSED JITS
              </h1>
            </div>
            <JitFeed dashboard={true} allJits={allJits} />
          </>
        )}
      </div>
    </PageLayout>
  );
};
