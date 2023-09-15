// AimFeed
// Handles displaying all Aims

// Used in:
// ~../pages/index

import { LoadingPage } from "~/components/loading";
import { AimView } from "./aimView";
import { api } from "~/utils/api";

export const AimFeed = () => {
  const { data, isLoading: aimsLoading } = api.aims.getAll.useQuery();

  if (aimsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullAim) => <AimView {...fullAim} key={fullAim.aim.id} />)}
    </div>
  );
};
