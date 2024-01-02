import { useState } from "react";
import { type RouterOutputs } from "~/utils/api";
import { JitView } from "./JitView";
import { Search } from "lucide-react";

interface JitFeedProps {
  jits?: boolean;
  dashboard?: boolean;
  allJits?: GetAllJit;
}

export type GetAllJit = RouterOutputs["jits"]["getAll"];

export const JitFeed = ({ jits, allJits: jitsFromProps }: JitFeedProps) => {
  const allJits = jitsFromProps;
  const [searchTerm, setSearchTerm] = useState("");

  // Filter jits based on the search term or isFavorite property
  const filteredJits = allJits?.filter(
    (jit) =>
      jit?.position?.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
      jit?.move?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort jits based on the number of sessions, descending order
  filteredJits?.sort((a, b) => b.sessionCount - a.sessionCount);
  // Sort jits based on isFavorite, favorite jits come first
  filteredJits?.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) {
      return -1;
    }
    if (b.isFavorite && !a.isFavorite) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col">
      {/* Conditionally render Search Input */}
      {jits && (
        <div className="relative -mt-2">
          <Search
            className="absolute right-[14px] top-1/2 h-4 w-4 -translate-y-4 transform text-gray-400"
            strokeWidth={2.2}
          />
          <input
            type="text"
            placeholder="search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-md mb-4 flex h-10 w-full rounded bg-slate-400/20 pl-[14px] text-secondary placeholder-gray-400 placeholder:font-mono placeholder:uppercase focus:border-none focus:outline-none focus:ring-0"
          />
        </div>
      )}

      {/* Render JitViews based on the filtered results */}
      {filteredJits?.map((jit) => (
        <div key={jit.id}>
          <JitView jit={jit} />
        </div>
      ))}
    </div>
  );
};
