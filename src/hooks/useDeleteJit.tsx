import { type RouterOutputs, api } from "~/utils/api";
import { toast } from "~/components/ui/use-toast";
import { ToastAction } from "~/components/ui/toast";

type Jit = RouterOutputs["jits"]["getAll"][number];
export type JitToDelete = {
  move: {
    id: string;
    name: string;
  };
  position: {
    id: string;
    name: string;
  };
};

const JitToastDescription = (props: { jitToDelete: Jit }) => {
  const { jitToDelete } = props;

  return (
    <>
      {jitToDelete.move && (
        <div className="">
          <strong>Move:</strong> {jitToDelete.move?.name}
        </div>
      )}
      {jitToDelete.position && (
        <div className="">
          <strong>Position:</strong> {jitToDelete.position?.name}
        </div>
      )}
    </>
  );
};

export function useDeleteJit(props: { jit: Jit }) {
  const { jit } = props;
  const ctx = api.useUtils();
  const delay = 6000;
  let timeoutId: NodeJS.Timeout | null = null;

  const undoDeleteJit = () => {
    ctx.jits.getAll.setData(undefined, (previousJits) => {
      return [jit, ...(previousJits ?? [])] as Jit[];
    });
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const jitDelete = api.jits.deleteById.useMutation({
    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting this Jit.",
      });
    },
  });

  const handleDeleteJitClick = (props: { jitId: string }) => {
    const { jitId } = props;

    // Optimistically update to the new value
    ctx.jits.getAll.setData(
      undefined,
      (previousJits) => previousJits?.filter((jit) => jit.id !== jitId),
    );
    // toast
    toast({
      duration: delay,
      variant: "destructive",
      title: "Jit Deleted",
      description: <JitToastDescription jitToDelete={jit} />,
      action: (
        <ToastAction
          className="font-semibold"
          altText="undo"
          onClick={undoDeleteJit}
        >
          UNDO
        </ToastAction>
      ),
    });

    timeoutId = setTimeout(() => {
      jitDelete.mutate({
        jitId,
      });
    }, delay);
  };

  return { handleDeleteJitClick };
}
