import { type RouterOutputs, api } from "~/utils/api";
import { useToastWithAction } from "./useToastWithAction";
import { JitToastDescription } from "~/components/JitMenu";

type Jit = RouterOutputs["jits"]["getAll"][number];

export function useAddSessionToJit(props: { jit: Jit }) {
  const { jit } = props;
  const ctx = api.useUtils();

  const jitAddSession = api.sessions.create.useMutation({
    onMutate: (newSession) => {
      // Optimistically update to the new value
      ctx.jits.getAll.setData(
        undefined,
        (previousSessions) =>
          previousSessions?.map((s) => {
            return { ...s, ...newSession };
          }),
      );
    },

    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
  });

  const addSession = () => jitAddSession.mutate({ jitId: jit.id });
  const toastWithAction = useToastWithAction();

  const handleAddSessionClick = () => {
    toastWithAction(
      "Adding Session...",
      <JitToastDescription jit={jit} />,
      undefined,
      // undo callback
      () => {
        ctx.jits.getAll.setData(
          undefined,
          (previousSessions) => previousSessions?.slice(1),
        );
      },
    )(addSession);
  };

  return { handleAddSessionClick };
}
