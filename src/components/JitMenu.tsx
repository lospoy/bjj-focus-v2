import {
  Edit,
  LucideTrash,
  MinusCircle,
  MoreVertical,
  PlusCircle,
  Trash,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { type RouterOutputs } from "~/utils/api";
import { useJitAddSession } from "~/hooks/useJitAddSession";
import { useJitRemoveLastSession } from "~/hooks/useJitRemoveLastSession";
import { useDeleteJit } from "~/hooks/useDeleteJit";
import { DrawingPinFilledIcon } from "@radix-ui/react-icons";

type Jit = RouterOutputs["jits"]["getAll"][number];

export default function JitMenu(props: { jit: Jit }) {
  const { jit } = props;
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuClicked(open);
  };

  // ADD/REMOVE SESSION BUTTONS & HANDLERS
  const JitAddSession = (props: { jit: Jit }) => {
    const { jit } = props;
    const { handleAddSessionClick } = useJitAddSession({ jit });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleAddSessionClick();
    };

    return (
      <button onClick={handleClick} className="flex rounded-xl text-xs">
        <PlusCircle className="h-4 w-4" />
        <span className="ml-2">Add Session</span>
      </button>
    );
  };
  const JitRemoveLastSession = (props: { jit: Jit }) => {
    const { jit } = props;
    const { handleRemoveLastSessionClick } = useJitRemoveLastSession({ jit });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleRemoveLastSessionClick();
    };

    return (
      <button onClick={handleClick} className="flex rounded-xl text-xs">
        <MinusCircle className="h-4 w-4" />
        <span className="ml-2">Remove Session</span>
      </button>
    );
  };
  // DELETE JIT BUTTON & HANDLER
  const JitDelete = (props: { jit: Jit }) => {
    const { jit } = props;
    const { handleDeleteJitClick } = useDeleteJit({ jit: jit });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleDeleteJitClick({ jitId: jit.id });
    };

    return (
      <button
        onClick={handleClick}
        className="flex rounded-xl text-xs font-semibold text-red-600"
      >
        <Trash2 className="h-4 w-4 " />
        <span className="ml-2">DELETE JIT</span>
      </button>
    );
  };

  const EditMode = (props: { isEditMode: boolean }) => {
    const { isEditMode } = props;

    return !isEditMode ? (
      <DropdownMenuItem>
        <button
          onClick={(e) => {
            setIsEditMode(true);
            e.preventDefault();
          }}
          className="flex flex-row text-xs"
        >
          <Edit className="h-4 w-4" />
          <span className="ml-2">Edit Jit</span>
        </button>
      </DropdownMenuItem>
    ) : (
      <>
        <DropdownMenuItem>
          <JitDelete jit={jit} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <JitRemoveLastSession jit={jit} />
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <div className="rounded-md bg-secondary p-1 text-background shadow-md">
      <DropdownMenu onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <MoreVertical
            className={`h-5 w-5 transition-transform duration-500 ${
              isMenuClicked ? "-rotate-90" : "rotate-0"
            }`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-mt-1 bg-background">
          <DropdownMenuGroup>
            <EditMode isEditMode={isEditMode} />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <JitAddSession jit={jit} />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
