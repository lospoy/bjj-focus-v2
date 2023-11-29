// url/activeJit/[jitId]

import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { ActiveJitWizard } from "~/components/activeJitWizard";

const ActiveJitWizardSetReminders: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Return empty div if user isn't loaded yet
  if (!userLoaded || !isSignedIn) return <div>404 | Not Authorized</div>;

  return (
    <PageLayout>
      <ActiveJitWizard />
    </PageLayout>
  );
};

export default ActiveJitWizardSetReminders;
