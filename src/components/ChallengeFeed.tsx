import { type RouterOutputs } from "~/utils/api";
import { ChallengeView } from "./ChallengeView";

interface JitFeedProps {
  jits?: boolean;
  dashboard?: boolean;
  allJits?: GetAllJit;
}

export type GetAllJit = RouterOutputs["jits"]["getAll"];

export const ChallengeFeed = ({ allJits: jitsFromProps }: JitFeedProps) => {
  const allJits = jitsFromProps;

  return (
    <div className="flex flex-col">
      {/* Render JitViews based on the filtered results */}
      {allJits?.map((jit) => (
        // ADDING MARGIN TO THE LAST JIT SO IT DOES NOT COLLIDE WITH THE ACTION BUTTON
        <div key={jit.id} className="last:mb-32">
          <ChallengeView jit={jit} />
        </div>
      ))}
    </div>
  );
};
