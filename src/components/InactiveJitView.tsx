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
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

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
        toast.info("JIT ACTIVATED", {
          position: "bottom-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setButtonState("ACTIVATE");
      } catch (e: unknown) {
        setButtonState("ACTIVATE");
      }
    }
  };

  return (
    <Card key={jit.id} className="relative mb-9 bg-inherit">
      <div className="bg- flex h-[90px] ">
        <div className="absolute -left-2 -top-2 flex bg-gray-50 p-1 ">
          <QuestionMarkIcon className="h-4 w-4 opacity-30" />
          <QuestionMarkIcon className="-ml-2 h-3 w-3 opacity-30" />
        </div>
        <CardHeader className="w-8/12 p-0 pl-6 opacity-30">
          <div className="mt-3 flex h-full flex-col justify-center -space-y-1">
            <CardTitle className="-mt-2 text-2xl leading-5">
              {jit.name}
            </CardTitle>
            <CardDescription className="text-lg">
              <span className="pr-0.5 text-xs ">from</span>
              {jit.position.name}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="w-4/12 p-0 opacity-30">
          <div className="-mt-1 flex h-full flex-col justify-center -space-y-1 pr-6 text-right">
            <a>
              <Badge variant="outline" className="text-[10px]">
                {jit.category}
              </Badge>
            </a>
            <a>
              <Badge variant="outline" className="text-[10px]">
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
        </Button>
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CardFooter>
    </Card>
  );
};
