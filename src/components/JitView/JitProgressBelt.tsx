// JitProgressBelt
export type BeltRuleType = {
  beltColor: "white" | "blue" | "purple" | "brown" | "black";
  sessionsPerStripe: number;
};

type BeltRule = {
  min: number;
  max: number;
  numberOfStripes: number;
  beltColor: string;
};

export const rules: BeltRuleType[] = [
  { beltColor: "blue", sessionsPerStripe: 3 },
  { beltColor: "purple", sessionsPerStripe: 4 },
  { beltColor: "brown", sessionsPerStripe: 5 },
  { beltColor: "black", sessionsPerStripe: 6 },
];

const generateWhiteBeltRules = () => {
  const whiteBeltRules = [];
  for (let i = 0; i < 5; i++) {
    whiteBeltRules.push({
      min: i * 2,
      max: i * 2 + 2,
      numberOfStripes: i,
      beltColor: "white",
    });
  }
  return whiteBeltRules;
};

const generateColoredBeltRules = (rules: BeltRuleType[], startMin: number) => {
  const coloredBeltRules: BeltRule[] = [];
  let currentMin = startMin;

  rules.forEach((rule) => {
    for (let i = 0; i < 5; i++) {
      const max = currentMin + rule.sessionsPerStripe - 1;
      coloredBeltRules.push({
        min: currentMin,
        max: max,
        numberOfStripes: i,
        beltColor: rule.beltColor,
      });
      currentMin = max + 1;
    }
  });

  return { coloredBeltRules, currentMin };
};

export const generateBeltRules = (rules: BeltRuleType[]) => {
  const whiteBeltRules = generateWhiteBeltRules();
  const { coloredBeltRules, currentMin } = generateColoredBeltRules(rules, 11);

  const beltRules = [...whiteBeltRules, ...coloredBeltRules];

  beltRules.push({
    min: currentMin,
    max: Infinity,
    numberOfStripes: 0,
    beltColor: "black",
  });

  return beltRules;
};

const generateSquares = (sessionCount: number, beltRules: BeltRule[]) => {
  const squares = [];
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
      const squareClass =
        i < completedSteps ? "bg-gray-500" : "bg-slate-300/60";
      squares.push(
        <div
          key={i}
          className={`mr-[1.6px] h-3 rounded-sm ${squareClass}`}
          style={{ width: `${squareWidth}%` }}
        />,
      );
    }
  }

  return squares;
};

export const JitProgressBelt = ({
  sessionCount = 0,
}: {
  sessionCount?: number;
}) => {
  const beltRules = generateBeltRules(rules);
  const squares = generateSquares(sessionCount, beltRules as BeltRule[]);

  return <div className="flex">{squares}</div>;
};
