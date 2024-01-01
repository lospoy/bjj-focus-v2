import { api } from "~/utils/api";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/router";
import { PositionFormField } from "./PositionFormField";
import type { Jits, Positions, Moves } from "./types";
import {
  useJitCreatorForm,
  type FormData,
  JitCreatorFormProvider,
} from "./FormSchema";
import { MoveFormField } from "./MoveFormField";

const JitCreatorWithContext = (props: Props) => {
  const ctx = api.useUtils();
  const { allJits, allPositions, allMoves } = props;
  const { toast } = useToast();
  const router = useRouter();

  // FORM VARIABLES
  const form = useJitCreatorForm();
  const positionValue = form.watch("position");
  const moveValue = form.watch("move");

  // CHECKS IF JIT EXISTS
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

  const jitCreate = api.jits.create.useMutation({
    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem creating this Jit.",
      });
    },
  });

  function onSubmit(data: FormData) {
    let newJitTimeoutId: NodeJS.Timeout | null = null;
    const delay = 3000;

    if (jitExists(data.move?.id, data.position?.id)) {
      toast({
        title: "Jit already exists.",
        duration: delay,
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
            Jits Page
          </ToastAction>
        ),
      });
      return;
    } else {
      const newJitId = Math.random().toString();
      const newJitForCache = {
        id: newJitId,
        move: data.move,
        position: data.position,
        sessionCount: 0,
        createdAt: new Date(),
      };
      // Set dummy Jit data to cache
      ctx.jits.getAll.setData(undefined, (previousJits) => {
        return [newJitForCache, ...(previousJits ?? [])] as Jits;
      });

      const jitCache = ctx.jits.getAll.getData();
      console.log({ jitCache });

      toast({
        duration: delay,
        className: "bg-secondary text-background",
        title: "Creating New Jit...",
        description: (
          <>
            {data.move && (
              <div>
                <strong>Move:</strong> {data.move.name}
              </div>
            )}
            {data.position && (
              <div>
                <strong>Position:</strong> {data.position.name}
              </div>
            )}
          </>
        ),
        action: (
          <ToastAction
            className="text-background hover:bg-card-secondaryLight hover:text-accent"
            altText="undo"
            onClick={() => {
              if (newJitTimeoutId) {
                clearTimeout(newJitTimeoutId);
              }
              ctx.jits.getAll.setData(undefined, (previousJits) => {
                return previousJits?.filter(
                  (previousJit) => previousJit.id !== newJitId,
                );
              });
            }}
          >
            UNDO
          </ToastAction>
        ),
      });

      form.reset();
    }

    newJitTimeoutId = setTimeout(() => {
      // Actual API call
      jitCreate.mutate({
        positionId: data.position?.id,
        moveId: data.move?.id,
      });
      void router.push("/jits");
    }, delay);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 md:px-20"
      >
        <div className="space-y-2">
          <PositionFormField allPositions={allPositions} />
          <MoveFormField allMoves={allMoves} />
        </div>

        <JitDescription />

        <div className="flex justify-center ">
          <Button
            size="lg"
            type="submit"
            className="bg-secondary text-background"
            disabled={!moveValue && !positionValue}
          >
            CREATE JIT
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const JitCreator = (props: Props) => {
  return (
    <JitCreatorFormProvider>
      <JitCreatorWithContext {...props} />
    </JitCreatorFormProvider>
  );
};

/* INTERPRETATION OF SELECTED POS/MOVE */
const JitDescription = () => {
  // FORM VARIABLES
  const form = useJitCreatorForm();
  const positionValue = form.watch("position");
  const positionName = positionValue?.name;
  const moveValue = form.watch("move");

  if (!positionValue && !moveValue) {
    return null;
  }

  return (
    <div className="flex flex-col text-center font-mono">
      {moveValue ? (
        <>
          <span className="text-3xl">{moveValue?.name} </span>
          <div className="flex flex-col">
            <span>from </span>
            {positionName ? (
              <span className="text-3xl"> {positionName}</span>
            ) : (
              <span className="text-3xl">any position</span>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col -space-y-1">
            <span>any move from</span>
            <span className="text-3xl"> {positionName}</span>
          </div>
        </>
      )}
    </div>
  );
};

type Props = {
  allJits: Jits;
  allPositions: Positions;
  allMoves: Moves;
};
