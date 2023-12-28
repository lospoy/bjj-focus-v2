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

type Jit = RouterOutputs["jits"]["getAll"][number];

export default function JitMenu(props: {
  jit: Jit;
  setIsFadingOut: (isFadingOut: boolean) => void;
}) {
  const { jit, setIsFadingOut } = props;
  const ctx = api.useUtils();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuClicked(open);
  };

  // MAKE FAVORITE HANDLERS
  const handleFavoriteClick = useToastWithAction();
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

  const toastDescription = (
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

  // ADD SESSION HANDLERS
  const handleAddSessionClick = useToastWithAction();
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
              <button
                className="flex"
                onClick={() => {
                  setIsFadingOut(true);
                  handleFavoriteClick(
                    jit.isFavorite
                      ? "Removing from Focus..."
                      : "Moving to Focus...",
                    toastDescription,
                    () =>
                      jitMakeFavorite.mutate({
                        ...jit,
                        isFavorite: !jit.isFavorite,
                      }),
                  );
                }}
              >
                {jit.isFavorite ? (
                  <Icons.eyeHalf className="mt-0.5 h-4 w-4 fill-background" />
                ) : (
                  <EyeClosedIcon className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {jit.isFavorite ? "Remove from Focus" : "Move to Focus"}
                </span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="flex"
                onClick={() =>
                  handleAddSessionClick(
                    "Adding Session...",
                    toastDescription,
                    () => jitAddSession.mutate({ jitId: jit.id }),
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
