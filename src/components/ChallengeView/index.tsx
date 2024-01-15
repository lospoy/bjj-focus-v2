import { type RouterOutputs } from "~/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFavoriteJit } from "~/hooks/useFavoriteJit";
import { Icons } from "../ui/icons";

type Jit = RouterOutputs["jits"]["getAll"][number];

export const ChallengeView = (props: { jit: Jit }) => {
  const { jit } = props;
  const handleFocusClick = useFavoriteJit();

  return (
    <>
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
              <CardTitle className="flex flex-col items-start pt-1 text-lg leading-5">
                <JitTitle jit={jit} />
              </CardTitle>
              <Icons.eyeHalf className="h-6 w-6 text-gray-500" />
            </CardHeader>
          </button>

          {/* CHALLENGE PROGRESS */}
          <CardContent className="flex flex-row justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Challenge Progress</span>
              <span className="text-lg font-bold">0%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Due in:</span>
              <span className="text-lg font-bold">0 min</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
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
