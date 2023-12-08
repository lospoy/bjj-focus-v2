// JitView
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

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const ctx = api.useUtils();
  const { mutate, isLoading: isSaving } = api.sessions.create.useMutation();

  const renderEyeIcons = () => {
    const eyes = [];
    const sessionCount = jit.sessionCount;

    console.log("sessionCount", sessionCount);

    // sessionCount values between 0 and 5 will open the eyes one by one
    if (sessionCount <= 5) {
      for (let i = 0; i < 5; i++) {
        i < sessionCount
          ? eyes.push(<Icons.eyeHalf key={i} className={`h-5 w-5`} />)
          : eyes.push(<EyeClosedIcon key={i} className={`h-5 w-5`} />);
      }
    }
    // sessionCount values between 6 and 10 will modify the opened eyes one by one
    if (sessionCount >= 6) {
      for (let i = 5; i < 10; i++) {
        i < sessionCount
          ? eyes.push(
              <Icons.eyeFull key={i} className={`h-5 w-5 fill-accent`} />,
            )
          : eyes.push(<Icons.eyeHalf key={i} className={`h-5 w-5`} />);
      }
    }
    // sessionCount values between 11 and 15 will modify the opened eyes one by one
    // if (sessionCount >= 11) {
    //   for (let i = 10; i < 15; i++) {
    //     i < sessionCount
    //       ? eyes.push(<Icons.cherryCustom key={i} className={`h-5 w-5`} />)
    //       : eyes.push(
    //           <Icons.eyeFull key={i} className={`h-5 w-5 fill-accent`} />,
    //         );
    //   }
    // }
    return eyes;
  };

  // The function increases updatedLevel based on sessionCount
  //    with a somewhat direct relationship at the beginning
  //    the ratio then tapers off as sessionCount gets bigger
  const calculateBelt = (sessionCount: number) => {
    if (sessionCount <= 0) {
      return 7;
    } else if (sessionCount >= 15) {
      return 32;
    } else {
      return [7, 12, 15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32][
        Math.floor(sessionCount)
      ];
    }
  };

  const handleHitRollingClick = () => {
    try {
      mutate({
        jitId: jit.id,
      });
      // If mutate succeeds, update UI and invalidate the data
      setTimeout(() => {
        void ctx.jits.getAll.invalidate();
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

  return (
    <Card key={jit.id} className="relative mb-9 bg-inherit pl-4">
      <div className="flex h-[90px]">
        <div className="absolute -left-2 -top-4 flex bg-gray-50 px-2 py-1">
          <span className="h-4 font-serif text-sm">#</span>
        </div>
        <CardHeader className="w-8/12 p-0 ">
          <div className="mt-3 flex h-full flex-col justify-center -space-y-1">
            <CardTitle className="-mt-2 text-2xl leading-5">
              {jit.category?.name}
            </CardTitle>
            <CardDescription className="text-lg">
              <span className="pr-0.5 text-xs">from</span>
              {jit.position?.name}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="w-4/12 p-0">
          <div className="-mt-1 flex h-full flex-col justify-center -space-y-1 pr-6 text-right">
            <a>
              <Badge variant="outline" className="text-[10px]">
                {jit.category?.name}
              </Badge>
            </a>
            <a>
              <Badge variant="outline" className="text-[10px]">
                curriculum
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
          <span className="pr-0.5 text-5xl">belt level</span>
          <span className="pr-0.5 text-5xl">
            {calculateBelt(jit.sessionCount)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
