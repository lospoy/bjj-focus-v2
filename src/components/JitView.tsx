// JitView
// Handles displaying a single Active Jit

// Used in:
// ~/FullJitFeed

import { api, type RouterOutputs } from "~/utils/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { Icons } from "./ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookmarkIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Belt } from "./ui/belt";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const ctx = api.useUtils();
  const addSession = api.sessions.create.useMutation();
  const updateJit = api.jits.updateById.useMutation();

  // Returns human-readable date based on the difference between the current date and the date passed in
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) {
      return "Unknown";
    }

    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 1) {
      return "yesterday";
    } else if (daysDiff === 0) {
      return "today";
    } else if (daysDiff < 30) {
      return `${daysDiff} days ago`;
    } else if (daysDiff < 365) {
      const months = Math.floor(daysDiff / 30);
      const remainingDays = daysDiff % 30;
      return `${months} months ${remainingDays} days ago`;
    } else {
      return "over a year ago";
    }
  };

  const renderEyeIcons = () => {
    const eyes = [];
    const sessionCount = jit.sessionCount;

    // sessionCount values between 0 and 5 will open the eyes one by one
    if (sessionCount <= 5) {
      for (let i = 0; i < 5; i++) {
        i < sessionCount
          ? eyes.push(<Icons.eyeHalf key={i} className={`h-6 w-6`} />)
          : eyes.push(<EyeClosedIcon key={i} className={`h-6 w-6`} />);
      }
    }
    // sessionCount values between 6 and 10 will modify the opened eyes one by one
    if (sessionCount >= 6) {
      for (let i = 5; i < 10; i++) {
        i < sessionCount
          ? eyes.push(
              <Icons.eyeFull key={i} className={`h-6 w-6 fill-accent`} />,
            )
          : eyes.push(<Icons.eyeHalf key={i} className={`h-6 w-6`} />);
      }
    }
    // sessionCount values over 10 will return one eye
    if (sessionCount > 10) {
      eyes.length = 0;
      eyes.push(
        <Icons.eyeFull key={"just me luv"} className={`ml-1 h-4 w-4`} />,
      );
    }

    return eyes;
  };

  const calculateAndRenderBelt = (sessionCount: number) => {
    let numberOfStripes = 0;
    let beltColor: "white" | "blue" = "white";

    if (sessionCount === 2) {
      numberOfStripes = 1;
    } else if (sessionCount >= 3 && sessionCount < 5) {
      numberOfStripes = 2;
    } else if (sessionCount >= 5 && sessionCount < 7) {
      numberOfStripes = 3;
    } else if (sessionCount >= 7 && sessionCount < 10) {
      numberOfStripes = 4;
    } else if (sessionCount >= 10) {
      numberOfStripes = 0;
      beltColor = "blue";
    }

    return (
      <Belt
        className="z-10 -mr-1 h-8 w-full rounded-sm drop-shadow-lg"
        numberOfStripes={numberOfStripes}
        beltColor={beltColor}
      />
    );
  };

  const handleAddSessionClick = () => {
    try {
      addSession.mutate({
        jitId: jit.id,
      });
      // If mutate succeeds, update UI and invalidate the data
      setTimeout(() => {
        void ctx.jits.getAll.invalidate();
      }, 2000);

      if (jit.sessionCount <= 10) {
        toast.success("+1 HIT ROLLING", {
          position: "bottom-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      if (jit.sessionCount > 10) {
        toast.info("SESSION ADDED", {
          position: "bottom-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (e: unknown) {
      toast.error("Failed to add session. Please try again later.");
    }
  };

  const handleFavoriteClick = () => {
    try {
      updateJit.mutate({
        id: jit.id,
        isFavorite: !jit.isFavorite,
      });
      // If mutate succeeds, update UI and invalidate the data
      setTimeout(() => {
        void ctx.jits.getAll.invalidate();
      }, 2000);
    } catch (e: unknown) {
      toast.error("Failed to update. Please try again later.");
    }
  };

  return (
    <Card key={jit.id} className="relative mb-8 bg-inherit pl-3">
      <CardHeader className="mb-8 flex flex-row p-0 pt-2">
        {/* TITLE */}
        <CardTitle className="flex w-11/12 flex-col text-2xl leading-5">
          {/* CATEGORY & MOVE & POSITION */}
          {jit.category && jit.position && jit.move && (
            <>
              <span className="text-sm">{jit.category.name}</span>
              <span>{jit.move.name}</span>
              <span className="text-sm">from {jit.position.name}</span>
            </>
          )}
          {/* CATEGORY & POSITION */}
          {jit.category && jit.position && !jit.move && (
            <>
              <span className="text-sm">any {jit.category.name}</span>
              <span>from {jit.position.name}</span>
            </>
          )}
          {/* CATEGORY & MOVE */}
          {jit.category && !jit.position && jit.move && (
            <>
              <span className="text-sm">{jit.category.name}</span>
              <span>{jit.move.name}s</span>
            </>
          )}
          {/* POSITION */}
          {!jit.category && jit.position && !jit.move && (
            <>
              <span>{jit.position.name}</span>
            </>
          )}
          {/* MOVE */}
          {!jit.category && !jit.position && jit.move && (
            <>
              <span>{jit.move.name}s</span>
            </>
          )}
        </CardTitle>
        {/* FAVORITE / BOOKMARK */}
        <div className="flex w-1/12 flex-col">
          <button onClick={handleFavoriteClick}>
            {jit.isFavorite ? (
              <BookmarkIcon
                fill="currentColor"
                className="h-5 w-5 text-blue-800"
              />
            ) : (
              <BookmarkIcon className="h-5 w-5 text-blue-800" />
            )}
          </button>
        </div>
      </CardHeader>

      {/* NOTES */}
      <CardContent className="mb-8 flex p-0">
        <ul className="flex flex-col">
          <li className="font-mono text-xs">
            Consectetur adipisicing elit. Placeat in.
          </li>
          <li className="font-mono text-xs">
            Maxime ipsa omnis provident adipisci sunt ullam.
          </li>
        </ul>
      </CardContent>

      {/* SESSIONS & BELT */}
      <CardContent className="flex h-16 p-0">
        {/* SESSIONS */}
        {jit.sessionCount <= 10 ? (
          <div className="flex w-6/12 flex-col">
            <h3 className="-mb-1 font-mono text-xs">hit rolling</h3>
            <span className="flex space-x-1.5">{renderEyeIcons()}</span>
          </div>
        ) : (
          <div className="flex w-6/12 flex-col ">
            <div className="flex flex-row">
              <Badge className="font-mono text-xs text-accent">
                hit rolling: {renderEyeIcons()}
              </Badge>
            </div>
          </div>
        )}

        {/* BELT */}
        <div className="flex w-6/12 justify-end">
          {calculateAndRenderBelt(jit.sessionCount)}
        </div>
      </CardContent>

      {/* BUTTON */}
      <CardFooter className="flex h-0 items-start justify-center">
        <Button
          onClick={handleAddSessionClick}
          className="mt-1 h-8 font-mono font-semibold"
        >
          {jit.sessionCount <= 10 ? (
            <span>HIT ROLLING</span>
          ) : (
            <span>ADD SESSION</span>
          )}
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
