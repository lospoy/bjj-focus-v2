// JitBelt

import { generateBeltRules, rules } from "~/utils/beltRules";
import { Belt } from "./ui/belt";

export const JitBelt = ({ sessionCount = 0 }: { sessionCount?: number }) => {
  const beltRules = generateBeltRules(rules);

  let numberOfStripes = 0;
  let beltColor: "white" | "blue" | "purple" | "brown" | "black" = "white";

  const rule = beltRules.find(
    (r) => sessionCount >= r.min && sessionCount <= r.max,
  );

  if (rule) {
    numberOfStripes = rule.numberOfStripes;
    beltColor = rule.beltColor as
      | "white"
      | "blue"
      | "purple"
      | "brown"
      | "black";
  }

  return (
    // TO PROPERLY ADJUST BELT WIDTH, WE PROBABLY NEED TO MODIFY THE SVG'S WIDTH
    // VIA A PROP, BASED ON VIEWPORT WIDTH - maybe we could do some kind of clamp, or use wh
    <Belt
      className="absolute -right-2 h-[35px] w-max drop-shadow-lg"
      numberOfStripes={numberOfStripes}
      beltColor={beltColor}
    />
  );
};
