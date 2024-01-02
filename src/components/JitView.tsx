// JitView
// Handles displaying a single Active Jit

// Used in:
// ~/FullJitFeed

import { type RouterOutputs } from "~/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { JitNotesFeed } from "./JitNotesFeed";
import { useState } from "react";
import { JitBelt } from "./JitBelt";
import { JitProgressBelt } from "./JitProgressBelt";
import { Bookmark, Plus, SaveIcon } from "lucide-react";
// import { humanDate } from "~/utils/humanDate";
import {
  BookmarkFilledIcon,
  DrawingPinFilledIcon,
} from "@radix-ui/react-icons";
import { useFavoriteJit } from "~/hooks/useFavoriteJit";
import { useJitAddSession } from "~/hooks/useJitAddSession";
import { useSaveNoteToJit } from "~/hooks/useSaveNoteToJit";
import { Textarea } from "./ui/textarea";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const [inputValue, setInputValue] = useState("");
  const favoriteNotes = jit.notes?.filter((note) => note.isFavorite);

  // FOCUS (STAR) HANDLERS AND BUTTON
  const handleFocusClick = useFavoriteJit();
  const JitFocusButton = (props: { isFavorite: boolean }) => {
    const { isFavorite } = props;

    return (
      <button onClick={(e) => handleFocusClick(jit, e)}>
        {isFavorite ? (
          <BookmarkFilledIcon className="h-5 w-5 text-secondary hover:text-secondary-foreground hover:opacity-50" />
        ) : (
          <Bookmark className="h-5 w-5 hover:fill-inherit" />
        )}
      </button>
    );
  };

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
        className="h-8 rounded-xl pl-2 pr-3 text-xs"
      >
        <Plus className="mr-1 h-5 w-5" />
        <span>SESSION</span>
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
      <Button
        onClick={handleClick}
        className="h-full bg-pink-900 px-2 shadow-md hover:bg-pink-600"
      >
        <SaveIcon className="h-5 w-5" />
      </Button>
    );
  };

  const JitBeltAndProgressAndButton = (props: { jit: Jit }) => {
    const { jit } = props;

    return (
      <div className="flex w-full flex-col space-y-3 px-4 pb-4">
        <div className="text-slate-6  text-xs font-semibold">
          {jit.isFavorite && <h3>Sessions to next belt</h3>}
          <JitProgressBelt sessionCount={jit.sessionCount} />
        </div>
        <div className="flex ">
          <JitBelt sessionCount={jit.sessionCount} />
          <div className="ml-auto">
            <JitAddSessionButton jit={jit} />
          </div>
        </div>
      </div>
    );
  };

  const JitContentSlim = () => {
    return <CardContent className="pb-0"></CardContent>;
  };

  const JitNotesButton = () => {
    return (
      <div className="mt-2 flex w-full items-center justify-center rounded-md border-2 border-gray-200 py-2 text-xs hover:bg-secondary-foreground">
        <Button className="h-6 bg-card-secondaryLight font-mono text-xs text-secondary">
          NOTES
        </Button>
      </div>
    );
  };

  const JitNotesPinned = () => {
    return (
      <ul className="mx-auto mt-2 w-full space-y-1 rounded-md bg-slate-200 py-2 hover:bg-card-secondary hover:opacity-80 md:grid md:grid-cols-3 md:gap-4">
        {favoriteNotes?.map((note) => (
          <div key={note.id} className="flex px-4">
            <DrawingPinFilledIcon className="translate mt-1 h-4 w-4 -scale-x-100 text-gray-500" />
            <li className="w-[90%] py-1 pl-1 text-left font-mono text-xs leading-3">
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
        className={` mb-4  ${
          jit.isFavorite ? "" : " opacity-40 shadow-none"
        } bg-inherit`}
      >
        <CardHeader className="mb-2 flex flex-row p-0 pl-3 pt-1">
          {/* TITLE */}
          <CardTitle className="flex w-[92%] flex-col pt-1 text-xl leading-5">
            <JitTitle jit={jit} />
          </CardTitle>
          {/* FAVORITE / FOCUS BUTTON */}
          <div className="flex items-start">
            <JitFocusButton isFavorite={jit.isFavorite} />
          </div>
        </CardHeader>

        {/* FAVORITE/FOCUSED JIT
        FOR SOME REASON CANNOT BE PLACED INTO A COMPONENT OUTSIDE OF THIS RETURN
        IT WILL MESS UP THE DIALOG: ON KEYDOWN IT WILL EXIT THE DIALOG */}
        {jit.isFavorite ? (
          <>
            <CardContent className="mb-6 p-0 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  {/* <SquareAsterisk /> */}
                  <div className="flex w-full px-6 text-center ">
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
                    <DialogTitle className="flex flex-col text-3xl leading-5 ">
                      <JitTitle jit={jit} />
                    </DialogTitle>
                  </DialogHeader>

                  {/* NEW NOTE INPUT AND SAVE BUTTON
                  ALSO CANNOT BE PLACED INTO ITS OWN COMPONENT */}
                  <div className="flex items-center pb-6 text-center font-mono ">
                    <Textarea
                      id="new-note"
                      placeholder="New note..."
                      className="mr-2 border-2 bg-background text-pink-950 shadow-sm focus:bg-pink-300/10 focus:ring-pink-300/10"
                      value={inputValue}
                      onChange={(event) => {
                        setInputValue(event.target.value);
                      }}
                    />
                    <JitSaveNoteButton jit={jit} body={inputValue} />
                  </div>

                  <div className=" items-center gap-1 font-mono">
                    <JitNotesFeed jitId={jit.id} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardContent className="p-0">
              <JitBeltAndProgressAndButton jit={jit} />
            </CardContent>
          </>
        ) : (
          <JitContentSlim />
        )}
      </Card>
    </div>
  );

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
};
