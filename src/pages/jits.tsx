// Jits

import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
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
import { PlusCircle, Shapes } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const Jits: NextPage = () => {
  const user = useUser().user;
  const ctx = api.useUtils();

  // const router = useRouter();
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  const allJits = ctx.jits.getAll.getData();
  console.log({ allJits });

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  const AllJitsFeed = () => {
    return (
      <>
        <div className="mx-auto mb-4 flex flex-row items-center text-center">
          <Shapes className="absolute left-10 h-1/5 w-1/5 text-secondary opacity-10" />
          <h1 className="whitespace-nowrap text-[15vw] font-bold tracking-tighter text-secondary md:text-[10vw] lg:text-[6vw]">
            ALL JITS
          </h1>
        </div>
        <JitFeed jits={true} allJits={allJits} />
      </>
    );
  };

  const NoJitsWelcome = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>
            You have no jits, let&apos;s create one
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex w-full justify-center">
            <Link href="/newJit">
              <Button className="flex">
                <PlusCircle className="mr-1 mt-0.5 h-4 w-4" />
                NEW JIT
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <PageLayout>
      {user && (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex items-center justify-center">
            {allJits !== undefined && allJits.length !== 0 ? (
              <AllJitsFeed />
            ) : (
              <NoJitsWelcome />
            )}
          </div>
        </div>
      )}
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

  await Promise.all([
    helpers.jits.getAll.prefetch(),
    helpers.categories.getAll.prefetch(),
    helpers.positions.getAll.prefetch(),
    helpers.moves.getAll.prefetch(),
  ]);

  return {
    props: { trpcState: helpers.dehydrate() },
  };
};

export default Jits;
