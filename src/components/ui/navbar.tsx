import Link from "next/link";
import { UserNav } from "./user-nav";
import { BurgerNav } from "./burger-nav";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white md:border-0">
      <div className="mx-auto max-w-screen-xl items-center">
        <div className="flex items-center justify-between py-3">
          <div className="hidden">
            <BurgerNav />
          </div>
          <Link href="/">
            <h1 className="text-3xl font-bold text-accent">PokePoke</h1>
          </Link>
          <UserNav />
        </div>
      </div>
    </nav>
  );
}
