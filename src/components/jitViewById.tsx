// // JitViewById
// // Handles displaying a single Jit when passed an ID

// // Used in:
// // ~/jitView

import { useJitData } from "./jitWizard";

export const JitViewById = ({ jitId }: { jitId: string }) => {
  const jit = useJitData(jitId);

  if (!jit) {
    return <div>Loading...</div>;
  }

  return (
    <div key={jit.id} className="flex flex-col">
      <span className="flex text-2xl">{jit.name}</span>
      <span className="flex text-sm">{jit.position.name}</span>
    </div>
  );
};
