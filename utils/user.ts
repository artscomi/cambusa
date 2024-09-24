export const getMaxAiCall = (hasPaidForIncrease: boolean) =>
  hasPaidForIncrease ? 5 : 3;
