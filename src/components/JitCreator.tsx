import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/utils/api";
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

export const JitCreator = () => {
  const { toast } = useToast();

  const allPositions = api.positions.getAll.useQuery().data;
  const allMoves = api.moves.getAll.useQuery().data;
  const newJit = api.jits.create.useMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const positionValue = form.watch("position");
  const positionName = positionValue?.name;
  const moveValue = form.watch("move");

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let newJitTimeoutId: NodeJS.Timeout | null = null;
    const delay = 4000;

    newJitTimeoutId = setTimeout(() => {
      try {
        newJit.mutate({
          categoryId: "",
          moveId: data.move?.id,
          positionId: data.position?.id,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem creating this Jit.",
        });
      }
    }, delay);

    form.reset();

    toast({
      duration: delay,
      className: "bg-primary text-background",
      title: "Creating New Jit",
      description: (
        <>
          {data.move && (
            <div className="">
              <strong>Move:</strong> {data.move?.name}
            </div>
          )}
          {data.position && (
            <div className="">
              <strong>Position:</strong> {data.position?.name}
            </div>
          )}
        </>
      ),
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
                          !field.value && "text-muted-foreground",
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
                                    ? "bg-accent text-background"
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
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground",
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
                                    ? "bg-accent text-background"
                                    : "bg-none",
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
            className="bg-accent text-background"
            disabled={!moveValue && !positionValue}
          >
            CREATE JIT
          </Button>
        </div>
      </form>
    </Form>
  );
};
