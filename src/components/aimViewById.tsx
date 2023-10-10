// AimViewById
// Handles displaying a single Aim when passed an ID

// Used in:
// ~/aimView

import { useAimData } from "./aimWizard";

export const AimViewById = ({ aimId }: { aimId: string }) => {
  const aimData = useAimData(aimId);

  if (!aimData) {
    return <div>Loading...</div>;
  }

  const { aim } = aimData;
  return (
    <div key={aim.id} className="flex flex-col">
      <span className="flex text-2xl">{aim.title}</span>
      <span className="flex text-sm">{aim.notes}</span>
    </div>
  );
};
