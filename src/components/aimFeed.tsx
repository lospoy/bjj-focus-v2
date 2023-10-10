// AimFeed
// Handles displaying all Aims

// Currently also has a next button as this is part of the IntentWizard process
// Should be separated in the future so that it ONLY displays aims

// Used in:
// ~../pages/index

import { useRouter } from "next/router";
import { LoadingPage } from "~/components/ui/loading";
import { AimView } from "./aimView";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { useState } from "react";

export const AimFeed = () => {
  const router = useRouter();
  const { data, isLoading: aimsLoading } = api.aims.getAll.useQuery();
  const [selectedAimId, setSelectedAimId] = useState<string>();

  const handleAimClick = (aimId: string) => {
    setSelectedAimId(aimId);
  };

  // Function to construct and navigate to the URL with the selected aimId
  const handleNextClick = async () => {
    const url = `/intent/${selectedAimId}`;
    await router.push(url);
  };

  if (aimsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullAim) => (
        <div
          key={fullAim.aim.id}
          onClick={() => handleAimClick(fullAim.aim.id)}
        >
          <AimView {...fullAim} isSelected={selectedAimId === fullAim.aim.id} />
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
