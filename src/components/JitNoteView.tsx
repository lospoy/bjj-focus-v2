// JitNoteView
// Handles displaying a single Note

// Used in:
// ~/JitNotesFeed

import { api, type RouterOutputs } from "~/utils/api";
import { Card, CardContent } from "./ui/card";
import { Pin } from "lucide-react";
import { toast } from "./ui/use-toast";

type Note = RouterOutputs["notes"]["updateById"];

export const JitNoteView = (props: { note: Note }) => {
  const { note } = props;
  const ctx = api.useUtils();

  // PIN HANDLER
  // API CALL
  const noteUpdate = api.notes.updateById.useMutation({
    onMutate: (newNote) => {
      // Optimistically update to the new value
      ctx.notes.getNotesByJitId.setData(
        { jitId: note.jitId },
        (previousNotes) =>
          previousNotes?.map((n) => {
            if (n.id === newNote.id) {
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

  const handleTogglePin = () => {
    try {
      noteUpdate.mutate({
        ...note,
        isFavorite: !note.isFavorite,
      });
    } catch (e: unknown) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem pinning this note.",
      });
    }
  };

  return (
    <Card key={note.id} className="relative mb-3 bg-inherit pl-3">
      <CardContent className="my-1 flex p-0">
        <p className="flex w-11/12 flex-col leading-5 ">{note.body}</p>
        {/* FAVORITE / BOOKMARK */}
        <div className="flex w-1/12 flex-col">
          <button onClick={handleTogglePin}>
            {note.isFavorite ? (
              <Pin fill="currentColor" className="h-5 w-5 text-blue-800" />
            ) : (
              <Pin className="h-5 w-5 text-blue-800" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
