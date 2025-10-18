import axios from "axios";

// ----------------- Helper Functions -----------------
export const logNormalize = (value, min = 1, max = 1e12) => {
  if (!value || value <= min) return 0;
  if (value >= max) return 100;
  return ((Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))) * 100;
};

export const ratioNormalize = (value, min = 0, max = 1) => {
  if (!value || value <= min) return 0;
  if (value >= max) return 100;
  return ((value - min) / (max - min)) * 100;
};

// ----------------- CQS Value Calculation -----------------
export const calculateCQSValue = (coinData, lunarcrushData = null, githubData = null, ccData = null) => {
  // 1️⃣ FLF (Coin Age / Fair Launch)
  let FLF = 0;
  if (coinData.genesis_date) {
    const ageYears = (Date.now() - new Date(coinData.genesis_date).getTime()) / (1000 * 60 * 60 * 24 * 365);
    FLF = Math.min(100, (ageYears / 20) * 100);
  }

  // 2️⃣ TKS (Token Supply Ratios)
  const circ = coinData.market_data?.circulating_supply || 0;
  const total = coinData.market_data?.total_supply || circ || 1;
  const max = coinData.market_data?.max_supply || null;
  let TKS = 0;
  if (max && max > 0) {
    TKS = ratioNormalize(circ / max, 0, 1) * 0.6 + ratioNormalize(circ / total, 0, 1) * 0.4;
  } else {
    TKS = ratioNormalize(circ / total, 0, 1);
  }
  TKS = Math.min(100, TKS * 100);

  // 3️⃣ LRS (Listings & Liquidity)
  const tickers = coinData.tickers || [];
  let LRS = logNormalize(tickers.length, 1, 1000);
  const topExchanges = ["binance", "coinbase", "kraken", "okx", "bybit"];
  const topExchangeCount = tickers.filter(t =>
    topExchanges.includes(t.market?.identifier?.toLowerCase())
  ).length;
  LRS += Math.min(10, topExchangeCount * 2);

  if (ccData) {
    const volume = ccData.VOLUME24HOUR || 0;
    const marketCap = ccData.MKTCAP || 0;
    const liquidityScore = logNormalize(volume, 1, 1e9) * 0.5 + logNormalize(marketCap, 1, 1e10) * 0.5;
    LRS = Math.min(100, LRS * 0.7 + liquidityScore * 0.3);
  }
  LRS = Math.min(100, LRS);

  // 4️⃣ DEV (Developer Activity)
  const dd = coinData.developer_data || {};
  const commits = logNormalize(dd.commit_count_4_weeks || 0, 1, 5000);
  const contributors = logNormalize(dd.contributors || 0, 1, 1000);
  const forks = logNormalize(dd.forks || 0, 1, 20000);
  const stars = logNormalize(dd.stars || 0, 1, 100000);
  const totalIssues = dd.total_issues || 0;
  const closedIssues = dd.closed_issues || 0;
  const issueCloseRate = totalIssues > 0 ? ratioNormalize(closedIssues / totalIssues, 0, 1) : 0.5;

  let DEV = commits * 0.25 + contributors * 0.25 + forks * 0.15 + stars * 0.15 + issueCloseRate * 0.2;
  if (githubData) DEV += githubData.githubScore * 0.2;
  DEV = Math.min(100, DEV);

  // 5️⃣ CS_quarterly (Community Score)
  const baseScore = coinData.community_score || 0;
  const cd = coinData.community_data || {};
  let CS_quarterly = ratioNormalize(baseScore, 0, 100);
  let socialBonus = 0;
  socialBonus += logNormalize(cd.twitter_followers || 0, 1, 5_000_000) * 0.08;
  socialBonus += logNormalize(cd.reddit_subscribers || 0, 1, 1_000_000) * 0.04;
  socialBonus += logNormalize(cd.telegram_channel_user_count || 0, 1, 500_000) * 0.03;
  if (lunarcrushData) socialBonus += lunarcrushData.lunarScore * 0.2;
  CS_quarterly = Math.min(100, CS_quarterly + socialBonus);

  // ----------------- Final CQS -----------------
  const CQS = 0.15 * FLF + 0.2 * TKS + 0.2 * LRS + 0.2 * DEV + 0.25 * CS_quarterly;

  let quality = "Low Quality";
  if (CQS >= 70) quality = "High Quality";
  else if (CQS >= 50) quality = "Medium Quality";

  return {
    CQS: Number(CQS.toFixed(2)),
    breakdown: {
      FLF: Number(FLF.toFixed(2)),
      TKS: Number(TKS.toFixed(2)),
      LRS: Number(LRS.toFixed(2)),
      DEV: Number(DEV.toFixed(2)),
      CS_quarterly: Number(CS_quarterly.toFixed(2)),
    },
    quality,
    investable: CQS >= 50
  };
};
