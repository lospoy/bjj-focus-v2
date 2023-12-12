import Link from "next/link";
import { UserNav } from "./ui/user-nav";
import { BurgerNav } from "./ui/burger-nav";

export default function TopNav() {
  return (
    <nav className="w-full bg-inherit px-4  md:border-0">
      <div className="mx-auto items-center md:max-w-3xl">
        <div className="flex items-center justify-between py-3">
          <div className="hidden">
            <BurgerNav />
          </div>
          <Link href="/">
            <h1 className="text-3xl font-bold text-accent">BJJ FOCUS</h1>
          </Link>
          <UserNav />
        </div>
      </div>
    </nav>
  );
}
