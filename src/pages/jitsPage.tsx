// JitsPage

import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { JitFeed } from "~/components/JitFeed";
import {
  type NextApiRequest,
  type GetServerSideProps,
  type NextPage,
} from "next";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { getAuth } from "@clerk/nextjs/server";
import SuperJSON from "superjson";
import { prisma } from "prisma/db";

const JitsPage: NextPage = () => {
  const user = useUser().user;

  // const router = useRouter();
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  const allJits = api.jits.getAll.useQuery().data;

  // const allJits: GetAllJit = [];

  console.log({ allJits });

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

        {user && allJits && (
          <>
            <JitFeed jitsPage={true} allJits={allJits} />
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const sesh = getAuth(req);
  const userId = sesh.userId;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId, sesh, req: req as NextApiRequest },
    transformer: SuperJSON,
  });

  // await Promise.all([
  //   helpers.jits.getAll.prefetch(),
  //   helpers.categories.getAll.prefetch(),
  //   helpers.positions.getAll.prefetch(),
  //   helpers.moves.getAll.prefetch(),
  // ]);

  await helpers.jits.getAll.prefetch();

  return {
    props: { trpcState: helpers.dehydrate() },
  };
};

export default JitsPage;
