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
    <Card
      className={`mb-2 ${isSelected ? "bg-green-200" : "bg-white"}`}
      key={aim.id}
    >
      <CardHeader>
        <CardTitle>{aim.title}</CardTitle>
        <CardDescription>{aim.notes}</CardDescription>
      </CardHeader>
    </Card>
  );
};
