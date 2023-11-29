// KnownJitView
// Handles displaying a single KnownJit

// Used in:
// ~/knownJitFeed

import type {  RouterOutputs } from "~/utils/api";
import { JitViewById } from "./jitViewById";
import { useState } from "react";
import { Progress } from "~/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card } from "./ui/card";

type KnownJit = RouterOutputs["knownJits"]["getAllKnownByThisUser"][number];

export const KnownJitView = (props: KnownJit) => {
  const  knownJit  = props;
  const [progress, setProgress] = useState(5);

  return (
    <Card key={knownJit.jitId} className="flex">
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
                <Label htmlFor="dates">Dates</Label>
                <Input id="dates" autoFocus={false} />
              </div>
              {knownJit.notes && (
                <div className="mb-3 space-y-1">
                  <Label htmlFor="Notes">Notes</Label>
                  <Input id="Notes" defaultValue={knownJit.notes} />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};
