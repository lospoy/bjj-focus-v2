// JitView
// Handles displaying a single Jit

// Used in:
// ~/jitFeed

import type { RouterOutputs } from "~/utils/api";
type Jit = RouterOutputs["jits"]["getAll"][number];

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { QuestionMarkIcon } from "@radix-ui/react-icons";

export const JitView = (props: { jit: Jit; isSelected: boolean }) => {
  const { jit } = props;

  return (
    <Card key={jit.id} className="relative mb-9">
      <div className="flex h-[90px]">
        {/* Add the interrogation mark icon */}
        <div className="absolute -left-2 -top-2 flex bg-white p-1">
          <QuestionMarkIcon className="h-5 w-5" />
          <QuestionMarkIcon className="-ml-2 h-4 w-4" />
        </div>
        <CardHeader className="w-8/12 p-0 pl-6">
          <div className="mt-3 flex h-full flex-col justify-center -space-y-1">
            <CardTitle className="-mt-2 text-2xl leading-5">
              {jit.name}
            </CardTitle>
            <CardDescription className="text-xl">
              {jit.position.name}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="w-4/12 p-0">
          <div className="flex h-full flex-col justify-center space-y-0 pr-6 text-right">
            <a>
              <Badge variant="outline">{jit.category}</Badge>
            </a>
            <a>
              <Badge variant="outline">{jit.percentage} %</Badge>
            </a>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex h-0 items-start justify-center">
        <Button className="mt-1 bg-accent font-mono font-semibold">
          ACTIVATE
        </Button>
      </CardFooter>
    </Card>
  );
};
