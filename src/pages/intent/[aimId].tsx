// url/knownJit/[jitId]

import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/ui/layout";
import { KnownJitWizard } from "~/components/knownJitWizard";

const KnownJitWizardSetReminders: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Return empty div if user isn't loaded yet
  if (!userLoaded || !isSignedIn) return <div>404 | Not Authorized</div>;

  return (
    <PageLayout>
      <KnownJitWizard />
    </PageLayout>
  );
};

export default KnownJitWizardSetReminders;
