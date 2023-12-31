import { type RouterOutputs, api } from "~/utils/api";
import { toast } from "~/components/ui/use-toast";
import { ToastAction } from "~/components/ui/toast";

type Jit = RouterOutputs["jits"]["getAll"][number];
export type JitCreate1 = {
  move: {
    id: string;
    name: string;
  };
  position: {
    id: string;
    name: string;
  };
};

const JitToastDescription = (props: { newJit: JitCreate1 }) => {
  const { newJit } = props;

  return (
    <>
      {newJit.move && (
        <div className="">
          <strong>Move:</strong> {newJit.move?.name}
        </div>
      )}
      {newJit.position && (
        <div className="">
          <strong>Position:</strong> {newJit.position?.name}
        </div>
      )}
    </>
  );
};

export function useCreateJit(props: { newJit: JitCreate1; allJits: Jit[] }) {
  const { newJit, allJits } = props;
  const ctx = api.useUtils();
  const delay = 4000;
  let timeoutId: NodeJS.Timeout | null = null;

  function jitExists(
    moveId: string | undefined,
    positionId: string | undefined,
  ) {
    if (!allJits) {
      return false;
    }

    return allJits.some((jit) => {
      const jitMoveId = jit.move?.id;
      const jitPositionId = jit.position?.id;

      return jitMoveId === moveId && jitPositionId === positionId;
    });
  }

  const undoCreateJit = () => {
    ctx.jits.getAll.setData(
      undefined,
      (previousJits) => previousJits?.slice(1),
    );
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const jitCreate = api.jits.create.useMutation({
    onSettled: () => {
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

  const handleCreateJitClick = () => {
    if (jitExists(data.move?.id, data.position?.id)) {
      toast({
        title: "Jit already exists.",
        duration: 4000,
        description: (
          <>
            {data.move && (
              <div>
                <strong>Move:</strong> {data.move?.name}
              </div>
            )}
            {data.position && (
              <div>
                <strong>Position:</strong> {data.position?.name}
              </div>
            )}
          </>
        ),
        action: (
          <ToastAction
            altText="go to jits page"
            onClick={() => router.push("/jits")}
          >
            Go to Jits Page
          </ToastAction>
        ),
      });
      return;
    }
    // Optimistically update to the new value
    ctx.jits.getAll.setData(undefined, (previousJits) => {
      return [newJit, ...(previousJits ?? [])] as Jit[];
    });

    // toast
    toast({
      duration: delay,
      className: "bg-primary text-background",
      title: "Saving New Note...",
      description: <JitToastDescription newJit={newJit} />,
      action: (
        <ToastAction altText="Undo" onClick={undoCreateJit}>
          Undo
        </ToastAction>
      ),
    });

    timeoutId = setTimeout(() => {
      jitCreate.mutate({
        moveId: newJit.move.id,
        positionId: newJit.position.id,
      });
    }, delay);
  };

  return { handleCreateJitClick };
}
