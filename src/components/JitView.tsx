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
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { Icons } from "./ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookmarkIcon, Heart, SaveIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Belt } from "./ui/belt";
import { JitNotesFeed } from "./JitNotesFeed";
import { useState } from "react";
import { Progress } from "./ui/progress";

type Jit = RouterOutputs["jits"]["getAll"][number];
type Note = RouterOutputs["notes"]["getNotesByJitId"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const ctx = api.useUtils();
  const addSession = api.sessions.create.useMutation();
  const updateJit = api.jits.updateById.useMutation();
  const newNote = api.notes.create.useMutation();
  const [inputValue, setInputValue] = useState("");
  const allNotesFromThisJit = api.notes.getNotesByJitId.useQuery({
    jitId: jit.id,
  }).data;
  const favoriteNotes = allNotesFromThisJit?.filter((note) => note.isFavorite);

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

  const renderFavoriteNotes = (favoriteNotes: Note[]) => {
    return favoriteNotes?.map((note) => (
      <li
        key={note.id}
        className="py-.5 flex items-start justify-between rounded-md border-2 border-gray-200/50 px-1 font-mono text-xs"
      >
        {note.body}
        <div className="flex pt-[3px]">
          <Heart fill="currentColor" className="h-3 w-3 text-pink-800" />
        </div>
      </li>
    ));
  };

  function renderJitTitle(jit: Jit) {
    if (jit.category && jit.position && jit.move) {
      return (
        <>
          <span className="text-sm">{jit.category.name}</span>
          <span>{jit.move.name}</span>
          <span className="text-sm">from {jit.position.name}</span>
        </>
      );
    } else if (jit.category && jit.position && !jit.move) {
      return (
        <>
          <span className="text-sm">any {jit.category.name}</span>
          <span>from {jit.position.name}</span>
        </>
      );
    } else if (jit.category && !jit.position && jit.move) {
      return (
        <>
          <span className="text-sm">{jit.category.name}</span>
          <span>{jit.move.name}s</span>
        </>
      );
    } else if (!jit.category && jit.position && !jit.move) {
      return (
        <>
          <span>{jit.position.name}</span>
        </>
      );
    } else if (!jit.category && !jit.position && jit.move) {
      return (
        <>
          <span>{jit.move.name}s</span>
        </>
      );
    }
    return null;
  }

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

  // Min/max represents jit.sessionCount
  const beltRules = [
    { min: 0, max: 0, numberOfStripes: 0, beltColor: "white" },
    { min: 1, max: 2, numberOfStripes: 1, beltColor: "white" },
    { min: 3, max: 4, numberOfStripes: 2, beltColor: "white" },
    { min: 5, max: 7, numberOfStripes: 3, beltColor: "white" },
    { min: 8, max: 10, numberOfStripes: 4, beltColor: "white" },
    { min: 11, max: 13, numberOfStripes: 0, beltColor: "blue" },
    { min: 14, max: 17, numberOfStripes: 1, beltColor: "blue" },
    { min: 18, max: 21, numberOfStripes: 2, beltColor: "blue" },
    { min: 22, max: 25, numberOfStripes: 3, beltColor: "blue" },
    { min: 26, max: 29, numberOfStripes: 4, beltColor: "blue" },
    { min: 30, max: Infinity, numberOfStripes: 0, beltColor: "purple" },
  ];

  const renderJitBelt = (sessionCount: number) => {
    let numberOfStripes: number;
    let beltColor: "white" | "blue" | "purple" | "brown" | "black";

    const rule = beltRules.find(
      (r) => sessionCount >= r.min && sessionCount <= r.max,
    );

    if (rule) {
      numberOfStripes = rule.numberOfStripes;
      beltColor = rule.beltColor as
        | "white"
        | "blue"
        | "purple"
        | "brown"
        | "black";

      return (
        <Belt
          className=" -mr-1 h-8 w-[210px] rounded-sm drop-shadow-lg"
          numberOfStripes={numberOfStripes}
          beltColor={beltColor}
        />
      );
    }
  };

  const renderJitProgress = (sessionCount: number) => {
    const rule = beltRules.find(
      (r) => sessionCount >= r.min && sessionCount <= r.max,
    );

    if (rule) {
      let progressBarValue = 0;
      const levelSteps = rule.max - rule.min + 1;
      const completedSteps = sessionCount - rule.min;

      if (sessionCount === 0) {
        progressBarValue = 5;
      } else {
        progressBarValue = Math.max(
          5,
          Math.min(100, (completedSteps / levelSteps) * 100),
        );
      }

      return (
        <>
          <Progress
            value={progressBarValue}
            className="w-10/12 bg-primary/20"
            indicatorClassName="bg-primary/80"
          />
        </>
      );
    }
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

  const handleNewNoteInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  const handleSaveNewNoteClick = () => {
    try {
      newNote.mutate({
        jitId: jit.id,
        body: inputValue,
      });
      // If mutate succeeds, update UI and invalidate the data
      setTimeout(() => {
        void ctx.notes.getNotesByJitId.invalidate();
      }, 2000);
    } catch (e: unknown) {
      toast.error("Failed to create new note. Please try again later.");
    }
  };

  return (
    <Card key={jit.id} className="relative mb-8 bg-inherit pl-3">
      <CardHeader className="mb-8 flex flex-row p-0 pt-2">
        {/* TITLE */}
        <CardTitle className="flex w-11/12 flex-col text-2xl leading-5">
          {renderJitTitle(jit)}
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
      <CardContent className="mb-8 p-0">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full pr-4 text-center">
              {favoriteNotes?.length === 0 ? (
                <div className="w-full rounded-md border-2 border-gray-200/50 py-2 font-mono text-xs">
                  <Button className="h-6 bg-transparent font-mono text-xs text-gray-700">
                    ADD NOTES
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {favoriteNotes && renderFavoriteNotes(favoriteNotes)}
                </ul>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] ">
            <DialogHeader className="pb-6">
              <DialogTitle className="flex flex-col text-2xl leading-5 ">
                {renderJitTitle(jit)}
              </DialogTitle>
              <DialogDescription>
                Manage your notes specific to this Focus.
              </DialogDescription>
            </DialogHeader>

            {/* NEW NOTE */}
            <div className="flex items-center pb-4 text-center font-mono">
              <Input
                id="new-note"
                placeholder="New note..."
                className="mr-2"
                value={inputValue}
                onChange={handleNewNoteInputChange}
              />
              <Button
                onClick={handleSaveNewNoteClick}
                type="submit"
                className="bg-pink-950 px-2"
              >
                <SaveIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="border-b-2"></div>

            <div className="grid gap-2 pb-0">
              <div className=" items-center gap-1 font-mono">
                <JitNotesFeed jit={jit} />
              </div>
            </div>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>

      {/* PROGRESS & BELT */}
      <CardContent className="flex p-0 pb-4">
        {/* PROGRESS */}
        <div className="flex w-[54%] flex-col">
          <h3 className="font-mono text-xs">Sessions to next level</h3>
          {renderJitProgress(jit.sessionCount)}
        </div>

        {/* BELT */}
        <div className="flex w-[46%] justify-end md:absolute md:-right-4">
          {renderJitBelt(jit.sessionCount)}
        </div>
      </CardContent>

      {/* BUTTON */}
      <CardFooter className="flex h-0 items-start justify-center">
        <Button
          onClick={handleAddSessionClick}
          className="mt-1 h-8 font-mono font-semibold"
        >
          <span>+1 SESSION</span>
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
