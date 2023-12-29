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
import { Button } from "./ui/button";
import { JitNotesFeed } from "./JitNotesFeed";
import { useState } from "react";
import { useToastWithAction } from "~/hooks/useToastWithAction";
import { JitBelt } from "./JitBelt";
import { JitProgressBelt } from "./JitProgressBelt";
import { JitProgressStripe } from "./JitProgressStripe";
import JitMenu, { JitToastDescription } from "./JitMenu";
import { SaveIcon } from "lucide-react";
import { humanDate } from "~/utils/humanDate";

type Jit = RouterOutputs["jits"]["getAll"][number];
type Note = RouterOutputs["jits"]["getAll"][number]["notes"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const ctx = api.useUtils();
  const [inputValue, setInputValue] = useState("");
  const favoriteNotes = jit.notes?.filter((note) => note.isFavorite);

  // NEW NOTE HANDLERS
  // TOAST AND UNDO
  const handleSaveNewNoteClick = useToastWithAction()(
    "Saving New Note...",
    <JitToastDescription jit={jit} />,
    undefined,
    // undo callback
    () => {
      ctx.notes.getNotesByJitId.setData(
        { jitId: jit.id },
        (previousNotes) => previousNotes?.slice(1),
      );
    },
  );
  // API CALL AND ADDING FAKE DATA TO THE CACHE
  const jitSaveNote = api.notes.create.useMutation({
    onMutate: (newNote) => {
      return newNote;
    },

    onSettled: () => {
      void ctx.notes.getNotesByJitId.invalidate();
      void ctx.jits.getAll.invalidate();
    },
  });

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

  const JitProgressAndMenu = (props: { jit: Jit }) => {
    const { jit } = props;

    return (
      <>
        <div
          className={`flex w-[78%] flex-col gap-y-2 text-xs font-semibold ${
            !jit.isFavorite ? "mt-1" : ""
          }`}
        >
          <div>
            {jit.isFavorite && <h3>Sessions to next stripe</h3>}
            <JitProgressStripe sessionCount={jit.sessionCount} />
          </div>
          <div>
            {jit.isFavorite && <h3>Sessions to next belt</h3>}
            <JitProgressBelt sessionCount={jit.sessionCount} />
          </div>
        </div>
        <div className="flex w-[22%] items-end justify-end pb-1 pr-3">
          <JitMenu jit={jit} />
        </div>
      </>
    );
  };

  const JitContentSlim = () => {
    return (
      <CardContent className="flex p-0 py-4 pl-3">
        <JitProgressAndMenu jit={jit} />
      </CardContent>
    );
  };

  const FavoriteNotes = (props: { favoriteNotes: Note[] }) => {
    const { favoriteNotes } = props;

    return (
      <ul className="space-y-2">
        {favoriteNotes?.map((note) => (
          <li
            key={note.id}
            className="py-.5 flex rounded-md px-6 py-1 text-left font-mono text-xs"
          >
            {note.body}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className={`parent-component rounded-xl
      ${jit.isFavorite ? "bg-purple-200" : "bg-inherit"}`}
    >
      <Card
        className={`relative mb-8 border-2 ${
          jit.isFavorite ? "border-accent " : "border-gray-200 opacity-90"
        } bg-inherit`}
      >
        <CardHeader className="mb-4 flex flex-row p-0 pl-3">
          {/* BELT */}
          <div className="flex flex-col justify-center ">
            <JitBelt sessionCount={jit.sessionCount} />
          </div>

          {/* TITLE */}
          <CardTitle className="flex w-11/12 flex-col text-2xl leading-5">
            <JitTitle jit={jit} />
          </CardTitle>
        </CardHeader>

        {jit.isFavorite ? (
          <>
            <CardContent className="mx-auto mb-8 w-11/12 p-0 pl-3">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full pr-4 text-center">
                    {favoriteNotes?.length === 0 ? (
                      <div className="w-full rounded-md border-2 border-gray-200/50 py-2 font-mono text-xs">
                        <Button className="h-6 bg-transparent font-mono text-xs text-gray-700">
                          ADD NOTES
                        </Button>
                      </div>
                    ) : (
                      favoriteNotes && (
                        <FavoriteNotes favoriteNotes={favoriteNotes} />
                      )
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[425px] "
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
                    <Input
                      id="new-note"
                      placeholder="New note..."
                      className="mr-2"
                      value={inputValue}
                      onChange={(event) => {
                        setInputValue(event.target.value);
                      }}
                    />
                    <Button
                      onClick={() => {
                        const newNote = {
                          body: inputValue,
                          isFavorite: false,
                          createdAt: new Date(),
                          jitId: jit.id,
                        };
                        ctx.notes.getNotesByJitId.setData(
                          { jitId: jit.id },
                          (previousNotes) =>
                            [newNote, ...(previousNotes ?? [])] as Note[],
                        );
                        handleSaveNewNoteClick(() => {
                          jitSaveNote.mutate(newNote);
                        });
                      }}
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
            <CardContent className="flex p-0 pb-4 pl-3">
              <JitProgressAndMenu jit={jit} />
            </CardContent>
          </>
        ) : (
          <JitContentSlim />
        )}
      </Card>
    </div>
  );
};
