import { useEffect, useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { JitView } from "./JitView";
import { Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { JitCreate, JitRecord } from "./JitCreator";

interface JitFeedProps {
  jitsPage?: boolean;
  dashboard?: boolean;
  allJits?: GetAllJit;
}

export type GetAllJit = RouterOutputs["jits"]["getAll"];

export const JitFeed = ({
  jitsPage,
  dashboard,
  allJits: fuckJist,
}: JitFeedProps) => {
  const allJits = [...(fuckJist ?? [])];
  // const _allJits = api.jits.getAll.useQuery().data;

  // const queryClient = useQueryClient();

  // const cachedJits = queryClient.getQueryData<(JitRecord | JitCreate)[]>([
  //   "jits",
  // ]);

  // const allJits = [
  //   ...(_allJits ?? []),
  //   ...(cachedJits ?? []),
  // ];

  const [searchTerm, setSearchTerm] = useState("");

  if (!allJits) return <div>Loading...</div>;

  // Convert search term to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filter jits based on the search term or isFavorite property
  let filteredJits = allJits;
  if (jitsPage) {
    filteredJits = allJits?.filter(
      (jit) =>
        jit?.position?.name.toLowerCase().includes(lowerCaseSearchTerm) ??
        jit?.move?.name.toLowerCase().includes(lowerCaseSearchTerm),
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
