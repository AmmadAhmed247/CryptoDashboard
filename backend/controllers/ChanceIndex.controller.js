import axios from "axios";
export const calculateChanceIndex = (TS_norm, CS_weekly_norm, CQS_norm, MoonshotFactor) => {
  const CI = 0.35*TS_norm + 0.25*CS_weekly_norm + 0.2*CQS_norm + 0.2*MoonshotFactor;

  let sentiment = "Low";
  if (CI>=70 && MoonshotFactor<75) sentiment = "High Chance → Staggered Entry 25–50%";
  else if (CI>=70 && MoonshotFactor>=75) sentiment = "Medium Chance → Staggered Entry 20–30%";
  else if (CI>=50 && CI<70) sentiment = "Medium → Watch";
  else sentiment = "Low → No Entry";

  return { CI, sentiment, breakdown: { TS_norm, CS_weekly_norm, CQS_norm, MoonshotFactor } };
};