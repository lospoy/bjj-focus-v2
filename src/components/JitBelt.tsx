// JitBelt

import { generateBeltRules, rules } from "~/utils/beltRules";
import { Belt } from "./ui/belt";

export const JitBelt = ({
  sessionCount = 0,
  isFavorite,
}: {
  sessionCount?: number;
  isFavorite: boolean;
}) => {
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
    <>
      {isFavorite ? (
        <Belt
          className="absolute -right-2 h-[32px] w-[180px] opacity-95 drop-shadow-md md:w-[190px]"
          numberOfStripes={numberOfStripes}
          beltColor={beltColor}
        />
      ) : (
        <Belt
          className="absolute -right-2 h-[32px] w-[160px] opacity-95 drop-shadow-md md:w-[190px]"
          numberOfStripes={numberOfStripes}
          beltColor={beltColor}
        />
      )}
    </>
  );
};
