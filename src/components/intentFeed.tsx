// KnownJitFeed
// Handles displaying all KnownJits

// Used in:
// ~../pages/index

import { LoadingPage } from "~/components/ui/loading";
import { KnownJitView } from "./knownJitView";
import { api } from "~/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const KnownJitFeed = ({ userId }: { userId: string }) => {
  const { data, isLoading: knownJitsLoading } =
    api.knownJits.getKnownJitsByUserId.useQuery({ userId: userId });

  const activeKnownJits = data?.filter(
    (knownJit) => knownJit.knownJit.status === "ACTIVE",
  );
  const completedKnownJits = data?.filter(
    (knownJit) => knownJit.knownJit.status === "COMPLETED",
  );

  if (knownJitsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <Tabs defaultValue="active" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="flex w-full flex-col space-y-4">
        {activeKnownJits?.map((fullKnownJit) => (
          <KnownJitView {...fullKnownJit} key={fullKnownJit.knownJit.id} />
        ))}
      </TabsContent>
      <TabsContent value="completed" className="flex w-full flex-col space-y-4">
        {completedKnownJits?.map((fullKnownJit) => (
          <KnownJitView {...fullKnownJit} key={fullKnownJit.knownJit.id} />
        ))}
      </TabsContent>
    </Tabs>
  );
};
