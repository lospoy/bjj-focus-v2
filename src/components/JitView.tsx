// JitView
// Handles displaying a single Active Jit

// Used in:
// ~/FullJitFeed

import { api, type RouterOutputs } from "~/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { Plus, SaveIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Belt } from "./ui/belt";
import { JitNotesFeed } from "./JitNotesFeed";
import { useState } from "react";

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
  // const formatDate = (date: Date | null | undefined): string => {
  //   if (!date) {
  //     return "Unknown";
  //   }

  //   const currentDate = new Date();
  //   const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
  //   const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  //   if (daysDiff === 1) {
  //     return "yesterday";
  //   } else if (daysDiff === 0) {
  //     return "today";
  //   } else if (daysDiff < 30) {
  //     return `${daysDiff} days ago`;
  //   } else if (daysDiff < 365) {
  //     const months = Math.floor(daysDiff / 30);
  //     const remainingDays = daysDiff % 30;
  //     return `${months} months ${remainingDays} days ago`;
  //   } else {
  //     return "over a year ago";
  //   }
  // };

  const renderFavoriteNotes = (favoriteNotes: Note[]) => {
    return favoriteNotes?.map((note) => (
      <li
        key={note.id}
        className="py-.5 flex rounded-md border-2 border-gray-200/50 px-6 py-1 text-left font-mono text-xs"
      >
        {note.body}
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

  type BeltRuleType = {
    beltColor: string;
    sessionsPerStripe: number;
  };

  // Min/max represents jit.sessionCount
  const generateBeltRules = (rules: BeltRuleType[]) => {
    const beltRules = [
      { min: 0, max: 0, numberOfStripes: 0, beltColor: "white" },
      { min: 1, max: 2, numberOfStripes: 1, beltColor: "white" },
      { min: 3, max: 4, numberOfStripes: 2, beltColor: "white" },
      { min: 5, max: 7, numberOfStripes: 3, beltColor: "white" },
      { min: 8, max: 10, numberOfStripes: 4, beltColor: "white" },
    ];

    let currentMin = 11;

    rules.forEach((rule) => {
      for (let i = 0; i < 5; i++) {
        const max = currentMin + rule.sessionsPerStripe - 1;
        beltRules.push({
          min: currentMin,
          max: max,
          numberOfStripes: i,
          beltColor: rule.beltColor,
        });
        currentMin = max + 1;
      }
    });

    beltRules.push({
      min: currentMin,
      max: Infinity,
      numberOfStripes: 0,
      beltColor: "black",
    });

    return beltRules;
  };

  const rules = [
    { beltColor: "blue", sessionsPerStripe: 3 },
    { beltColor: "purple", sessionsPerStripe: 4 },
    { beltColor: "brown", sessionsPerStripe: 5 },
    { beltColor: "black", sessionsPerStripe: 6 },
  ];

  const beltRules = generateBeltRules(rules);

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
        // TO PROPERLY ADJUST BELT WIDTH, WE PROBABLY NEED TO MODIFY THE SVG'S WIDTH
        // VIA A PROP, BASED ON VIEWPORT WIDTH - maybe we could do some kind of clamp, or use wh
        <Belt
          className="absolute -right-2 h-[35px] w-max drop-shadow-lg"
          numberOfStripes={numberOfStripes}
          beltColor={beltColor}
        />
      );
    }
  };

  const renderStripeProgress = (sessionCount: number) => {
    const rule = beltRules.find(
      (r) => sessionCount >= r.min && sessionCount <= r.max,
    );

    if (rule) {
      const levelSteps = rule.max - rule.min + 1;
      const completedSteps = sessionCount - rule.min;

      const squareWidth = 100 / levelSteps; // Calculate the width of each square dynamically

      const squares = [];
      for (let i = 0; i < levelSteps; i++) {
        if (sessionCount === 0) {
          squares.push(
            <div
              className="mr-1 h-4 rounded-sm bg-primary/10"
              style={{ width: `100%` }}
            />,
          );
        } else if (i < completedSteps) {
          squares.push(
            <div
              key={i}
              className="mr-1 h-4 rounded-sm bg-primary"
              style={{ width: `${squareWidth}%` }}
            />,
          );
        } else {
          squares.push(
            <div
              key={i}
              className="mr-1 h-4 rounded-sm bg-primary/10"
              style={{ width: `${squareWidth}%` }}
            />,
          );
        }
      }

      return <div className="flex">{squares}</div>;
    }
  };

  const renderBeltProgress = (sessionCount: number) => {
    const currentRule = beltRules.find(
      (r) => sessionCount >= r.min && sessionCount <= r.max,
    );

    if (currentRule) {
      const firstRuleWithCurrentColor = beltRules.find(
        (r) => r.beltColor === currentRule.beltColor,
      );

      const lastRuleWithCurrentColor = [...beltRules]
        .reverse()
        .find((r) => r.beltColor === currentRule.beltColor);

      const levelSteps = lastRuleWithCurrentColor
        ? lastRuleWithCurrentColor.max - (firstRuleWithCurrentColor?.min ?? 0)
        : currentRule.max - (firstRuleWithCurrentColor?.min ?? 0);

      const completedSteps =
        sessionCount - (firstRuleWithCurrentColor?.min ?? 0);

      const squareWidth = 100 / (levelSteps + 1); // Calculate the width of each square dynamically

      const squares = [];
      for (let i = 0; i <= levelSteps; i++) {
        if (i < completedSteps) {
          squares.push(
            <div
              key={i}
              className="mr-[1.5px] h-4 rounded-sm bg-primary"
              style={{ width: `${squareWidth}%` }}
            />,
          );
        } else {
          squares.push(
            <div
              key={i}
              className="mr-[1.5px] h-4 rounded-sm bg-primary/10"
              style={{ width: `${squareWidth}%` }}
            />,
          );
        }
      }

      return <div className="flex">{squares}</div>;
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

      toast.success("SESSION ADDED", {
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
    <Card
      key={jit.id}
      className={`relative mb-8 border-2 ${
        jit.isFavorite ? "border-gray-400" : "border-gray-200"
      } bg-inherit`}
    >
      {/* FAVORITE BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={handleFavoriteClick}
          className={`-ml-3 -mt-3 flex rounded-lg border-2 ${
            jit.isFavorite ? "border-gray-400" : "border-gray-200/50"
          } bg-background px-3`}
        >
          {jit.isFavorite ? (
            <Icons.eyeHalf className="h-6 w-6 fill-background " />
          ) : (
            <EyeClosedIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <CardHeader className="mb-8 flex flex-row p-0 pl-3">
        {/* TITLE */}
        <CardTitle className="flex w-10/12 flex-col text-2xl leading-5">
          {renderJitTitle(jit)}
        </CardTitle>
        {/* ADD SESSION BUTTON */}
        <div className="flex w-2/12 flex-col">
          <Button
            onClick={handleAddSessionClick}
            className="w-[38px] bg-accent p-0 text-xs font-semibold"
          >
            <Plus className="h-7 w-7" />
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
        </div>
      </CardHeader>

      {/* NOTES */}
      <CardContent className="mx-auto mb-8 w-11/12 p-0 pl-3">
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
          <DialogContent
            className="sm:max-w-[425px] "
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
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
      <CardContent className="flex p-0 pb-4 pl-3">
        {/* PROGRESS */}
        <div className="flex w-6/12 flex-col gap-y-2 text-xs font-semibold">
          <div>
            <h3>Sessions to next stripe</h3>
            {renderStripeProgress(jit.sessionCount)}
          </div>
          <div>
            <h3>Sessions to next belt</h3>
            {renderBeltProgress(jit.sessionCount)}
          </div>
        </div>

        {/* BELT */}
        <div className="flex flex-col justify-center">
          {renderJitBelt(jit.sessionCount)}
        </div>

        {/* ADD SESSION BUTTON */}
      </CardContent>
    </Card>
  );
};
