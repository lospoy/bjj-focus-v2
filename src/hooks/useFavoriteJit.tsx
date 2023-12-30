import { useToast } from "~/components/ui/use-toast";
import { type RouterOutputs, api } from "~/utils/api";

type Jit = RouterOutputs["jits"]["getAll"][number];

export function useFavoriteJit() {
  const toast = useToast();
  const ctx = api.useUtils();

  const jitMakeFavorite = api.jits.updateById.useMutation({
    onMutate: (newJit) => {
      // Optimistically update to the new value
      ctx.jits.getAll.setData(
        undefined,
        (previousJits) =>
          previousJits?.map((j) => {
            if (j.id === newJit.id) {
              return { ...j, ...newJit };
            }
            return j;
          }),
      );
      return newJit;
    },

    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
  });

  const handleFavoriteClick = (
    jit: Jit,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    try {
      jitMakeFavorite.mutate({
        ...jit,
        isFavorite: !jit.isFavorite,
      });
    } catch (e: unknown) {
      toast.toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem updating this Jit.",
      });
    }
  };

  return handleFavoriteClick;
}
