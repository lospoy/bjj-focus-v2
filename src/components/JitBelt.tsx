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
    <div className="-ml-3 flex h-[36px]">
      <div className="z-10 -mr-2 w-4 border-r-[1px] border-gray-600 bg-card-secondary  " />
      <Belt
        className="h-[32px] w-[180px] -scale-x-100 transform opacity-95 drop-shadow-md md:w-[190px]"
        numberOfStripes={numberOfStripes}
        beltColor={beltColor}
      />
    </div>
  );
};
