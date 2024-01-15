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

const HomePage: NextPage = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  if (isSignedIn) {
    void router.push("/jits");
  }

  const Hero = () => {
    return (
      <div className="py-20 text-secondary">
        <div className="container mx-auto">
          <h1 className="mb-4 text-6xl font-bold text-secondary">
            {appCopy.catchphrase}
          </h1>
          <p className="mb-10 text-2xl">{appCopy.index.description}</p>
          <SignInButton mode="modal">
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  };

  const AdvantageSection = (props: {
    title: string;
    description: string;
    imageSrc: string;
    isImageOnRight: boolean;
  }) => {
    const { title, description, imageSrc, isImageOnRight } = props;

    const image = (
      <Image
        className="h-fit"
        src={imageSrc}
        alt={title}
        width={783}
        height={378}
      />
    );
    const text = (
      <div className="">
        <h2 className="mb-4 text-3xl font-bold text-secondary">{title}</h2>
        <p>{description}</p>
      </div>
    );

    return (
      <div
        className={`py-20 md:flex ${
          isImageOnRight ? "md:flex-row-reverse" : ""
        }`}
      >
        {image}
        {text}
      </div>
    );
  };

  const Footer = () => {
    return (
      <footer className="fixed bottom-0 left-0 w-full bg-gray-100 p-3 text-center">
        <p className="text-xs text-gray-700">{appCopy.index.footer}</p>
      </footer>
    );
  };

  return (
    <div className="flex max-w-[90vw] flex-col items-center">
      <Hero />
      <AdvantageSection
        title={appCopy.index.advantage1.title}
        description={appCopy.index.advantage1.description}
        imageSrc="/img/advantage-1-mobile.png"
        isImageOnRight={false}
      />
      <AdvantageSection
        title={appCopy.index.advantage2.title}
        description={appCopy.index.advantage2.description}
        imageSrc="/img/advantage-2.png"
        isImageOnRight={true}
      />
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
