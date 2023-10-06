// Dashboard

import { type NextPage } from "next";
import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { IntentFeed } from "~/components/intentFeed";
import { Button } from "~/components/ui/button";
import { Target } from "lucide-react";
import { useRouter } from "next/router";
import Navbar from "~/components/ui/navbar";

const Home: NextPage = () => {
  const router = useRouter();
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  api.aims.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  const handleNewIntentClick = async () => {
    const url = `/intent/aim-selection`;
    await router.push(url);
  };

  return (
    <PageLayout>
      <div className="flex flex-col">
        <div className="flex p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          <Navbar />
        </div>
        <div className="w-full p-2">
          <IntentFeed />
        </div>
        <Button
          onClick={handleNewIntentClick}
          className="flex self-end rounded-full"
        >
          <Target className="h-16 w-16" />
          <span className="font-bold">New Intent</span>
        </Button>
      </div>
    </PageLayout>
  );
};

export default Home;
