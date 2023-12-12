// NoteView
// Handles displaying a single Active Note

// Used in:
// ~/FullNoteFeed

import { api, type RouterOutputs } from "~/utils/api";
import { Card, CardContent } from "./ui/card";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { toast } from "react-toastify";

type Note = RouterOutputs["notes"]["getNotesByJitId"][number];

export const JitNoteView = (props: { note: Note }) => {
  const { note } = props;
  const ctx = api.useUtils();
  const updateNote = api.notes.updateById.useMutation();

  const handleFavoriteClick = () => {
    try {
      updateNote.mutate({
        id: note.id,
        jitId: note.jitId,
        isFavorite: !note.isFavorite,
      });
      // If mutate succeeds, update UI and invalidate the data
      setTimeout(() => {
        void ctx.notes.getNotesByJitId.invalidate();
      }, 2000);
    } catch (e: unknown) {
      toast.error("Failed to update. Please try again later.");
    }
  };

  return (
    <Card key={note.id} className="relative mb-3 bg-inherit pl-3">
      <CardContent className="my-1 flex p-0">
        <p className="flex w-11/12 flex-col leading-5">{note.body}</p>
        {/* FAVORITE / BOOKMARK */}
        <div className="flex w-1/12 flex-col">
          <button onClick={handleFavoriteClick}>
            {note.isFavorite ? (
              <HeartIcon
                fill="currentColor"
                className="h-5 w-5 text-pink-800"
              />
            ) : (
              <HeartIcon className="h-5 w-5 text-pink-800" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};