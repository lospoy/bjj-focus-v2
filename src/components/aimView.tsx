// AimView
// Handles displaying a single Aim

// Used in:
// ~/aimFeed

import type { RouterOutputs } from "~/utils/api";
type AimWithUser = RouterOutputs["aims"]["getAll"][number];

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const AimView = (props: AimWithUser & { isSelected: boolean }) => {
  const { aim, isSelected } = props;

  return (
    <div
      className={`rounded-3xl border-8 ${
        isSelected
          ? "border-secondary bg-secondary"
          : "border-solid border-transparent"
      }`}
    >
      <Card key={aim.id}>
        <CardHeader className="space-y-0">
          <CardTitle className="text-xl">{aim.title}</CardTitle>
          <CardDescription>{aim.notes}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
