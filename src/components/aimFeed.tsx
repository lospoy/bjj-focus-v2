// AimFeed
// Handles displaying all Aims

// Used in:
// ~../pages/index

import { useRouter } from "next/router";
import { LoadingPage } from "~/components/loading";
import { AimView } from "./aimView";
import { api } from "~/utils/api";

export const AimFeed = () => {
  const router = useRouter();
  const { data, isLoading: aimsLoading } = api.aims.getAll.useQuery();

  if (aimsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  const handleClick = async (aimId: string) => {
    // Construct the URL with the aimId as a slug
    const url = `/intentWizard?aimId=${aimId}`;

    // Navigate to the IntentWizard page with the aimId in the URL
    await router.push(url);
  };

  return (
    <div className="flex flex-col">
      {data?.map((fullAim) => (
        <div key={fullAim.aim.id} onClick={() => handleClick(fullAim.aim.id)}>
          <AimView {...fullAim} />
        </div>
      ))}
    </div>
  );
};
