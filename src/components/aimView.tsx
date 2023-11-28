// JitView
// Handles displaying a single Jit

// Used in:
// ~/jitFeed

import type { RouterOutputs } from "~/utils/api";
type JitWithUser = RouterOutputs["jits"]["getAll"][number];

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const JitView = (props: JitWithUser & { isSelected: boolean }) => {
  const { jit, isSelected } = props;

  return (
    <div
      className={`rounded-3xl border-8 ${
        isSelected
          ? "border-secondary bg-secondary"
          : "border-solid border-transparent"
      }`}
    >
      <Card key={jit.id}>
        <CardHeader className="space-y-0">
          <CardTitle className="text-xl">{jit.title}</CardTitle>
          <CardDescription>{jit.notes}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
