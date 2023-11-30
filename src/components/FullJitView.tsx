// FullJitView
// Handles displaying a single Jit

// Used in:
// ~/jitFeed

import { api, type RouterOutputs } from "~/utils/api";
type Jit = RouterOutputs["jits"]["getAll"][number];
import { InactiveJitView } from "./InactiveJitView";
import { ActiveJitView } from "./ActiveJitView";

type ActiveJit = RouterOutputs["activeJits"]["getByJitId"];

export const FullJitView = (props: { jit: Jit }) => {
  const { jit } = props;

  const activeJitQuery = api.activeJits.getByJitId.useQuery({ id: jit.id });
  const activeJit: ActiveJit | undefined = activeJitQuery.data;

  return activeJit ? (
    <ActiveJitView jit={jit} />
  ) : (
    <InactiveJitView jit={jit} />
  );
};
