import { ToastAction } from "~/components/ui/toast";
import { toast } from "~/components/ui/use-toast";

export function useToastWithAction(): (
  title: string,
  description: React.ReactNode,
  mutationFunction: () => void,
  invalidateFunction: () => Promise<void>,
) => void {
  return (
    title: string,
    description: React.ReactNode,
    mutationFunction: () => void,
    invalidateFunction: () => Promise<void>,
  ) => {
    let newJitTimeoutId: NodeJS.Timeout | null = null;
    const delay = 4000;

    newJitTimeoutId = setTimeout(() => {
      try {
        mutationFunction();
        // If mutate succeeds, update UI and invalidate the data
        setTimeout(() => {
          void invalidateFunction();
        }, 2000);
      } catch (e: unknown) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem adding a Session.",
        });
      }
    }, delay);

    toast({
      duration: delay,
      className: "bg-primary text-background",
      title,
      description,
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            if (newJitTimeoutId) {
              clearTimeout(newJitTimeoutId);
            }
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };
}
