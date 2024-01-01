import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/libs/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { PopoverClose } from "@radix-ui/react-popover";
import { useJitCreatorForm } from "./FormSchema";
import { type Moves } from "./types";

export const MoveFormField = (props: { allMoves: Moves }) => {
  const { allMoves } = props;
  const form = useJitCreatorForm();

  return (
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
                        allMoves?.find((move) => move.id === field.value?.id)
                          ?.name
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
  );
};
