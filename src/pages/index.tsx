import {
  type NextApiRequest,
  type GetServerSideProps,
  type NextPage,
} from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { getAuth } from "@clerk/nextjs/server";
import SuperJSON from "superjson";
import { prisma } from "prisma/db";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { appCopy } from "~/components/appText/appCopy";
import Image from "next/image";
import Link from "next/link";

const HomePage: NextPage = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  if (isSignedIn) {
    void router.push("/jits");
  }

  const SignUpButton = () => {
    return (
      <SignInButton mode="modal">
        <Button size="lg" className="text-lg">
          Sign Up
        </Button>
      </SignInButton>
    );
  };

  const Hero = () => {
    return (
      <div className="h-[95vh] px-2 py-32 text-secondary md:py-48">
        <div className="container mx-auto">
          <h1 className="mb-14 text-5xl font-bold text-secondary md:max-w-xl">
            {appCopy.catchphrase}
          </h1>
          <SignUpButton />
        </div>
      </div>
    );
  };

  const AdvantageSection = (props: { title: string; imageSrc: string }) => {
    const { title, imageSrc } = props;

    const image = (
      <Image
        className="max-w-xs"
        src={imageSrc}
        alt={title}
        width={783}
        height={378}
      />
    );
    const text = (
      <div className="flex justify-center px-4">
        <h2 className="mb-6 text-2xl font-bold text-secondary md:text-4xl">
          {title}
        </h2>
      </div>
    );

    return (
      <div
        className={`flex h-[85vh] w-screen flex-col items-center justify-center px-2 py-20`}
      >
        {text}
        {image}
      </div>
    );
  };

  const ComingSoonSection = () => {
    return (
      <div className={`flex h-[85vh] flex-col justify-center px-6 py-20`}>
        <h4 className="mb-4 text-lg font-bold text-secondary">
          {appCopy.index.comingSoon}
        </h4>
        <div className="self-center">
          <SignUpButton />
        </div>
      </div>
    );
  };

  const Footer = () => {
    return (
      <footer className="bottom-0 left-0 flex w-screen justify-center space-x-2 bg-gray-100 p-3 text-center text-xs text-gray-700">
        <span>{appCopy.footer}</span>
        <span>•</span>
        <Link href="https://www.github.com/lospoy">
          <span className="font-serif font-semibold">lospoy</span>
        </Link>
      </footer>
    );
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center">
      <Hero />
      <AdvantageSection
        title={appCopy.index.advantage1}
        imageSrc="/img/advantage-focus.png"
      />
      <AdvantageSection
        title={appCopy.index.advantage2}
        imageSrc="/img/advantage-notes.png"
      />
      <ComingSoonSection />
      <Footer />
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

  if (userId) {
    await Promise.all([
      helpers.jits.getAll.prefetch(),
      helpers.categories.getAll.prefetch(),
      helpers.positions.getAll.prefetch(),
      helpers.moves.getAll.prefetch(),
    ]);
  }

  return {
    props: { trpcState: helpers.dehydrate() },
  };
};

export default HomePage;
