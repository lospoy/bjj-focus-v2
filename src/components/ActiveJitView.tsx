// ActiveJitView
// Handles displaying a single Active Jit

// Used in:
// ~/FullJitFeed

import { api, type RouterOutputs } from "~/utils/api";
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
import { Icons } from "./ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ActiveJitWithPosition =
  RouterOutputs["activeJits"]["getAllKnownByThisUser"][number];

export const ActiveJitView = (props: { activeJit: ActiveJitWithPosition }) => {
  const { activeJit } = props;
  const ctx = api.useUtils();
  const { mutate, isLoading: isSaving } =
    api.activeJits.updateByJitId.useMutation();

  const renderEyeIcons = () => {
    const eyes = [];
    const hitRolling = activeJit.hitRolling;

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

  // The function increases updatedLevel based on hitRolling
  //    with a somewhat direct relationship at the beginning
  //    the ratio then tapers off as hitRolling gets bigger
  const calculateUpdatedLevel = (hitRolling: number) => {
    if (hitRolling <= 0) {
      return 7;
    } else if (hitRolling >= 15) {
      return 32;
    } else {
      return [7, 12, 15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32][
        Math.floor(hitRolling)
      ];
    }
  };

  // hitRolling should always increase by 1
  // e.g. if hitRolling is 3, the function will return 4
  const getNextHitRollingValue = (currentValue: number | undefined) =>
    currentValue !== undefined ? currentValue + 1 : undefined;

  const handleHitRollingClick = () => {
    const preUpdateHitRollingValue = activeJit.hitRolling;

    try {
      mutate({
        jitId: activeJit.jitId,
        hitRolling: getNextHitRollingValue(preUpdateHitRollingValue),
        level: calculateUpdatedLevel(preUpdateHitRollingValue),
      });
      // If mutate succeeds, update UI and invalidate the data
      setTimeout(() => {
        void ctx.activeJits.getAllKnownByThisUser.invalidate();
      }, 2000);

      toast.info("🦄 HIT ROLLING", {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (e: unknown) {
      toast.error("Failed to update. Please try again later.");
    }
  };

  // Formats numbers to always be XXX
  // Example: formats 4 to 004
  function formatNumber(num: number): string {
    return num < 10 ? `00${num}` : num < 100 ? `0${num}` : num.toString();
  }

  return (
    <Card key={activeJit.jitId} className="relative mb-9 bg-inherit pl-4">
      <div className="flex h-[90px]">
        <div className="absolute -left-2 -top-4 flex bg-gray-50 px-2 py-1">
          <span className="h-4 font-serif text-sm">#</span>
          <span className="text-md h-5 font-mono">
            {formatNumber(activeJit.jit.uniqueNumber)}
          </span>
        </div>
        <CardHeader className="w-8/12 p-0 ">
          <div className="mt-3 flex h-full flex-col justify-center -space-y-1">
            <CardTitle className="-mt-2 text-2xl leading-5">
              {activeJit.jit.name}
            </CardTitle>
            <CardDescription className="text-lg">
              <span className="pr-0.5 text-xs">from</span>
              {activeJit.jit.position.name}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="w-4/12 p-0">
          <div className="-mt-1 flex h-full flex-col justify-center -space-y-1 pr-6 text-right">
            <a>
              <Badge variant="outline" className="text-[10px]">
                {activeJit.jit.category}
              </Badge>
            </a>
            <a>
              <Badge variant="outline" className="text-[10px]">
                {activeJit.jit.percentage} %
              </Badge>
            </a>
          </div>
        </CardContent>
      </div>

      <CardFooter className="h-16 items-start justify-center p-0">
        <div className="flex w-8/12">
          <div>
            <button
              onClick={handleHitRollingClick}
              className="font-mono text-xs"
            >
              hit rolling
            </button>
            <button
              onClick={handleHitRollingClick}
              className="flex flex-row space-x-2"
            >
              {renderEyeIcons()}
            </button>
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
          </div>
        </div>
        <div className="flex w-4/12 justify-end pr-6">
          <span className="pr-0.5 text-5xl">{activeJit.level}</span>
          <span className="self-center text-5xl font-thin">/</span>
          <span className="-mb-1 -ml-1.5 self-end font-serif text-xl">100</span>
        </div>
      </CardFooter>
    </Card>
  );
};
