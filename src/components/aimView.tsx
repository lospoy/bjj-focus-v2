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

export const AimView = (props: AimWithUser) => {
  const { aim } = props;

  return (
    <Card className="mb-2" key={aim.id}>
      <CardHeader>
        <CardTitle>{aim.title}</CardTitle>
        <CardDescription>{aim.notes}</CardDescription>
      </CardHeader>
    </Card>
  );
};
