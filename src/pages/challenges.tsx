import { api } from "~/utils/api";
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
import { PageTitle, appTitles } from "~/components/appTitles";
import { ChallengeFeed } from "~/components/ChallengeFeed";

const Jits: NextPage = () => {
  const allJits = api.jits.getAll.useQuery().data;

  return (
    <PageLayout>
      <PageTitle title={appTitles.challenges} />
      <ChallengeFeed jits={true} allJits={allJits} />
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
