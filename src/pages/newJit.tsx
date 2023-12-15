import { type NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/ui/layout";
import { JitCreator } from "~/components/JitCreator";
import { useUser } from "@clerk/nextjs";

const NewJit: NextPage = () => {
  // const router = useRouter();
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  api.jits.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  // const handleNewSequence = async () => {
  //   const url = `/activeJit/jit-selection`;
  //   await router.push(url);
  // };

  return (
    <PageLayout>
      <div className="flex h-full flex-col items-center justify-center pt-20">
        <JitCreator />
      </div>
    </PageLayout>
  );
};

export default NewJit;
