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
import { PageLayout } from "~/components/ui/layout";
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
        className="w-1/2"
        src={imageSrc}
        alt={title}
        width={500}
        height={300}
      />
    );
    const text = (
      <div className="w-1/2 px-8">
        <h2 className="mb-4 text-3xl font-bold text-secondary">{title}</h2>
        <p>{description}</p>
      </div>
    );

    return (
      <div className={`flex ${isImageOnRight ? "flex-row-reverse" : ""}`}>
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
    <PageLayout>
      <div className="min-w-screen flex flex-col items-center">
        <Hero />
        <AdvantageSection
          title="Advantage 1"
          description="This is a description of the first advantage of your product."
          imageSrc="/path/to/image1.png"
          isImageOnRight={false}
        />
        <AdvantageSection
          title="Advantage 2"
          description="This is a description of the second advantage of your product."
          imageSrc="/path/to/image2.png"
          isImageOnRight={true}
        />
        <Footer />
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
