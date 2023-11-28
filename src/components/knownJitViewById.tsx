// KnownJitViewById
// Handles displaying a single KnownJit when passed an ID

// Used in:
// ~/knownJitView

import { useKnownJitData } from "./knownJitWizard";

export const KnownJitViewById = ({ knownJitId }: { knownJitId: string }) => {
  const knownJitData = useKnownJitData(knownJitId);

  if (!knownJitData) {
    return <div>Loading...</div>;
  }

  const { knownJit } = knownJitData;
  return (
    <div key={knownJit.id} className="flex flex-col">
      <span className="flex text-2xl">{knownJit.creatorId}</span>
      <span className="flex text-sm">
        {knownJit.reminders ? JSON.stringify(knownJit.reminders) : "no reminders"}
      </span>
    </div>
  );
};
