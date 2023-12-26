import { ToastAction } from "~/components/ui/toast";
import { toast } from "~/components/ui/use-toast";

export function useToastWithAction(): (
  title: string,
  description: React.ReactNode,
  mutationFunction: () => void,
  customDelay?: number,
) => void {
  return (
    title: string,
    description: React.ReactNode,
    mutationFunction: () => void,
    customDelay?: number,
  ) => {
    let newJitTimeoutId: NodeJS.Timeout | null = null;
    const defaultDelay = 2000;
    const delay = customDelay ?? defaultDelay;

    newJitTimeoutId = setTimeout(() => {
      try {
        mutationFunction();
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
