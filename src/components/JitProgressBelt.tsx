// JitProgressBelt
import { generateBeltRules, rules } from "~/utils/beltRules";

export const JitProgressBelt = ({
  sessionCount = 0,
}: {
  sessionCount?: number;
}) => {
  const squares = [];
  const beltRules = generateBeltRules(rules);

  const currentRule = beltRules.find(
    (r) => sessionCount >= r.min && sessionCount <= r.max,
  );

  if (currentRule) {
    const firstRuleWithCurrentColor = beltRules.find(
      (r) => r.beltColor === currentRule.beltColor,
    );

    const lastRuleWithCurrentColor = [...beltRules]
      .reverse()
      .find((r) => r.beltColor === currentRule.beltColor);

    const levelSteps = lastRuleWithCurrentColor
      ? lastRuleWithCurrentColor.max - (firstRuleWithCurrentColor?.min ?? 0)
      : currentRule.max - (firstRuleWithCurrentColor?.min ?? 0);

    const completedSteps = sessionCount - (firstRuleWithCurrentColor?.min ?? 0);

    const squareWidth = 100 / (levelSteps + 1); // Calculate the width of each square dynamically

    for (let i = 0; i <= levelSteps; i++) {
      if (i < completedSteps) {
        squares.push(
          <div
            key={i}
            className="mr-[1.5px] h-4 rounded-sm bg-primary"
            style={{ width: `${squareWidth}%` }}
          />,
        );
      } else {
        squares.push(
          <div
            key={i}
            className="mr-[1.5px] h-4 rounded-sm bg-primary/10"
            style={{ width: `${squareWidth}%` }}
          />,
        );
      }
    }
  }

  return <div className="flex">{squares}</div>;
};
