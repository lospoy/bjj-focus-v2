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
import { type Positions } from "./types";

export const PositionFormField = (props: { allPositions: Positions }) => {
  const { allPositions } = props;
  const form = useJitCreatorForm();

  return (
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
  );
};
