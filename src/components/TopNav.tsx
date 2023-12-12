import Link from "next/link";
import { UserNav } from "./ui/user-nav";
import {
  BarChart4,
  Cloud,
  CreditCard,
  EyeIcon,
  Github,
  Keyboard,
  LampDesk,
  LifeBuoy,
  ListTree,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Network,
  Option,
  Plus,
  PlusCircle,
  Settings,
  Shapes,
  User,
  UserPlus,
  Users,
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

export default function TopNav() {
  return (
    <nav className="w-full bg-inherit px-4 md:border-0">
      <div className="mx-auto md:max-w-3xl">
        <div className="flex justify-between pt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background">
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
                <Link href="/">
                  <DropdownMenuItem>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    <span>Focus</span>
                  </DropdownMenuItem>
                </Link>

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
                      <DropdownMenuItem>
                        <BarChart4 className="mr-2 h-4 w-4" />
                        <span>Jits Report</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>New Jit</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                {/* SEQUENCES SUBMENU */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled className="text-[#a4a5a6]">
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
          <Link href="/">
            <h1 className="-mt-1 text-[1.6rem] font-bold text-accent">
              BJJ FOCUS
            </h1>
          </Link>
          <UserNav />
        </div>
      </div>
    </nav>
  );
}
