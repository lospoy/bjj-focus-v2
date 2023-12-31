import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";

// Store
import { LogOut, Settings } from "lucide-react";

export function UserNav() {
  const userData = useUser().user;
  const { signOut, openUserProfile } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.imageUrl} alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openUserProfile()}
          className="flex space-x-1"
        >
          <Settings className="w-4" />
          <span className="top-4">My account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className="flex space-x-1">
          <LogOut className="w-4" />
          <span className="top-4">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
