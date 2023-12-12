// NoteFeed
// Handles displaying all Notes

// Used in:
// ~../pages/index
import { useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { Search } from "lucide-react";
import { JitNoteView } from "./JitNoteView";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitNotesFeed = (props: { jit: Jit }) => {
  const { jit } = props;
  const allNotesFromThisJit = api.notes.getNotesByJitId.useQuery({
    jitId: jit.id,
  }).data;

  const [searchTerm, setSearchTerm] = useState("");

  if (!allNotesFromThisJit) return <div>Something went wrong</div>;

  // Convert search term to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Filter notes based on the search term
  const filteredNotes = allNotesFromThisJit?.filter((note) =>
    note.body.toLowerCase().includes(lowerCaseSearchTerm),
  );

  // Sort notes based on the number of sessions, descending order
  filteredNotes?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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
          placeholder="search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-md mb-4 flex h-10 w-full rounded bg-pink-400/10 pl-[14px] placeholder-gray-400 placeholder:font-mono placeholder:uppercase focus:border-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Render NoteViews based on the filtered results */}
      {filteredNotes?.map((note) => (
        <div key={note.id}>
          <JitNoteView note={note} />
        </div>
      ))}
    </div>
  );
};