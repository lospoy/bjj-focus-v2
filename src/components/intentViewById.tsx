// IntentViewById
// Handles displaying a single Intent when passed an ID

// Used in:
// ~/intentView

import { useIntentData } from "./intentWizard";

export const IntentViewById = ({ intentId }: { intentId: string }) => {
  const intentData = useIntentData(intentId);

  if (!intentData) {
    return <div>Loading...</div>;
  }

  const { intent } = intentData;
  return (
    <div key={intent.id} className="flex flex-col">
      <span className="flex text-2xl">{intent.creatorId}</span>
      <span className="flex text-sm">
        {intent.reminders ? JSON.stringify(intent.reminders) : "no reminders"}
      </span>
    </div>
  );
};
