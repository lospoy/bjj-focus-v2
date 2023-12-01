// FullJitFeed
// Handles displaying all Jits (known and unknown)

// Used in:
// ~../pages/index
import { api } from "~/utils/api";
import { ActiveJitView } from "./ActiveJitView";
import { InactiveJitView } from "./InactiveJitView";

export const FullJitFeed = () => {
  const allJits = api.jits.getAll.useQuery().data;
  const allActiveJits = api.activeJits.getAllKnownByThisUser.useQuery().data;

  if (!allJits) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {/* Render ActiveJitViews first */}
      {allActiveJits?.map((activeJit) => (
        <div key={activeJit.jitId}>
          <ActiveJitView activeJit={activeJit} />
        </div>
      ))}
      {/* Render InactiveJitViews after ActiveJitViews */}
      {allJits.map((jit) => (
        <div key={jit.id}>
          <InactiveJitView jit={jit} />
        </div>
      ))}
    </div>
  );
};
