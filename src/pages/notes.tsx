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
import { PageTitle, appTitles } from "~/components/appText/appTitles";
import NewJitButton from "~/components/NewJitButton";
import { appCopy } from "~/components/appText/appCopy";
import { usePathname } from "next/navigation";

const Notes: NextPage = () => {
  const allJits = api.jits.getAll.useQuery().data;
  const path = usePathname();

  console.log({ path });

  const NoJitsWelcome = () => {
    return (
      <Card>
        <CardHeader className="text-md">
          <CardTitle className="mb-4 text-lg">{appCopy.catchphrase}</CardTitle>
          <CardDescription className="text-md space-y-4">
            <p>blablabla.</p>
            <p>Let&apos;s get started.</p>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex w-full justify-center">
            <Link href="/newJit">
              <Button className="flex">
                <PlusCircle className="mr-1 mt-0.5 h-4 w-4" />
                CREATE YOUR FIRST JIT
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
        <>
          <PageTitle title={appTitles.notes} />
          <JitFeed jits={true} allJits={allJits} mode={"notes"} />
          <NewJitButton />
        </>
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

export default Notes;
