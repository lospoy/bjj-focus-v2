import { ChevronLeftSquare, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { useToastWithAction } from "~/hooks/useToastWithAction";
import { type RouterOutputs, api } from "~/utils/api";
import { Icons } from "./ui/icons";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { toast } from "./ui/use-toast";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitToastDescription = (props: { jit: Jit }) => {
  const { jit } = props;

  return (
    <>
      {jit.move && (
        <div className="">
          <strong>Move:</strong> {jit.move?.name}
        </div>
      )}
      {jit.position && (
        <div className="">
          <strong>Position:</strong> {jit.position?.name}
        </div>
      )}
    </>
  );
};

export default function JitMenu(props: { jit: Jit }) {
  const { jit } = props;
  const ctx = api.useUtils();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuClicked(open);
  };

  // MAKE FAVORITE HANDLERS
  // TOAST AND UNDO
  const handleFavoriteClick = () => {
    try {
      jitMakeFavorite.mutate({
        ...jit,
        isFavorite: !jit.isFavorite,
      });
    } catch (e: unknown) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem updating this Jit.",
      });
    }
  };
  // API CALL
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

  // ADD SESSION HANDLERS
  // TOAST AND UNDO
  const handleAddSessionClick = useToastWithAction()(
    "Adding Session...",
    <JitToastDescription jit={jit} />,
    undefined,
    // undo callback
    () => {
      ctx.jits.getAll.setData(
        undefined,
        (previousSessions) => previousSessions?.slice(1),
      );
    },
  );
  // API CALL AND ADDING FAKE DATA TO THE CACHE
  const jitAddSession = api.sessions.create.useMutation({
    onMutate: (newSession) => {
      // Optimistically update to the new value
      ctx.jits.getAll.setData(
        undefined,
        (previousSessions) =>
          previousSessions?.map((s) => {
            return { ...s, ...newSession };
          }),
      );
    },

    onSettled: () => {
      void ctx.jits.getAll.invalidate();
    },
  });

  return (
    <div className="rounded-md bg-accent p-2 text-background shadow-md">
      <DropdownMenu onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <ChevronLeftSquare
            className={`h-8 w-8 transition-transform duration-500 ${
              isMenuClicked ? "-rotate-90" : "rotate-0"
            }`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-mt-1 bg-background">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <button className="flex" onClick={handleFavoriteClick}>
                {jit.isFavorite ? (
                  <Icons.eyeHalf className="mt-0.5 h-4 w-4 fill-background" />
                ) : (
                  <EyeClosedIcon className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {jit.isFavorite ? "Remove focus" : "Focus on this"}
                </span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="flex"
                onClick={() =>
                  handleAddSessionClick(() =>
                    jitAddSession.mutate({ jitId: jit.id }),
                  )
                }
              >
                <Plus className="mt-0.5 h-4 w-4" />
                <span className="ml-2">Add Session</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
