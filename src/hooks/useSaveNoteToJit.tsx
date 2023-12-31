import { type RouterOutputs, api } from "~/utils/api";
import { toast } from "~/components/ui/use-toast";
import { ToastAction } from "~/components/ui/toast";

type Jit = RouterOutputs["jits"]["getAll"][number];
type Note = RouterOutputs["jits"]["getAll"][number]["notes"][number];

export const JitToastDescription = (props: { jit: Jit }) => {
  const { jit } = props;

  return (
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
};

export function useSaveNoteToJit(props: { jit: Jit; body: string }) {
  const { jit, body } = props;
  const ctx = api.useUtils();
  const delay = 4000;
  let timeoutId: NodeJS.Timeout | null = null;

  const undoSaveNote = () => {
    ctx.notes.getNotesByJitId.setData(
      { jitId: jit.id },
      (previousNotes) => previousNotes?.slice(1),
    );
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const jitSaveNote = api.notes.create.useMutation({
    onSettled: () => {
      void ctx.notes.getNotesByJitId.invalidate();
      void ctx.jits.getAll.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving this Note.",
      });
    },
  });

  const newNote = {
    body: body,
    isFavorite: false,
    createdAt: new Date(),
    jitId: jit.id,
  };

  const handleSaveNoteClick = () => {
    // Optimistically update to the new value
    ctx.notes.getNotesByJitId.setData({ jitId: jit.id }, (previousNotes) => {
      return [newNote, ...(previousNotes ?? [])] as Note[];
    });

    // toast
    toast({
      duration: delay,
      className: "bg-primary text-background",
      title: "Saving New Note...",
      description: <JitToastDescription jit={jit} />,
      action: (
        <ToastAction altText="Undo" onClick={undoSaveNote}>
          Undo
        </ToastAction>
      ),
    });

    timeoutId = setTimeout(() => {
      jitSaveNote.mutate(newNote);
    }, delay);
  };

  return { handleSaveNoteClick };
}
