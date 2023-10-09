// IntentView
// Handles displaying a single Intent

// Used in:
// ~/intentFeed

import type { RouterOutputs } from "~/utils/api";
import { AimViewById } from "./aimViewById";
import { useCallback, useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";

type IntentWithUser = RouterOutputs["intents"]["getAll"][number];

export const IntentView = (props: IntentWithUser) => {
  const { intent } = props;
  const [progress, setProgress] = useState(5);
  const startDate = intent.startDate.toLocaleDateString();
  const endDate = intent.endDate.toLocaleDateString();

  const calculateProgress = useCallback(() => {
    // Calculates how far along this intent the user is based on daysSinceStart/totalDays
    // Will be changed in the future, this is a simplistic approach
    const start = intent.startDate;
    const end = intent.endDate;
    const today = new Date();
    const convertMsToDays = (ms: number) => {
      return Math.floor(ms / (1000 * 60 * 60 * 24));
    };
    const totalDays = convertMsToDays(end.getTime() - start.getTime());
    const daysSinceStart = convertMsToDays(today.getTime() - start.getTime());
    const percentageCompleted = Math.floor(daysSinceStart / totalDays) * 100;

    // forcing max percentage to 100
    return percentageCompleted > 100 ? 100 : percentageCompleted;
  }, [intent]);

  useEffect(() => {
    setProgress(calculateProgress());
  }, [calculateProgress]);

  return (
    <div key={intent.id} className="flex border-b py-4">
      <div className="flex w-full flex-col">
        <AimViewById aimId={intent.aimId} />
        <Progress value={progress} />
        <div className="gap-y-4 pl-2">
          <div className="text-md mt-3 flex flex-col gap-x-2">
            {/* <span>From {startDate}</span>
            <span>Until {endDate}</span> */}
            {intent.notes && <span>Notes: {intent.notes}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
