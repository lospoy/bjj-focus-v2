// AimViewById
// Handles displaying a single Aim when passed an ID

// Used in:
// ~/aimView

import Link from "next/link";
import { useAimData } from "./aimWizard";

export const AimViewById = ({ aimId }: { aimId: string }) => {
  const aimData = useAimData(aimId);

  if (!aimData) {
    return <div>Loading...</div>;
  }

  const { aim } = aimData;
  return (
    <div
      key={aim.id}
      className="boder-b flex gap-3 border-4 border-lime-200 bg-slate-400 p-2"
    >
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
