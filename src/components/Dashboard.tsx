// Dashboard

import { SignInButton, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { JitFeed } from "~/components/JitFeed";

export const Dashboard = () => {
  const user = useUser().user;
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  return (
    <PageLayout>
      <h1 className="text-center text-2xl font-bold">Currently Focusing On</h1>
      <div className="flex flex-col">
        <div className="flex px-4 py-2">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
        </div>

        {user && (
          <>
            <JitFeed dashboard={true} />
          </>
        )}
      </div>
    </PageLayout>
  );
};
