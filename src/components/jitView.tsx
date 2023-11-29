// JitView
// Handles displaying a single Jit

// Used in:
// ~/jitFeed

import type { RouterOutputs } from "~/utils/api";
type Jit = RouterOutputs["jits"]["getAll"][number];

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const JitView = (props: Jit & { isSelected: boolean }) => {
  const { id, name, isSelected, position } = props;

  return (
    <div
      className={`rounded-3xl border-8 ${
        isSelected
          ? "border-secondary bg-secondary"
          : "border-solid border-transparent"
      }`}
    >
      <Card key={id}>
        <CardHeader className="space-y-0">
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>{position.name}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
