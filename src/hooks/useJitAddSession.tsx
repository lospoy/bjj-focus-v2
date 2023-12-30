import { type RouterOutputs, api } from "~/utils/api";
import { toast } from "~/components/ui/use-toast";

type Jit = RouterOutputs["jits"]["getAll"][number];

export function useJitAddSession(props: { jit: Jit }) {
  const { jit } = props;
  const ctx = api.useUtils();

  const jitAddSession = api.sessions.create.useMutation({
    onMutate: () => {
      // Optimistically update to the new value
      ctx.jits.getAll.setData(
        undefined,
        (previousSessions) =>
          previousSessions?.map((s) => {
            if (s.id === jit.id) {
              return {
                ...s,
                sessionCount: (s.sessionCount ?? 0) + 1,
              };
            }
            return s;
          }),
      );
    },
    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem adding a Session.",
      });
    },
  });

  const handleAddSessionClick = () => {
    jitAddSession.mutate({ jitId: jit.id });
  };

  return { handleAddSessionClick };
}
