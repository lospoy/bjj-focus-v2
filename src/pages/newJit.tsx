import { type NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/ui/layout";
import { JitCreator } from "~/components/JitCreator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const NewJit: NextPage = () => {
  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  api.categories.getAll.useQuery().data;
  api.positions.getAll.useQuery().data;
  api.moves.getAll.useQuery().data;

  return (
    <PageLayout>
      <Card className="mt-[15vh] h-[50vh]">
        <CardHeader className="flex items-center pb-8">
          <CardTitle className="flex text-2xl">New Jit</CardTitle>
        </CardHeader>
        <CardContent>
          <JitCreator />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default NewJit;
