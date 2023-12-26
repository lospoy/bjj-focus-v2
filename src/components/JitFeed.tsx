import { useState } from "react";
import { type RouterOutputs } from "~/utils/api";
import { JitView } from "./JitView";
import { Search } from "lucide-react";

interface JitFeedProps {
  jitsPage?: boolean;
  dashboard?: boolean;
  allJits?: GetAllJit;
}

export type GetAllJit = RouterOutputs["jits"]["getAll"];

export const JitFeed = ({
  jitsPage,
  dashboard,
  allJits: jitsFromProps,
}: JitFeedProps) => {
  const allJits = jitsFromProps;
  const [searchTerm, setSearchTerm] = useState("");

  // Filter jits based on the search term or isFavorite property
  let filteredJits = allJits;

  if (jitsPage) {
    filteredJits = allJits?.filter(
      (jit) =>
        jit?.position?.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
        jit?.move?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  } else if (dashboard) {
    filteredJits = allJits?.filter((jit) => jit.isFavorite);
  }

  // Sort jits based on the number of sessions, descending order
  filteredJits?.sort((a, b) => b.sessionCount - a.sessionCount);

  return (
    <div className="flex flex-col">
      {/* Conditionally render Search Input */}
      {jitsPage && (
        <div className="relative -mt-2">
          <Search
            className="absolute right-[14px] top-1/2 h-4 w-4 -translate-y-4 transform text-gray-400"
            strokeWidth={2.2}
          />
          <input
            type="text"
            placeholder="search all jits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-md mb-6 flex h-10 w-full rounded bg-gray-400/10 pl-[14px] text-accent placeholder-gray-400 placeholder:font-mono placeholder:uppercase focus:border-none focus:outline-none focus:ring-0"
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
