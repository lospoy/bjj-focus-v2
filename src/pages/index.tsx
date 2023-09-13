import { type NextPage } from "next";
import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";
import { AimView } from "~/components/aimView";
import IntentWizard from "~/components/intentWizard";

const Feed = () => {
  const { data, isLoading: aimsLoading } = api.aims.getAll.useQuery();

  if (aimsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullAim) => <AimView {...fullAim} key={fullAim.aim.id} />)}
    </div>
  );
};

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
        {isSignedIn && <IntentWizard />}
      </div>

      <Feed />
    </PageLayout>
  );
};

export default Home;
