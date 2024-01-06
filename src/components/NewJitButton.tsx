import { Plus } from "lucide-react";
import Link from "next/link";

export default function NewJitButton() {
  return (
    <Link href="/newJit">
      <div className="fixed bottom-8 right-8 w-14 rounded-md bg-accent p-2 text-secondary shadow-md md:hidden">
        <Plus className="h-10 w-10" />
      </div>
    </Link>
  );
}
