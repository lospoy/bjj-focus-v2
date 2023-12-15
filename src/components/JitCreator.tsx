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

const FormSchema = z
  .object({
    move: z.object({ name: z.string(), id: z.string() }).optional(),
    position: z.object({ name: z.string(), id: z.string() }).optional(),
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

export const JitCreator = () => {
  const { toast } = useToast();
  const allCategories = api.categories.getAll.useQuery().data;
  const allPositions = api.positions.getAll.useQuery().data;
  const allMoves = api.moves.getAll.useQuery().data;
  const newJit = api.jits.create.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

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
      title: "Created New Jit",
      description: (
        <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      action: <ToastAction altText="Try again">Undo</ToastAction>,
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
            Select a position, a move, or a combination of both.
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
                          {allPositions?.map((position) => (
                            <CommandItem
                              value={position.name}
                              key={position.id}
                              onSelect={() => {
                                form.setValue("position", position);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  position === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {position.name}
                            </CommandItem>
                          ))}
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
                          {allMoves?.map((move) => (
                            <CommandItem
                              value={move.name}
                              key={move.id}
                              onSelect={() => {
                                form.setValue("move", move);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  move === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {move.name}
                            </CommandItem>
                          ))}
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
        {/* ROLE (CATEGORIES) */}
        <div className="space-y-2">
          <FormDescription className="text-center">
            Then select what is your role in this Jit.
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
                          "My role"
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
                      <CommandInput placeholder="Select your role in this jit..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {allCategories?.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              form.setValue("category", category);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
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
