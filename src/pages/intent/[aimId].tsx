// url/intent/[aimId]

import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import { IntentWizard } from "~/components/intentWizard";

const IntentWizardSetReminders: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Return empty div if user isn't loaded yet
  if (!userLoaded || !isSignedIn) return <div>404 | Not Authorized</div>;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        <IntentWizard />
      </div>
    </PageLayout>
  );
};

export default IntentWizardSetReminders;
