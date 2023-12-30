// JitView
// Handles displaying a single Active Jit

// Used in:
// ~/FullJitFeed

import { type RouterOutputs } from "~/utils/api";
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
import { Button } from "./ui/button";
import { JitNotesFeed } from "./JitNotesFeed";
import { useState } from "react";
import { JitBelt } from "./JitBelt";
import { JitProgressBelt } from "./JitProgressBelt";
import { JitProgressStripe } from "./JitProgressStripe";
import { Pin, PlusSquare, SaveIcon, StarIcon } from "lucide-react";
// import { humanDate } from "~/utils/humanDate";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { useFavoriteJit } from "~/hooks/useFavoriteJit";
import { useJitAddSession } from "~/hooks/useJitAddSession";
import { useSaveNoteToJit } from "~/hooks/useSaveNoteToJit";
import { Textarea } from "./ui/textarea";
import { Icons } from "./ui/icons";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const [inputValue, setInputValue] = useState("");
  const favoriteNotes = jit.notes?.filter((note) => note.isFavorite);

  // ADD SESSIONS BUTTON WITH HANDLERS
  const JitAddSessionButton = (props: { jit: Jit }) => {
    const { jit } = props;
    const { handleAddSessionClick } = useJitAddSession({ jit });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleAddSessionClick();
    };

    return (
      <Button
        onClick={handleClick}
        className="flex h-14 flex-row rounded-xl pl-2 pr-3 text-start text-[0.7rem]"
      >
        <PlusSquare className="mr-1 h-8 w-8" />
        <span className="leading-[0.9rem]">
          Log
          <br />
          Session
        </span>
      </Button>
    );
  };

  // SAVE NEW NOTE HANDLERS AND BUTTON
  const JitSaveNoteButton = (props: { jit: Jit; body: string }) => {
    const { jit, body } = props;
    const { handleSaveNoteClick } = useSaveNoteToJit({ jit, body });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleSaveNoteClick();
    };

    return (
      <Button onClick={handleClick} className="bg-pink-950 px-2">
        <SaveIcon className="h-5 w-5" />
      </Button>
    );
  };

  const JitSessionProgressAndButton = (props: { jit: Jit }) => {
    const { jit } = props;

    return (
      <>
        <div className="text-slate-6 00 flex w-[68%] flex-col gap-y-1 text-xs  font-semibold">
          <div>
            {jit.isFavorite && <h3>Sessions to next stripe</h3>}
            <JitProgressStripe sessionCount={jit.sessionCount} />
          </div>
          <div>
            {jit.isFavorite && <h3>Sessions to next belt</h3>}
            <JitProgressBelt sessionCount={jit.sessionCount} />
          </div>
        </div>
        <div className="flex w-[32%] items-end justify-end pl-2 pr-3">
          <JitAddSessionButton jit={jit} />
        </div>
      </>
    );
  };

  const JitContentSlim = () => {
    return <CardContent className="flex justify-end pb-0 pr-3"></CardContent>;
  };

  // FOCUS (STAR) HANDLERS AND BUTTON
  const handleFocusClick = useFavoriteJit();
  const JitFocusButton = (props: { isFavorite: boolean }) => {
    const { isFavorite } = props;

    return (
      <button
        onClick={(e) => handleFocusClick(jit, e)}
        className="mx-auto -mt-3 flex w-14 justify-center rounded-full bg-inherit p-2 "
      >
        {isFavorite ? (
          <StarFilledIcon className="h-5 w-5 text-secondary hover:text-secondary-foreground hover:opacity-50" />
        ) : (
          <StarIcon className="h-5 w-5 hover:fill-inherit" />
        )}
      </button>
    );
  };

  function JitTitle(props: { jit: Jit }) {
    const { jit } = props;

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

  const JitNotesButton = () => {
    return (
      <div className="mt-2 flex w-full items-center justify-center rounded-md border-2 border-gray-300 py-2 text-xs hover:bg-secondary-foreground">
        <Button className="h-6 font-mono text-xs">NOTES</Button>
      </div>
    );
  };

  const JitNotesPinned = () => {
    return (
      <ul className="mx-auto mt-2 w-full space-y-1 rounded-md border-2 border-secondary py-2 hover:bg-secondary-foreground md:grid md:grid-cols-3 md:gap-4">
        {favoriteNotes?.map((note) => (
          <div key={note.id} className="flex px-4">
            <Pin className="mt-1 h-4 w-4 fill-gray-400 text-gray-400" />
            <li className="w-[90%] py-1 pl-1 text-left font-mono text-xs">
              {note.body}
            </li>
          </div>
        ))}
      </ul>
    );
  };

  return (
    <div
      className={`parent-component rounded-xl
      ${jit.isFavorite ? "bg-card-secondary" : "bg-zinc-100"}`}
    >
      <Card
        className={`relative mb-8  ${
          jit.isFavorite ? "" : " opacity-70 shadow-none"
        } bg-inherit`}
      >
        <JitFocusButton isFavorite={jit.isFavorite} />
        <CardHeader className="-mt-5 mb-4 flex flex-row p-0 pl-3">
          {/* BELT */}
          <div className="flex flex-col justify-end">
            <JitBelt sessionCount={jit.sessionCount} />
          </div>

          {/* TITLE */}
          <CardTitle className="flex w-11/12 flex-col text-xl leading-5 ">
            <JitTitle jit={jit} />
          </CardTitle>
        </CardHeader>

        {/* FAVORITE/FOCUSED JIT
        FOR SOME REASON CANNOT BE PLACED INTO A COMPONENT OUTSIDE OF THIS RETURN
        IT WILL MESS UP THE DIALOG: ON KEYDOWN IT WILL EXIT THE DIALOG */}
        {jit.isFavorite ? (
          <>
            <CardContent className="mx-auto mb-6 w-11/12 p-0 pl-3">
              <Dialog>
                <DialogTrigger asChild>
                  {/* <SquareAsterisk /> */}
                  <div className="mx-auto flex w-full pr-4 text-center">
                    {favoriteNotes?.length === 0 ? (
                      <JitNotesButton />
                    ) : (
                      <JitNotesPinned />
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent
                  className="bg-background sm:max-w-[425px]"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <DialogHeader className="pb-6">
                    <DialogTitle className="flex flex-col text-2xl leading-5 ">
                      <JitTitle jit={jit} />
                    </DialogTitle>
                    <DialogDescription>
                      Manage your notes specific to this Jit.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex items-center pb-4 text-center font-mono">
                    <Textarea
                      id="new-note"
                      placeholder="New note..."
                      className="mr-2 bg-background focus:border-2 focus:border-pink-900 focus:ring-background"
                      value={inputValue}
                      onChange={(event) => {
                        setInputValue(event.target.value);
                      }}
                    />
                    <JitSaveNoteButton jit={jit} body={inputValue} />
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
            <CardContent className="flex p-0 pb-4 pl-3">
              <JitSessionProgressAndButton jit={jit} />
            </CardContent>
          </>
        ) : (
          <JitContentSlim />
        )}
      </Card>
    </div>
  );
};
