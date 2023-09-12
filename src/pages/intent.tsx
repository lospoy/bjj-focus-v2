import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import IntentWizard from "~/components/intentWizard";

const Intent: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  api.aims.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        <IntentWizard />
      </div>
    </PageLayout>
  );
};

export default Intent;
