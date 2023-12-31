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
import { useFavoriteJit } from "~/hooks/useFavoriteJit";
import { JitToastDescription } from "~/hooks/useSaveNoteToJit";

type Jit = RouterOutputs["jits"]["getAll"][number];

export default function JitMenu(props: { jit: Jit }) {
  const { jit } = props;
  const ctx = api.useUtils();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuClicked(open);
  };

  // MAKE FAVORITE HANDLERS
  const handleFavoriteClick = useFavoriteJit();

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
    <div className="rounded-md bg-secondary p-2 text-background shadow-md">
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
                onClick={(e) => handleFavoriteClick(jit, e)}
              >
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