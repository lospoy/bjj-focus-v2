// AimView
// Handles displaying a single Aim

// Used in:
// ~/aimFeed

import type { RouterOutputs } from "~/utils/api";

type AimWithUser = RouterOutputs["aims"]["getAll"][number];

export const AimView = (props: AimWithUser) => {
  const { aim } = props;

  return (
    <div
      key={aim.id}
      className="flex gap-3 border-4 border-b border-lime-200 bg-slate-400 p-4"
    >
      <div className="flex flex-col">
        <div className="gap-y-4 pl-2">
          <div className="text-md mt-3 flex flex-col gap-x-2">
            {" "}
            <h1 className="text-2xl">{aim.title}</h1>
            <span className="text-sm">{aim.notes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
