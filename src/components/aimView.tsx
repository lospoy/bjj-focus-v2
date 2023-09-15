// AimView
// Handles displaying a single Aim

// Used in:
// ~/intentView

import Link from "next/link";
import { useAimData } from "./aimWizard";

export const AimView = ({ aimId }: { aimId: string }) => {
  const aimData = useAimData(aimId);

  if (!aimData) {
    return <div>Loading...</div>;
  }

  const { aim } = aimData;
  return (
    <div key={aim.id} className="flex gap-3 p-2">
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <Link href={`/aim/${aim.id}`}></Link>{" "}
        </div>
        <span className="text-2xl">{aim.title}</span>
        <span className="text-sm">{aim.notes}</span>
      </div>
    </div>
  );
};
