// JitFeed
// Handles displaying all Jits (known and unknown)

// Used in:
// ~../pages/index

import { LoadingPage } from "~/components/ui/loading";
import { api } from "~/utils/api";
import { FullJitView } from "./FullJitView";

export const FullJitFeed = () => {
  const { data, isLoading: jitsLoading } = api.jits.getAll.useQuery();

  if (jitsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((jitWithPosition) => (
        <div key={jitWithPosition.id}>
          <FullJitView jit={jitWithPosition} />
        </div>
      ))}
    </div>
  );
};
