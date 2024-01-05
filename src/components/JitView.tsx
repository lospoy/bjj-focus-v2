// JitView
// Handles displaying a single Active Jit

// Used in:
// ~/FullJitFeed
import { type RouterOutputs } from "~/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { JitBelt } from "./JitBelt";
import { JitProgressBelt } from "./JitProgressBelt";
// import { humanDate } from "~/utils/humanDate";
import { useFavoriteJit } from "~/hooks/useFavoriteJit";
import JitMenu from "./JitMenu";
import { JitNoteDialog } from "./JitNoteDialog";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const JitView = (props: { jit: Jit }) => {
  const { jit } = props;
  const handleFocusClick = useFavoriteJit();

  const JitSessionsAndMenu = (props: { jit: Jit }) => {
    const { jit } = props;

    return (
      <div className="flex flex-row px-4 pb-4 text-xs font-semibold">
        <div className="mr-4 flex w-full flex-col">
          {jit.isFavorite && <h3>Sessions to next belt</h3>}
          <JitProgressBelt sessionCount={jit.sessionCount} />
        </div>
        <JitMenu jit={jit} />
      </div>
    );
  };

  const JitContentSlim = () => {
    return <CardContent className="pb-0"></CardContent>;
  };

  const JitFocused = () => {
    return (
      <>
        <CardContent className="mb-6 p-0 pt-2">
          <JitNoteDialog jit={jit} />
        </CardContent>
        <CardContent className="p-0">
          <JitSessionsAndMenu jit={jit} />
        </CardContent>
      </>
    );
  };

  return (
    <div
      className={`parent-component relative rounded-xl
      ${jit.isFavorite ? "bg-card-secondary" : "bg-zinc-100"}
      `}
    >
      <Card
        className={`mb-4 bg-inherit ${
          jit.isFavorite ? "" : " opacity-40 shadow-none"
        } `}
      >
        <button onClick={(e) => handleFocusClick(jit, e)}>
          <CardHeader className="mb-2 flex flex-row p-0 pl-3 pt-1">
            <CardTitle className="flex flex-col items-start pt-1 text-xl leading-5 ">
              <JitTitle jit={jit} />
            </CardTitle>
            <JitBelt
              sessionCount={jit.sessionCount}
              isFavorite={jit.isFavorite}
            />
          </CardHeader>
        </button>

        {/* JIT CONTENT */}
        {jit.isFavorite && <JitFocused />}
        {!jit.isFavorite && <JitContentSlim />}
      </Card>
    </div>
  );
};

export const JitTitle = (props: { jit: Jit }) => {
  const { jit } = props;

  if (jit.position && jit.move) {
    return (
      <>
        <span>{jit.move.name}</span>
        <div>
          {" "}
          <span className="text-sm">from </span>
          <span>{jit.position.name}</span>
        </div>
      </>
    );
  } else if (jit.position && !jit.move) {
    return (
      <>
        <span className="text-sm">any move from</span>
        <span>{jit.position.name}</span>
      </>
    );
  } else if (!jit.position && jit.move) {
    return (
      <>
        <span>{jit.move.name}</span>
        <span className="text-sm">from any position</span>
      </>
    );
  }
  return null;
};
