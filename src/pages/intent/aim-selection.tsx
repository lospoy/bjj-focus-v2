// url/activeJit/jit-selection

import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { FullJitFeed } from "~/components/FullJitFeed";

const ActiveJitWizardJitSelection: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Return empty div if user isn't loaded yet
  if (!userLoaded || !isSignedIn) return <div>404 | Not Authorized</div>;

  return (
    <PageLayout>
      <FullJitFeed />
    </PageLayout>
  );
};

export default ActiveJitWizardJitSelection;
