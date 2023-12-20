// JitNoteView
// Handles displaying a single Note

// Used in:
// ~/JitNotesFeed

import { api, type RouterOutputs } from "~/utils/api";
import { Card, CardContent } from "./ui/card";
import { Pin } from "lucide-react";
import { toast } from "./ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Note = RouterOutputs["notes"]["updateById"];
type UpdateNoteInput = Pick<Note, "id" | "isFavorite">;

export const JitNoteView = (props: { note: Note }) => {
  const { note } = props;
  const ctx = api.useUtils();
  const queryClient = useQueryClient();
  const { mutateAsync } = api.notes.updateById.useMutation();

  const updateNote = useMutation(
    (newNote: UpdateNoteInput) => mutateAsync(newNote),
    {
      onMutate: async (newNote: UpdateNoteInput) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["notes", newNote.id] });

        // Snapshot the previous value
        const previousNote = queryClient.getQueryData(["notes", newNote.id]);

        // Optimistically update to the new value
        queryClient.setQueryData(["notes", newNote.id], newNote);

        // Return a context with the previous and new todo
        return { previousNote, newNote };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newNote, context) => {
        queryClient.setQueryData(
          ["notes", context?.newNote.id],
          context?.previousNote,
        );
      },
      // Always refetch after error or success:
      onSettled: (newNote) => {
        void queryClient.invalidateQueries({
          queryKey: ["notes", newNote?.id],
        });
      },
    },
  );

  const handleTogglePin = async () => {
    try {
      const newNote: UpdateNoteInput = {
        id: note.id,
        isFavorite: !note.isFavorite,
      };

      await updateNote.mutateAsync(newNote);
      // If mutate succeeds, update UI and invalidate the data
      void ctx.jits.getAll.invalidate();
    } catch (e: unknown) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem adding a Session.",
      });
    }
  };

  return (
    <Card key={note.id} className="relative mb-3 bg-inherit pl-3">
      <CardContent className="my-1 flex p-0">
        <p className="flex w-11/12 flex-col leading-5">{note.body}</p>
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
