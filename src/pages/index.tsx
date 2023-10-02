import { type NextPage } from "next";
import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import { IntentFeed } from "~/components/intentFeed";
import { AimFeed } from "~/components/aimFeed";

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  api.aims.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        <div>Navbar goes here</div>
      </div>

      <div className="p-2">
        <AimFeed />
      </div>
      <div className="p-2">
        <IntentFeed />
      </div>
    </PageLayout>
  );
};

export default Home;
