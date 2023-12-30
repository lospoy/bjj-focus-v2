import Link from "next/link";
import { UserNav } from "./UserNav";
import {
  BarChart4,
  EyeIcon,
  LampDesk,
  Menu,
  MessageSquare,
  Network,
  Option,
  PlusCircle,
  Settings,
  Shapes,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function TopNav() {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const { isSignedIn } = useUser();

  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuClicked(open);
  };

  return (
    <>
      {isMenuClicked && (
        <div className="fixed inset-0 z-10 bg-black opacity-40"></div>
      )}
      <nav className="sticky top-0 z-10 w-full bg-secondary px-4 md:border-0 ">
        <div className="mx-auto md:max-w-3xl">
          <div className="flex justify-between pb-1 pt-2">
            {isSignedIn ? (
              <DropdownMenu onOpenChange={handleMenuOpenChange}>
                <DropdownMenuTrigger
                  asChild
                  className={`mt-1 ${
                    isMenuClicked ? "text-background" : "text-background"
                  }`}
                >
                  <Menu
                    className={`transition-transform duration-500 ${
                      isMenuClicked ? "rotate-90" : ""
                    }`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ml-4 w-56 bg-background">
                  <DropdownMenuLabel className="text-[#a4a5a6]">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  {/* NEXT SECTION */}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Training</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {/* JITS SUBMENU */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Shapes className="mr-2 h-4 w-4" />
                        <span>Jits</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <Link href="/jitsPage">
                            <DropdownMenuItem>
                              <Shapes className="mr-2 h-4 w-4" />
                              <span>All Jits</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem disabled>
                            <BarChart4 className="mr-2 h-4 w-4" />
                            <span>Jits Report</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <Link href="/newJit">
                            <DropdownMenuItem>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>New Jit</span>
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    {/* SEQUENCES SUBMENU */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger
                        disabled
                        className="text-[#a4a5a6]"
                      >
                        <Network className="mr-2 h-4 w-4" />
                        <span>Sequences</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <Option className="mr-2 h-4 w-4" />
                            <span>All Sequences</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart4 className="mr-2 h-4 w-4" />
                            <span>Sequences Report</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>New Sequence</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>

                  {/* OTHER SECTION */}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[#a4a5a6]">
                    App
                  </DropdownMenuLabel>
                  <DropdownMenuItem disabled>
                    <LampDesk className="mr-2 h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Feedback</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className=""></div>
            )}
            <Link href="/">
              <h1 className="-mt-1 text-[1.6rem] font-bold text-background">
                BJJ FOCUS
              </h1>
            </Link>
            {isSignedIn ? <UserNav /> : <div className=""></div>}
          </div>
        </div>
      </nav>
    </>
  );
}
