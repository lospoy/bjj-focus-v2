import type { RouterOutputs } from "~/utils/api";
import { AimView } from "./aimView";

// intentView
// Handles the logic to display a single intent

type IntentWithUser = RouterOutputs["intents"]["getAll"][number];

export const IntentView = (props: IntentWithUser) => {
  const { intent } = props;
  const startDate = intent.startDate.toLocaleDateString();
  const endDate = intent.endDate.toLocaleDateString();

  return (
    <div key={intent.id} className="flex gap-3 border-b border-slate-400 p-4">
      <div className="flex flex-col">
        <AimView aimId={intent.aimId} />
        <div className="gap-y-4 pl-2">
          <div className="text-md mt-3 flex flex-col gap-x-2">
            {" "}
            <span>From {startDate}</span>
            <span>Until {endDate}</span>
            <span>{intent.notes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
