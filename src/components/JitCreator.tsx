import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { type RouterOutputs, api } from "~/utils/api";
import { cn } from "~/libs/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { ScrollArea } from "./ui/scroll-area";
import { PopoverClose } from "@radix-ui/react-popover";
import type { JitCreate } from "~/server/api/routers/jits";
import { useRouter } from "next/router";

export type JitRecord = RouterOutputs["jits"]["create"];
export type Jits = RouterOutputs["jits"]["getAll"];
export type JitCreate = z.infer<typeof JitCreate>;
type Positions = RouterOutputs["positions"]["getAll"];
type Moves = RouterOutputs["moves"]["getAll"];

const FormSchema = z
  .object({
    move: z.object({ name: z.string(), id: z.string() }).optional(),
    position: z
      .object({
        name: z.string(),
        id: z.string(),
        categoryType: z.object({ name: z.string() }),
      })
      .optional(),
  })
  .refine((data) => data.move ?? data.position, {
    message: "Select at least one move or one position.",
    path: ["move"],
  });

type FormData = z.infer<typeof FormSchema>;

export const JitCreator = (props: {
  allJits: Jits;
  allPositions: Positions;
  allMoves: Moves;
}) => {
  const ctx = api.useUtils();
  const { allJits, allPositions, allMoves } = props;
  const { toast } = useToast();
  const router = useRouter();

  // FORM VARIABLES
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  const positionValue = form.watch("position");
  const positionName = positionValue?.name;
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
        {/* POSITIONS AND MOVES */}
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value &&
                            "text-muted-foreground hover:text-background",
                        )}
                      >
                        {field.value ? (
                          <>
                            <Check className={cn("h-4 w-4")} />
                            {
                              allPositions?.find(
                                (position) => position.id === field.value?.id,
                              )?.name
                            }
                          </>
                        ) : (
                          "Position"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[90vw] p-0 md:w-[30vw]"
                    side="bottom"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <Command>
                      <CommandInput placeholder="Search position..." />
                      <CommandEmpty>No position found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[30vh] ">
                          <PopoverClose className="w-full">
                            <CommandItem
                              className="opacity-50"
                              value="n/a"
                              onSelect={() => {
                                form.setValue("position", undefined);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              n/a
                            </CommandItem>
                            {allPositions?.map((position) => (
                              <CommandItem
                                className={cn(
                                  position.id === field.value?.id
                                    ? "bg-secondary text-background"
                                    : "bg-none",
                                )}
                                value={position.name}
                                key={position.id}
                                onSelect={() => {
                                  form.setValue("position", position);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    position?.id === field.value?.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {position.name}
                              </CommandItem>
                            ))}
                          </PopoverClose>
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* MOVES */}
          <FormField
            control={form.control}
            name="move"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild className="hover:text-background">
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value &&
                            "text-muted-foreground hover:text-background",
                        )}
                      >
                        {field.value ? (
                          <>
                            <Check className={cn("h-4 w-4")} />
                            {
                              allMoves?.find(
                                (move) => move.id === field.value?.id,
                              )?.name
                            }
                          </>
                        ) : (
                          "Move"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[90vw] p-0 md:w-[30vw]"
                    side="bottom"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <Command className="">
                      <CommandInput placeholder="Search move..." />
                      <CommandEmpty>No move found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[30vh]">
                          <PopoverClose className="w-full">
                            <CommandItem
                              className="opacity-40"
                              value="n/a"
                              onSelect={() => {
                                form.setValue("move", undefined);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  !field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              n/a
                            </CommandItem>
                            {allMoves?.map((move) => (
                              <CommandItem
                                className={cn(
                                  move.id === field.value?.id
                                    ? "bg-secondary text-background"
                                    : "bg-none",
                                  "hover:bg-card-secondaryLight", // Add hover:bg-card-secondaryLight
                                )}
                                value={move.name}
                                key={move.id}
                                onSelect={() => {
                                  form.setValue("move", move);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    move.id === field.value?.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {move.name}
                              </CommandItem>
                            ))}
                          </PopoverClose>
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* INTERPRETATION OF SELECTED POS/MOVE */}
        {(positionValue ?? moveValue) && (
          <div className="flex flex-col text-center font-mono">
            {moveValue ? (
              <>
                <span className="text-3xl">{moveValue?.name} </span>
                <div className="flex flex-col">
                  <span>from </span>
                  {positionValue ? (
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
        )}

        <div className="flex justify-center ">
          <Button
            size={"lg"}
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
