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
import { Plus, SaveIcon } from "lucide-react";
import { Button } from "./ui/button";
import { JitNotesFeed } from "./JitNotesFeed";
import { useState } from "react";
import { useToastWithAction } from "~/hooks/useToastWithAction";
import { JitBelt } from "./JitBelt";
import { ProgressBelt } from "./ProgressBelt";
import { ProgressStripe } from "./ProgressStripe";

type Jit = RouterOutputs["jits"]["getAll"][number];
type Note = RouterOutputs["jits"]["getAll"][number]["notes"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const ctx = api.useUtils();
  const [inputValue, setInputValue] = useState("");
  const favoriteNotes = jit.notes?.filter((note) => note.isFavorite);

  const toastDescription = (
    <>
      {jit.move && (
        <div className="">
          <strong>Move:</strong> {jit.move?.name}
        </div>
      )}
      {jit.position && (
        <div className="">
          <strong>Position:</strong> {jit.position?.name}
        </div>
      )}
    </>
  );

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
    if (jit.position && jit.move) {
      return (
        <>
          <span>{jit.move.name}</span>
          <div>
            {" "}
            <span className="text-sm">from </span>
            <span>{jit.position.name}</span>
          </div>
        </>
      );
    } else if (jit.position && !jit.move) {
      return (
        <>
          <span className="text-sm">any move from</span>
          <span>{jit.position.name}</span>
        </>
      );
    } else if (!jit.position && jit.move) {
      return (
        <>
          <span>{jit.move.name}</span>
          <span className="text-sm">from any position</span>
        </>
      );
    }
    return null;
  }

  // ADD SESSION HANDLERS
  const handleAddSessionClick = useToastWithAction();
  const jitAddSession = api.sessions.create.useMutation({
    onMutate: (newSession) => {
      // Optimistically update to the new value
      ctx.jits.getAll.setData(
        undefined,
        (previousSessions) =>
          previousSessions?.map((s) => {
            return { ...s, ...newSession };
          }),
      );
    },

    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
  });

  // MAKE FAVORITE HANDLERS
  const handleFavoriteClick = useToastWithAction();
  const jitMakeFavorite = api.jits.updateById.useMutation({
    onMutate: (newJit) => {
      // Optimistically update to the new value
      ctx.jits.getAll.setData(
        undefined,
        (previousJits) =>
          previousJits?.map((j) => {
            if (j.id === newJit.id) {
              return { ...j, ...newJit };
            }
            return j;
          }),
      );
      return newJit;
    },

    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
  });

  // NEW NOTE HANDLERS
  // ****Bug: the new note replaces every entry in the dummy cache, should only add one new entry
  const handleSaveNewNoteClick = useToastWithAction();
  const jitSaveNote = api.notes.create.useMutation({
    onMutate: (newNote) => {
      // Optimistically update to the new value
      ctx.notes.getNotesByJitId.setData(
        { jitId: jit.id },
        (previousNotes) =>
          previousNotes?.map((n) => {
            if (n.jitId === newNote.jitId) {
              return { ...n, ...newNote };
            }
            return n;
          }),
      );
      return newNote;
    },

    onSettled: () => {
      void ctx.notes.getNotesByJitId.invalidate();
      void ctx.jits.getAll.invalidate();
    },
  });
  const handleNewNoteInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  return (
    <Card
      key={jit.id}
      className={`relative mb-8 border-2 ${
        jit.isFavorite ? "border-accent" : "border-gray-200 opacity-90"
      } bg-inherit`}
    >
      {/* FAVORITE/FOCUS BUTTON */}
      <>
        <div className="flex justify-center">
          <button
            onClick={() =>
              handleFavoriteClick(
                jit.isFavorite
                  ? "Removing from Focus..."
                  : "Moving to Focus...",
                toastDescription,
                () =>
                  jitMakeFavorite.mutate({
                    ...jit,
                    isFavorite: !jit.isFavorite,
                  }),
              )
            }
            className={`-ml-3 -mt-3 flex rounded-lg border-2 ${
              jit.isFavorite ? "border-accent" : "border-gray-200/50"
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
              onClick={() =>
                handleAddSessionClick(
                  "Adding Session...",
                  toastDescription,
                  () => jitAddSession.mutate({ jitId: jit.id }),
                )
              }
              className="w-[38px] bg-accent p-0 text-xs font-semibold"
            >
              <Plus className="h-7 w-7" />
            </Button>
          </div>
        </CardHeader>
      </>

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
                Manage your notes specific to this Jit.
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
                onClick={() =>
                  handleSaveNewNoteClick(
                    "Saving New Note...",
                    toastDescription,

                    () =>
                      jitSaveNote.mutate({
                        jitId: jit.id,
                        body: inputValue,
                      }),
                  )
                }
                type="submit"
                className="bg-pink-950 px-2"
              >
                <SaveIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="border-b-2"></div>

            <div className="grid gap-2 pb-0">
              <div className=" items-center gap-1 font-mono">
                <JitNotesFeed jitId={jit.id} />
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
            <ProgressStripe sessionCount={jit.sessionCount} />
          </div>
          <div>
            <h3>Sessions to next belt</h3>
            <ProgressBelt sessionCount={jit.sessionCount} />
          </div>
        </div>

        {/* BELT */}
        <div className="flex flex-col justify-center">
          <JitBelt sessionCount={jit.sessionCount} />
        </div>

        {/* ADD SESSION BUTTON */}
      </CardContent>
    </Card>
  );
};
