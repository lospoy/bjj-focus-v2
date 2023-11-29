// JitFeed
// Handles displaying all Jits (known and unknown)

// Used in:
// ~../pages/index

import { useRouter } from "next/router";
import { LoadingPage } from "~/components/ui/loading";
import { JitView } from "./jitView";
import { api } from "~/utils/api";
import { useState } from "react";

export const JitFeed = () => {
  const router = useRouter();
  const { data, isLoading: jitsLoading } = api.jits.getAll.useQuery();
  const [selectedJitId, setSelectedJitId] = useState<string>();

  const handleJitClick = (jitId: string) => {
    setSelectedJitId(jitId);
  };

  if (jitsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((jitWithPosition) => (
        <div
          key={jitWithPosition.id}
          onClick={() => handleJitClick(jitWithPosition.id)}
        >
          <JitView
            jit={jitWithPosition}
            isSelected={selectedJitId === jitWithPosition.id}
          />
        </div>
      ))}
    </div>
  );
};
