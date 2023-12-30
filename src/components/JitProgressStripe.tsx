// JitProgressStripe
import { generateBeltRules, rules } from "~/utils/beltRules";

export const JitProgressStripe = ({
  sessionCount = 0,
}: {
  sessionCount?: number;
}) => {
  const squares = [];
  const beltRules = generateBeltRules(rules);
  const rule = beltRules.find(
    (r) => sessionCount >= r.min && sessionCount <= r.max,
  );

  if (rule) {
    const levelSteps = rule.max - rule.min + 1;
    const completedSteps = sessionCount - rule.min;

    const squareWidth = 100 / levelSteps; // Calculate the width of each square dynamically

    for (let i = 0; i < levelSteps; i++) {
      if (i < completedSteps) {
        squares.push(
          <div
            key={i}
            className="mr-1 h-4 rounded-sm bg-slate-500"
            style={{ width: `${squareWidth}%` }}
          />,
        );
      } else {
        squares.push(
          <div
            key={i}
            className="mr-1 h-4 rounded-sm bg-slate-300"
            style={{ width: `${squareWidth}%` }}
          />,
        );
      }
    }
  }

  return <div className="flex">{squares}</div>;
};
