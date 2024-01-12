import { JitCreator } from "~/components/JitCreator";
import { Card, CardContent } from "~/components/ui/card";
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
import { PageTitle, appTitles } from "~/components/appText/appTitles";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const NewJit: NextPage = () => {
  const ctx = api.useUtils();
  const allPositions = ctx.positions.getAll.getData() ?? [];
  const allMoves = ctx.moves.getAll.getData() ?? [];
  const allJits = ctx.jits.getAll.getData() ?? [];
  const [isRead, setIsRead] = useState(false);
  const firstTimer = allJits.length === 0;

  const Label = (props: { text: string }) => {
    const { text } = props;
    return (
      <span className="rounded-md bg-card-secondaryLight px-2 font-mono text-secondary">
        {text}
      </span>
    );
  };

  const FirstTimerWelcome = () => {
    return (
      <CardContent>
        {isRead ? (
          <JitCreator
            allJits={allJits}
            allPositions={allPositions}
            allMoves={allMoves}
          />
        ) : (
          <div className="flex flex-col space-y-5">
            <div className="space-y-5 md:px-20">
              <div className="flex flex-col space-y-4">
                <span>
                  A &quot;jit&quot; is what you want to work on. <br />
                  It can be:
                </span>
                <span>
                  Only a position: <br />
                  <Label text="Half Guard" />
                </span>
                <span>
                  Only a move: <br />
                  <Label text="Scissor Sweep" />
                </span>
                <span>
                  Or both: <br />
                  <Label text="Scissor Sweep from Half Guard" />
                </span>
              </div>
            </div>
            <Button className="self-center" onClick={() => setIsRead(true)}>
              <div className="flex items-center space-x-1">
                <Check className="h-5 w-5" />
                <span>Got it</span>
              </div>
            </Button>
          </div>
        )}
      </CardContent>
    );
  };

  const NotFirstTimer = () => {
    return (
      <CardContent>
        <JitCreator
          allJits={allJits}
          allPositions={allPositions}
          allMoves={allMoves}
        />
      </CardContent>
    );
  };

  const BackToJits = () => {
    return (
      <Link href="/jits">
        <div className="flex items-center space-x-1 text-secondary">
          <ArrowLeft className="h-7 w-7" />
          <span>back to jits</span>
        </div>
      </Link>
    );
  };

  return (
    <PageLayout>
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <div className="md:hidden">
          <BackToJits />
        </div>
        <PageTitle title={appTitles.newJit} />
        <Card className="w-11/12 pt-8">
          {firstTimer ? <FirstTimerWelcome /> : <NotFirstTimer />}
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
