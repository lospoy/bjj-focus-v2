// FullJitFeed
// Handles displaying all Jits (known and unknown)

// Used in:
// ~../pages/index
import { useState } from "react";
import { api } from "~/utils/api";
import { ActiveJitView } from "./ActiveJitView";
import { InactiveJitView } from "./InactiveJitView";
import { Search } from "lucide-react";

// ... (other imports and code)

export const FullJitFeed = () => {
  let allJits = api.jits.getAll.useQuery().data;
  const allActiveJits = api.activeJits.getAllKnownByThisUser.useQuery().data;

  const [searchTerm, setSearchTerm] = useState("");

  if (!allJits) return <div>Something went wrong</div>;

  if (allActiveJits) {
    const activeJitIds = allActiveJits.map((activeJit) => activeJit.jitId);
    // Filter out Jits whose id is in activeJitIds
    allJits = allJits.filter((jit) => !activeJitIds.includes(jit.id));
  }

  // Convert search term to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filter jits based on the search term
  const filteredActiveJits = allActiveJits?.filter(
    (activeJit) =>
      activeJit.jit.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      activeJit.jit.position.name.toLowerCase().includes(lowerCaseSearchTerm),
  );

  const filteredJits = allJits.filter(
    (jit) =>
      jit.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      jit.position.name.toLowerCase().includes(lowerCaseSearchTerm),
  );

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

      {/* Render ActiveJitViews based on the filtered results */}
      {filteredActiveJits?.map((activeJit) => (
        <div key={activeJit.jitId}>
          <ActiveJitView activeJit={activeJit} />
        </div>
      ))}

      {/* Render InactiveJitViews based on the filtered results */}
      {filteredJits.map((jit) => (
        <div key={jit.id}>
          <InactiveJitView jit={jit} />
        </div>
      ))}
    </div>
  );
};
