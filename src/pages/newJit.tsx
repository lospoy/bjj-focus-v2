import { JitCreator } from "~/components/JitCreator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PageLayout } from "~/components/ui/layout";
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
import { api } from "~/utils/api";
import { PageTitle } from "~/components/pageTitle";

const NewJit: NextPage = () => {
  const ctx = api.useUtils();
  const allPositions = ctx.positions.getAll.getData() ?? [];
  const allMoves = ctx.moves.getAll.getData() ?? [];
  const allJits = ctx.jits.getAll.getData() ?? [];

  return (
    <PageLayout>
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <PageTitle title="NEW JIT" />
        <Card className="w-11/12 pt-8">
          <CardContent>
            <JitCreator
              allJits={allJits}
              allPositions={allPositions}
              allMoves={allMoves}
            />
          </CardContent>
        </Card>
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

export default NewJit;
