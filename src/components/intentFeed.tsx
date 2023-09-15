// AimView
// Handles displaying all Intents

// Used in:
// ~../pages/index

import { LoadingPage } from "~/components/loading";
import { IntentView } from "./intentView";
import { api } from "~/utils/api";

export const IntentFeed = () => {
  const { data, isLoading: intentsLoading } = api.intents.getAll.useQuery();

  if (intentsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullIntent) => (
        <IntentView {...fullIntent} key={fullIntent.intent.id} />
      ))}
    </div>
  );
};
