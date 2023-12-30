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
    // TO PROPERLY ADJUST BELT WIDTH, WE PROBABLY NEED TO MODIFY THE SVG'S WIDTH VIA A PROP
    <Belt
      className="absolute -left-2 h-[35px] w-[160px] -scale-x-100 opacity-95 drop-shadow-lg md:w-max"
      numberOfStripes={numberOfStripes}
      beltColor={beltColor}
    />
  );
};
