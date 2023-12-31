// homePage

import {
  type NextApiRequest,
  type GetServerSideProps,
  type NextPage,
} from "next";
import { SignIn, useUser } from "@clerk/nextjs";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { getAuth } from "@clerk/nextjs/server";
import SuperJSON from "superjson";
import { prisma } from "prisma/db";

import { useRouter } from "next/router";

const HomePage: NextPage = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  if (isSignedIn) {
    void router.push("/jits");
  }

  return (
    <div className="min-w-screen flex flex-col items-center bg-background">
      <main className="flex-grow md:w-1/3">
        <section className="md:min-w-xl mx-auto p-4">
          <SignIn />
        </section>
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-gray-100 p-3 text-center">
        <p className="text-xs text-gray-700">
          © {new Date().getFullYear()} BJJ Focus. All rights reserved.
        </p>
      </footer>
    </div>
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

export default HomePage;
