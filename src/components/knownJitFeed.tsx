// KnownJitFeed
// Handles displaying all KnownJits

// Used in:
// ~../pages/index

import { LoadingPage } from "~/components/ui/loading";
import { KnownJitView } from "./knownJitView";
import { api } from "~/utils/api";
import { Card, CardContent } from './ui/card';

export const KnownJitFeed = ({ userId }: { userId: string }) => {
  const { data, isLoading: knownJitsLoading } =
    api.knownJits.getAllKnownByThisUser.useQuery();

  if (knownJitsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
<Card>
      <CardContent className="flex w-full flex-col space-y-4">
        {data.map((fullKnownJit) => (
          <KnownJitView {...fullKnownJit} key={fullKnownJit.jitId} />
        ))}
      </CardContent>
      </Card>

  );
};
