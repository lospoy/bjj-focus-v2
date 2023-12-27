// utils.ts
export type BeltRuleType = {
  beltColor: "white" | "blue" | "purple" | "brown" | "black";
  sessionsPerStripe: number;
};

export const rules: BeltRuleType[] = [
  { beltColor: "blue", sessionsPerStripe: 3 },
  { beltColor: "purple", sessionsPerStripe: 4 },
  { beltColor: "brown", sessionsPerStripe: 5 },
  { beltColor: "black", sessionsPerStripe: 6 },
];

export const generateBeltRules = (rules: BeltRuleType[]) => {
  const beltRules = [
    { min: 0, max: 0, numberOfStripes: 0, beltColor: "white" },
    { min: 1, max: 2, numberOfStripes: 1, beltColor: "white" },
    { min: 3, max: 4, numberOfStripes: 2, beltColor: "white" },
    { min: 5, max: 7, numberOfStripes: 3, beltColor: "white" },
    { min: 8, max: 10, numberOfStripes: 4, beltColor: "white" },
  ];

  let currentMin = 11;

  rules.forEach((rule) => {
    for (let i = 0; i < 5; i++) {
      const max = currentMin + rule.sessionsPerStripe - 1;
      beltRules.push({
        min: currentMin,
        max: max,
        numberOfStripes: i,
        beltColor: rule.beltColor,
      });
      currentMin = max + 1;
    }
  });

  beltRules.push({
    min: currentMin,
    max: Infinity,
    numberOfStripes: 0,
    beltColor: "black",
  });

  return beltRules;
};
