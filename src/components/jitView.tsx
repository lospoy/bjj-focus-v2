// JitView
// Handles displaying a single Jit

// Used in:
// ~/jitFeed

import { api, type RouterOutputs } from "~/utils/api";
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
import toast from "react-hot-toast";
import { useState } from "react";

type ActiveJit = RouterOutputs["activeJits"]["getByJitId"];

export const JitView = (props: { jit: Jit; isSelected: boolean }) => {
  const { jit } = props;
  const ctx = api.useContext();

  const activeJitQuery = api.activeJits.getByJitId.useQuery({ id: jit.id });
  const activeJit: ActiveJit | undefined = activeJitQuery.data;
  console.log("heres your damn QUery", activeJit);

  const [buttonState, setButtonState] = useState<
    "ACTIVATE" | "CONFIRM ACTIVATION" | "ACTIVATING"
  >("ACTIVATE");

  const { mutate, isLoading: isSaving } = api.activeJits.create.useMutation();

  const handleButtonClick = async () => {
    if (buttonState === "ACTIVATE") {
      setButtonState("CONFIRM ACTIVATION");
    } else if (buttonState === "CONFIRM ACTIVATION") {
      setButtonState("ACTIVATING");

      try {
        await mutate({ jitId: jit.id });
        // If mutate succeeds, update UI and invalidate the data
        void ctx.activeJits.getAllKnownByThisUser.invalidate();
        toast.success("Jit activated successfully");
        setButtonState("ACTIVATE");
      } catch (e: any) {
        // If an error occurs, handle it and update UI
        const errorMessage = e.data?.zodError?.fieldErrors.title;
        if (errorMessage?.[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to activate. Please try again later.");
        }
        setButtonState("ACTIVATE");
      }
    }
  };

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

      {activeJit ? (
        // ACTIVE JIT
        <span>active jit</span>
      ) : (
        // INACTIVE JIT
        <CardFooter className="flex h-0 items-start justify-center">
          <Button
            className={`mt-1 font-mono font-semibold
            ${buttonState === "ACTIVATING" ? "bg-green-900" : ""}
            ${buttonState === "CONFIRM ACTIVATION" ? "bg-green-700" : ""}
            ${buttonState === "ACTIVATE" ? "bg-accent" : ""}
          `}
            onClick={handleButtonClick}
            disabled={buttonState === "ACTIVATING"}
          >
            {buttonState}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
