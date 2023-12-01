// InactiveJitview
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
import { EyeIcon } from "lucide-react";

export const InactiveJitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const ctx = api.useUtils();

  const [buttonState, setButtonState] = useState<
    "ACTIVATE" | "CONFIRM ACTIVATION" | "ACTIVATING"
  >("ACTIVATE");

  const { mutate, isLoading: isSaving } = api.activeJits.create.useMutation();

  const handleButtonClick = () => {
    if (buttonState === "ACTIVATE") {
      setButtonState("CONFIRM ACTIVATION");
    } else if (buttonState === "CONFIRM ACTIVATION") {
      setButtonState("ACTIVATING");

      try {
        mutate({ jitId: jit.id });
        // If mutate succeeds, update UI and invalidate the data
        void ctx.activeJits.getAllKnownByThisUser.invalidate();
        toast.success("Jit activated successfully");
        setButtonState("ACTIVATE");
      } catch (e: unknown) {
        if (isZodError(e)) {
          const errorMessage = e.fieldErrors.title;
          if (errorMessage?.[0]) {
            toast.error(errorMessage[0]);
          } else {
            toast.error("Failed to activate. Please try again later.");
          }
        } else {
          toast.error("Failed to activate. Please try again later.");
        }
        setButtonState("ACTIVATE");
      }
    }
  };

  // Type guard for ZodError
  function isZodError(
    obj: unknown,
  ): obj is { fieldErrors: { title?: string[] } } {
    return typeof obj === "object" && obj !== null && "fieldErrors" in obj;
  }

  return (
    <Card key={jit.id} className="relative mb-9">
      <div className="flex h-[90px]">
        <div className="absolute -left-2 -top-2 flex bg-white p-1">
          <QuestionMarkIcon className="h-4 w-4" />
          <QuestionMarkIcon className="-ml-2 h-3 w-3" />
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
          <div className="-mt-1 flex h-full flex-col justify-center -space-y-1 pr-6 text-right">
            <a>
              <Badge variant="outline" className="text-[9px]">
                {jit.category}
              </Badge>
            </a>
            <a>
              <Badge variant="outline" className="text-[9px]">
                {jit.percentage} %
              </Badge>
            </a>
          </div>
        </CardContent>
      </div>
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
          <EyeIcon className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};
