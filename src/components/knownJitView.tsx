// KnownJitView
// Handles displaying a single KnownJit

// Used in:
// ~/knownJitFeed

import { api, type RouterOutputs } from "~/utils/api";
import { JitViewById } from "./jitViewById";
import { useCallback, useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card } from "./ui/card";

type KnownJitWithCreator = RouterOutputs["knownJits"]["getKnownJitsByUserId"][number];

export const KnownJitView = (props: KnownJitWithCreator) => {
  const { knownJit } = props;
  const { mutateAsync } = api.knownJits.softDelete.useMutation();

  const [progress, setProgress] = useState(5);

  const startDate = knownJit.startDate.toLocaleDateString();
  const endDate = knownJit.endDate.toLocaleDateString();
  const dates = `${startDate} - ${endDate}`;

  async function handleDeleteClick() {
    try {
      console.warn("Soft Delete successful");
      await mutateAsync({ id: knownJit.id });
    } catch (error) {
      console.error("Error during soft delete:", error);
    }
  }

  const calculateProgress = useCallback(() => {
    // Calculates how far along this knownJit the user is based on daysSinceStart/totalDays
    // Will be changed in the future, this is a simplistic approach
    const start = knownJit.startDate;
    const end = knownJit.endDate;
    const today = new Date();
    const convertMsToDays = (ms: number) => {
      return Math.floor(ms / (1000 * 60 * 60 * 24));
    };
    const totalDays = convertMsToDays(end.getTime() - start.getTime());
    const daysSinceStart = convertMsToDays(today.getTime() - start.getTime());
    const percentageCompleted = Math.floor((daysSinceStart / totalDays) * 100);

    // forcing max percentage to 100
    return percentageCompleted > 100 ? 100 : percentageCompleted;
  }, [knownJit]);

  useEffect(() => {
    setProgress(calculateProgress());
  }, [calculateProgress]);

  return (
    <Card key={knownJit.id} className="flex">
      <div className="flex w-full flex-col">
        <Dialog>
          <DialogTrigger>
            <div className="flex flex-col">
              <Progress
                value={progress}
                className="-mb-2 rounded-xl rounded-b-none"
              />
              <div className="p-3">
                <JitViewById jitId={knownJit.jitId} />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <JitViewById jitId={knownJit.jitId} />
              <Progress
                value={progress}
                id="progress"
                className="h-5 rounded-md"
              />
            </DialogHeader>
            <div className="gap-4 py-4">
              <div className="mb-3 space-y-1">
                <Label htmlFor="reminders">Reminders</Label>
                <Input
                  id="reminders"
                  autoFocus={false}
                  defaultValue={
                    knownJit.reminders
                      ? JSON.stringify(knownJit.reminders)
                      : "no reminders"
                  }
                />
              </div>
              <div className="mb-3 space-y-1">
                <Label htmlFor="dates">Dates</Label>
                <Input id="dates" autoFocus={false} defaultValue={dates} />
              </div>
              {knownJit.notes && (
                <div className="mb-3 space-y-1">
                  <Label htmlFor="Notes">Notes</Label>
                  <Input id="Notes" defaultValue={knownJit.notes} />
                </div>
              )}
            </div>
            <DialogFooter>
              {knownJit.status !== "COMPLETED" && (
                <Button
                  className="w-2/5 self-center"
                  onClick={handleDeleteClick}
                  variant="destructive"
                >
                  Delete KnownJit
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
