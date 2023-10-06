// IntentFeed
// Handles displaying all Intents

// Used in:
// ~../pages/index

import { LoadingPage } from "~/components/ui/loading";
import { IntentView } from "./intentView";
import { api } from "~/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const IntentFeed = () => {
  const { data, isLoading: intentsLoading } = api.intents.getAll.useQuery();

  const activeIntents = data?.filter(
    (intent) => intent.intent.status === "ACTIVE",
  );
  const completedIntents = data?.filter(
    (intent) => intent.intent.status === "COMPLETED",
  );

  if (intentsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <Tabs defaultValue="active">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
            <CardDescription>
              These are the intents you are currently working on.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col">
              {activeIntents?.map((fullIntent) => (
                <IntentView {...fullIntent} key={fullIntent.intent.id} />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="completed">
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>These are your completed intents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col">
              {completedIntents?.map((fullIntent) => (
                <IntentView {...fullIntent} key={fullIntent.intent.id} />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
