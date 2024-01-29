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
        <Button
          size="lg"
          className="bg-accent text-lg font-bold uppercase text-secondary"
        >
          Sign Up
        </Button>
      </SignInButton>
    );
  };

  const Hero = () => {
    return (
      <div className="px-2 py-32 text-secondary md:py-48">
        <div className="container mx-auto">
          <h1 className="mb-14 text-5xl font-bold text-secondary md:max-w-xl">
            {appCopy.catchphrase}
          </h1>
          <SignUpButton />
        </div>
      </div>
    );
  };

  const AdvantageSection = (props: { imageSrc: string }) => {
    const { imageSrc } = props;

    const image = (
      <Image
        className=""
        src={imageSrc}
        alt={imageSrc}
        width={1242}
        height={2688}
      />
    );

    return (
      <div className={`items-center justify-center py-5 lg:px-2`}>{image}</div>
    );
  };

  const BottomSignupSection = () => {
    return (
      <div className={`flex flex-col justify-center px-6 pb-52`}>
        <h4 className="mb-4 pb-8 pt-40 text-center text-2xl font-bold text-secondary lg:pt-0">
          BJJ Focus is in beta.
          <br />
          Get early access now, free.
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
      <div className="flex max-w-screen-xl flex-col justify-center md:flex-row md:justify-between lg:h-screen lg:w-screen">
        <AdvantageSection imageSrc="/img/features-1.png" />
        <AdvantageSection imageSrc="/img/features-2.png" />
        <AdvantageSection imageSrc="/img/features-3.png" />
      </div>
      <BottomSignupSection />
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
