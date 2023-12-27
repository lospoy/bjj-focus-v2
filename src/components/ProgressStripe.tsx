// ProgressStripe
import { generateBeltRules, rules } from "~/utils/beltRules";

export const ProgressStripe = ({
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
      if (sessionCount === 0) {
        squares.push(
          <div
            className="mr-1 h-4 rounded-sm bg-primary/10"
            style={{ width: `100%` }}
          />,
        );
      } else if (i < completedSteps) {
        squares.push(
          <div
            key={i}
            className="mr-1 h-4 rounded-sm bg-primary"
            style={{ width: `${squareWidth}%` }}
          />,
        );
      } else {
        squares.push(
          <div
            key={i}
            className="mr-1 h-4 rounded-sm bg-primary/10"
            style={{ width: `${squareWidth}%` }}
          />,
        );
      }
    }
  }

  return <div className="flex">{squares}</div>;
};
