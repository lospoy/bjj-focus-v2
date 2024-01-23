import { type RouterOutputs } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useSaveNoteToJit } from "~/hooks/useSaveNoteToJit";
import { Button } from "../ui/button";
import { SaveIcon } from "lucide-react";
import { DrawingPinFilledIcon } from "@radix-ui/react-icons";
import { JitTitle } from ".";
import { Textarea } from "../ui/textarea";
import { JitNotesFeed } from "./JitNotesFeed";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { JitDelete } from "./JitMenu";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitNoteDialog = (props: { jit: Jit }) => {
  const { jit } = props;
  const favoriteNotes = jit.notes?.filter((note) => note.isFavorite);
  const [inputValue, setInputValue] = useState("");
  const path = usePathname();
  const notePath = path === "/notes";

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
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full px-6 text-center ">
          {favoriteNotes?.length === 0 ? (
            <JitNotesButton />
          ) : (
            <JitNotesPinned />
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col bg-background sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-6">
          <DialogTitle className="flex flex-col text-3xl leading-6">
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
        {notePath && (
          <DialogFooter className="self-center">
            <Button
              variant="outline"
              className="border-2 border-red-600 hover:bg-red-600 hover:text-background"
            >
              <JitDelete jit={jit} />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
