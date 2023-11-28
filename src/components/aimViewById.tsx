// JitViewById
// Handles displaying a single Jit when passed an ID

// Used in:
// ~/jitView

import { useJitData } from "./jitWizard";

export const JitViewById = ({ jitId }: { jitId: string }) => {
  const jitData = useJitData(jitId);

  if (!jitData) {
    return <div>Loading...</div>;
  }

  const { jit } = jitData;
  return (
    <div key={jit.id} className="flex flex-col">
      <span className="flex text-2xl">{jit.title}</span>
      <span className="flex text-sm">{jit.notes}</span>
    </div>
  );
};
