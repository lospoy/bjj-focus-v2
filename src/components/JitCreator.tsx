"use client";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { ScrollArea } from "./ui/scroll-area";
import { PopoverClose } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";

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
    category: z.object({
      name: z.string(),
      id: z.string(),
    }),
  })
  .refine((data) => data.move ?? data.position, {
    message: "Select at least one move or one position.",
    path: ["move"],
  })
  .refine((data) => data.category, {
    message: "Please select your role in this Jit.",
    path: ["category"],
  });

type FormData = z.infer<typeof FormSchema>;

export const JitCreator = () => {
  const { toast } = useToast();
  const allCategories = api.categories.getAll.useQuery().data;
  const allPositions = api.positions.getAll.useQuery().data;
  const allMoves = api.moves.getAll.useQuery().data;
  const newJit = api.jits.create.useMutation();
  const [filteredCategories, setFilteredCategories] = useState(allCategories);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const positionValue = form.watch("position");
  const positionName = positionValue?.name;

  type PositionCategoryRules = Record<string, string[]>;
  type CategoryNameRules = Record<string, Record<string, string>>;
  const categoryNameRules: CategoryNameRules = {
    pass: {
      defense: `Defending the ${positionName}`,
      pass: `Doing a ${positionName} pass`,
    },
    sweep: {
      sweep: `Doing a ${positionName} sweep`,
      defense: `Defending the ${positionName}`,
    },
    guard: {
      sweep: `Sweeping from ${positionName}`,
      guard: `Playing/Retaining ${positionName}`,
      submission: `Submitting from ${positionName}`,
    },
    takedown: {
      takedown: `Doing a ${positionName} takedown`,
      defense: `Defending the ${positionName}`,
    },
    control: {
      control: `Maintaining ${positionName}`,
      escape: `Escaping the ${positionName}`,
      submission: `Submitting from ${positionName}`,
    },
    escape: {
      escape: `Escaping the ${positionName}`,
      control: `Pinning from ${positionName}`,
      submission: `Submitting from ${positionName}`,
    },
    defense: {
      defense: `Defending the ${positionName}`,
      submission: `Submitting from ${positionName}`,
    },
    submission: {
      submission: `Submitting from ${positionName}`,
      defense: `Defending the ${positionName}`,
    },
  };

  function mapCategoryNames(
    category: FormData["category"],
    selectedPosition: FormData["position"],
  ) {
    if (selectedPosition) {
      const rules =
        categoryNameRules[selectedPosition.categoryType.name.toLowerCase()];

      // @ts-expect-error categoryNameRules cannot be undefined
      if (rules ?? rules[category.name.toLowerCase()]) {
        // @ts-expect-error categoryNameRules cannot be undefined
        return `${rules[category.name.toLowerCase()]}`;
      }
    }
    return category.name;
  }

  // Filter categories based on the selected position
  // states which categories should be shown, based on the rules above
  // Update the filtered categories whenever the selected position changes

  useEffect(() => {
    const positionCategoryRules: PositionCategoryRules = {
      control: ["escape", "control", "submission"],
      defense: ["defense", "control", "takedown"],
      escape: ["escape", "control", "submission"],
      guard: ["sweep", "guard", "submission"],
      pass: ["defense", "pass"],
      submission: ["defense", "submission"],
      sweep: ["sweep", "defense"],
      takedown: ["takedown", "defense"],
    };

    function filterCategories(
      category: FormData["category"],
      selectedPosition: FormData["position"],
    ) {
      if (selectedPosition) {
        const rules =
          selectedPosition.categoryType &&
          positionCategoryRules[
            selectedPosition.categoryType.name.toLowerCase()
          ];
        if (rules && !rules.includes(category.name.toLowerCase())) {
          return false;
        }
      }
      return true;
    }

    const selectedPosition = form.getValues("position");
    setFilteredCategories(
      allCategories?.filter((category) =>
        filterCategories(category, selectedPosition),
      ),
    );
  }, [allCategories, form, positionValue]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // newJit.mutate({
      //   categoryId: data.category,
      //   moveId: data.move,
      //   positionId: data.position,
      // });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem creating this Jit.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    toast({
      duration: 6000,

      className: "bg-primary text-background",
      title: "Created New Jit",
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
          <div className="">
            <strong>Action:</strong> {data.category.name}
          </div>
        </>
      ),
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    });
  }

  // Select either a move, a position, or both.

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 md:px-20"
      >
        {/* POSITIONS AND MOVES */}
        <div className="space-y-2 pb-4">
          <FormDescription className="text-center">
            Select a position/move (or both):
          </FormDescription>
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
                                    ? "bg-accent "
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
                                    ? "bg-accent "
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
        {/* ACTION (CATEGORIES) */}
        <div className="space-y-2">
          <FormDescription className="text-center">
            Then select your action in this Jit:
          </FormDescription>
          <FormField
            control={form.control}
            name="category"
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
                              allCategories?.find(
                                (category) => category.id === field.value?.id,
                              )?.name
                            }
                          </>
                        ) : (
                          "My Action"
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
                      <CommandInput placeholder="Find your action..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[15vh]">
                          <PopoverClose className="w-full">
                            {filteredCategories?.map((category) => {
                              const categoryName = mapCategoryNames(
                                category,
                                form.getValues("position"),
                              );
                              return (
                                <CommandItem
                                  className={cn(
                                    category.id === field.value?.id
                                      ? "bg-accent "
                                      : "bg-none",
                                  )}
                                  value={categoryName}
                                  key={category.id}
                                  onSelect={() => {
                                    form.setValue("category", category);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category.id === field.value?.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {categoryName}
                                </CommandItem>
                              );
                            })}
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

        <div className="flex justify-center ">
          <Button size={"lg"} type="submit">
            CREATE JIT
          </Button>
        </div>
      </form>
    </Form>
  );
};
