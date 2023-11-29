// KnownJitViewById
// Handles displaying a single KnownJit when passed an ID

import { RouterOutputs, api } from '~/utils/api';

// Used in:
// ~/knownJitView

type KnownJitData = RouterOutputs["knownJits"]["getByJitId"];

const useKnownJitData = (id: string): KnownJitData | undefined => {
  const { data } = api.knownJits.getByJitId.useQuery({ id });

  return data;
};

export const KnownJitViewById = ({ knownJitId }: { knownJitId: string }) => {
  const knownJit = useKnownJitData(knownJitId);

  if (!knownJit) {
    return <div>Loading...</div>;
  }

  return (
    <div key={knownJit.jitId} className="flex flex-col">
      <span className="flex text-2xl">JIT LEVEL{knownJit.level}</span>
    </div>
  );
};
