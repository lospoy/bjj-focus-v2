// JitFeed
// Handles displaying all Jits

// Used in:
// ~../pages/index
import { useState } from "react";
import { api } from "~/utils/api";
import { JitView } from "./JitView";
import { Search } from "lucide-react";

export const JitFeed = () => {
  const allJits = api.jits.getAll.useQuery().data;

  const [searchTerm, setSearchTerm] = useState("");

  if (!allJits) return <div>Something went wrong</div>;

  // Convert search term to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filter jits based on the search term
  const filteredJits = allJits?.filter(
    (jit) =>
      jit.category?.name.toLowerCase().includes(lowerCaseSearchTerm) ??
      jit.position?.name.toLowerCase().includes(lowerCaseSearchTerm) ??
      jit.move?.name.toLowerCase().includes(lowerCaseSearchTerm),
  );

  // Sort jits based on the number of sessions, descending order
  filteredJits?.sort((a, b) => b.sessionCount - a.sessionCount);

  return (
    <div className="flex flex-col">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute right-[14px] top-1/2 h-4 w-4 -translate-y-4 transform text-gray-400"
          strokeWidth={2.2}
        />
        <input
          type="text"
          placeholder="search jits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-md mb-4 flex h-10 w-full rounded bg-gray-400/10 pl-[14px] placeholder-gray-400 placeholder:font-mono placeholder:uppercase focus:border-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Render JitViews based on the filtered results */}
      {filteredJits?.map((jit) => (
        <div key={jit.id}>
          <JitView jit={jit} />
        </div>
      ))}
    </div>
  );
};
