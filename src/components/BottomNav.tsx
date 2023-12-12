import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";
import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-screen  bg-gray-950 text-gray-100">
      <Menubar className="h-14 justify-evenly border-0 bg-transparent text-gray-100">
        <MenubarMenu>
          <Link href={"/"}>
            <MenubarTrigger className="h-8 w-24 justify-center bg-gray-700 text-xs uppercase">
              Focus
            </MenubarTrigger>
          </Link>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="h-8 w-24 justify-center bg-gray-700 text-xs uppercase">
            Jits
          </MenubarTrigger>
          <MenubarContent className="bg-gray-800 text-gray-100">
            <MenubarItem className="px-4 py-2">New Jit</MenubarItem>
            <MenubarSeparator className="my-2" />
            <Link href={"/jitsPage"}>
              <MenubarItem className="px-4 py-2">All Jits</MenubarItem>
            </Link>
            <MenubarSeparator className="my-2" />
            <MenubarItem className="px-4 py-2" disabled>
              Jits Stats
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="h-8 w-24 justify-center bg-gray-700 text-xs uppercase">
            Sequences
          </MenubarTrigger>
          <MenubarContent className="bg-gray-800 text-gray-100">
            <MenubarItem className="px-4 py-2" disabled>
              New Sequence
            </MenubarItem>
            <MenubarSeparator className="my-2" />
            <MenubarItem className="px-4 py-2" disabled>
              All Sequences
            </MenubarItem>
            <MenubarSeparator className="my-2" />
            <MenubarItem className="px-4 py-2" disabled>
              Sequences Stats
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
