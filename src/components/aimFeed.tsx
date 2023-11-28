// JitFeed
// Handles displaying all Jits

// Currently also has a next button as this is part of the KnownJitWizard process
// Should be separated in the future so that it ONLY displays jits

// Used in:
// ~../pages/index

import { useRouter } from "next/router";
import { LoadingPage } from "~/components/ui/loading";
import { JitView } from "./jitView";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { useState } from "react";

export const JitFeed = () => {
  const router = useRouter();
  const { data, isLoading: jitsLoading } = api.jits.getAll.useQuery();
  const [selectedJitId, setSelectedJitId] = useState<string>();

  const handleJitClick = (jitId: string) => {
    setSelectedJitId(jitId);
  };

  // Function to construct and navigate to the URL with the selected jitId
  const handleNextClick = async () => {
    const url = `/knownJit/${selectedJitId}`;
    await router.push(url);
  };

  if (jitsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullJit) => (
        <div
          key={fullJit.jit.id}
          onClick={() => handleJitClick(fullJit.jit.id)}
        >
          <JitView {...fullJit} isSelected={selectedJitId === fullJit.jit.id} />
        </div>
      ))}
      <Button
        className="mt-3 w-2/5 self-end bg-accent"
        onClick={handleNextClick}
      >
        Next
      </Button>
    </div>
  );
};
