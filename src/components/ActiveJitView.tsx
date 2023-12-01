// ActiveJitView
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
import { EyeClosedIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { Icons } from "./ui/icons";

type ActiveJit = RouterOutputs["activeJits"]["getByJitId"];

export const ActiveJitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const ctx = api.useUtils();
  const { mutate, isLoading: isSaving } =
    api.activeJits.updateByJitId.useMutation();

  const activeJitQuery = api.activeJits.getByJitId.useQuery({ id: jit.id });
  const activeJit: ActiveJit | undefined = activeJitQuery.data;

  const renderEyeIcons = () => {
    const eyes = [];
    const hitRolling = activeJit!.hitRolling;

    // hitRolling values between 0 and 5 will open the eyes one by one
    if (hitRolling <= 5) {
      for (let i = 0; i < 5; i++) {
        i < hitRolling
          ? eyes.push(<Icons.eyeHalf key={i} className={`h-5 w-5`} />)
          : eyes.push(<EyeClosedIcon key={i} className={`h-5 w-5`} />);
      }
    }
    // hitRolling values between 6 and 10 will modify the opened eyes one by one
    if (hitRolling >= 6) {
      for (let i = 5; i < 10; i++) {
        i < hitRolling
          ? eyes.push(
              <Icons.eyeFull key={i} className={`h-5 w-5 fill-accent`} />,
            )
          : eyes.push(<Icons.eyeHalf key={i} className={`h-5 w-5`} />);
      }
    }
    // hitRolling values between 11 and 15 will modify the opened eyes one by one
    // if (hitRolling >= 11) {
    //   for (let i = 10; i < 15; i++) {
    //     i < hitRolling
    //       ? eyes.push(<Icons.cherryCustom key={i} className={`h-5 w-5`} />)
    //       : eyes.push(
    //           <Icons.eyeFull key={i} className={`h-5 w-5 fill-accent`} />,
    //         );
    //   }
    // }
    return eyes;
  };

  const handleButtonClick = () => {
    const getNextHitRollingValue = (currentValue: number | undefined) =>
      currentValue !== undefined ? currentValue + 1 : undefined;

    if (false) {
    } else if (true) {
      try {
        mutate({
          jitId: jit.id,
          hitRolling: getNextHitRollingValue(activeJit!.hitRolling),
        });
        // If mutate succeeds, update UI and invalidate the data
        void ctx.activeJits.getAllKnownByThisUser.invalidate();
        toast.success("HIT ROLLING!!");
      } catch (e: unknown) {
        if (isZodError(e)) {
          const errorMessage = e.fieldErrors.title;
          if (errorMessage?.[0]) {
            toast.error(errorMessage[0]);
          } else {
            toast.error("Failed to update. Please try again later.");
          }
        } else {
          toast.error("Failed to update. Please try again later.");
        }
      }
    }
  };

  // Type guard for ZodError
  function isZodError(
    obj: unknown,
  ): obj is { fieldErrors: { title?: string[] } } {
    return typeof obj === "object" && obj !== null && "fieldErrors" in obj;
  }

  const calculateLevelAndUpdate = (hitRolling: ActiveJit["hitRolling"]) => {
    let newLevel = 0;

    if (hitRolling === 1) newLevel = 1;
    if (hitRolling === 2) newLevel = 1.5;
    if (hitRolling === 1) newLevel = 1;
    if (hitRolling === 1) newLevel = 1;

    return newLevel;
  };

  // Formats numbers to always be XXX
  // Example: formats 4 to 004
  function formatNumber(num: number): string {
    return num < 10 ? `00${num}` : num < 100 ? `0${num}` : num.toString();
  }

  return (
    <Card key={jit.id} className="relative mb-9 pl-4 ">
      <div className="flex h-[90px]">
        <div className="absolute -left-2 -top-4 flex bg-white px-2 py-1">
          <span className="h-4 font-serif text-sm">#</span>
          <span className="text-md h-5 font-mono">
            {formatNumber(jit.uniqueNumber)}
          </span>
        </div>
        <CardHeader className="w-8/12 p-0 ">
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

      <CardFooter className="h-16 items-start justify-center p-0">
        <div className="flex w-8/12">
          <div>
            <button onClick={handleButtonClick} className="font-mono text-xs">
              hit rolling
            </button>
            <button
              onClick={handleButtonClick}
              className="flex flex-row space-x-2"
            >
              {renderEyeIcons()}
            </button>
          </div>
        </div>
        <div className="flex w-4/12 justify-end pr-6">
          <span className="pr-0.5 text-5xl">{activeJit!.level}</span>
          <span className="self-center text-5xl font-thin">/</span>
          <span className="-mb-1 -ml-1.5 self-end font-serif text-xl">100</span>
        </div>
      </CardFooter>
    </Card>
  );
};
