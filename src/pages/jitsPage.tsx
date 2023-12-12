// JitsPage

import { type NextPage } from "next";
import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { JitFeed } from "~/components/JitFeed";

const JitsPage: NextPage = () => {
  const user = useUser().user;

  // const router = useRouter();
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  api.jits.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  // const handleNewSequence = async () => {
  //   const url = `/activeJit/jit-selection`;
  //   await router.push(url);
  // };

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

        {user && (
          <>
            <JitFeed jitsPage={true} />
          </>
        )}
        {/* <Button
          onClick={handleNewSequence}
          className="fixed bottom-2 right-2 z-50 m-4 flex h-20 self-end rounded-full border-4 bg-current p-4 text-white shadow-lg "
        >
          <Plus className="h-10 w-10 text-accent" />
        </Button> */}
      </div>
    </PageLayout>
  );
};

export default JitsPage;
