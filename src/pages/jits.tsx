import { api } from "~/utils/api";
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
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PageTitle } from "~/components/pageTitle";

const Jits: NextPage = () => {
  const allJits = api.jits.getAll.useQuery().data;

  const AllJitsFeed = () => {
    return (
      <>
        <PageTitle title="ALL JITS" />
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
      {allJits !== undefined && allJits.length !== 0 ? (
        <AllJitsFeed />
      ) : (
        <div className="flex h-[80vh] items-center justify-center">
          <NoJitsWelcome />
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
