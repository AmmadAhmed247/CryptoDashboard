import axios from "axios";


// Logarithmic normalization for large values (wider max for real-world coins)


// CQS.controller.js
export const calculateCQSValue = (coinData) => {
  // ----------------- Helper Functions -----------------
  const logNormalize = (value, min = 1, max = 1e12) => {
    if (!value || value <= min) return 0;
    if (value >= max) return 100;
    return ((Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))) * 100;
  };

  const ratioNormalize = (value, min = 0, max = 1) => {
    if (!value || value <= min) return 0;
    if (value >= max) return 100;
    return ((value - min) / (max - min)) * 100;
  };

  // ----------------- 1️⃣ FLF (Coin Age) -----------------
  let FLF = 0;
  if (coinData.genesis_date) {
    const ageYears = (Date.now() - new Date(coinData.genesis_date).getTime()) / (1000 * 60 * 60 * 24 * 365);
    // Older coins score higher: max 20 years = 100 points
    FLF = Math.min(100, (ageYears / 20) * 100);
  }

  // ----------------- 2️⃣ TKS (Supply Ratio) -----------------
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

  // ----------------- 3️⃣ LRS (Listings & Liquidity) -----------------
  const tickers = coinData.tickers || [];
  let LRS = logNormalize(tickers.length, 1, 1000);
  const topExchanges = ["binance", "coinbase", "kraken", "okx", "bybit"];
  const topExchangeCount = tickers.filter((t) =>
    topExchanges.includes(t.market?.identifier?.toLowerCase())
  ).length;
  LRS += Math.min(10, topExchangeCount * 2);
  LRS = Math.min(100, LRS);

  // ----------------- 4️⃣ DEV (Developer Activity) -----------------
  const dd = coinData.developer_data || {};
  const commits = logNormalize(dd.commit_count_4_weeks || 0, 1, 5000);
  const contributors = logNormalize(dd.contributors || 0, 1, 1000);
  const forks = logNormalize(dd.forks || 0, 1, 20000);
  const stars = logNormalize(dd.stars || 0, 1, 100000);
  const totalIssues = dd.total_issues || 0;
  const closedIssues = dd.closed_issues || 0;
  const issueCloseRate = totalIssues > 0 ? ratioNormalize(closedIssues / totalIssues, 0, 1) : 0.5;
  let DEV = commits * 0.25 + contributors * 0.25 + forks * 0.15 + stars * 0.15 + issueCloseRate * 0.2;
  DEV = Math.min(100, DEV);

  // ----------------- 5️⃣ CS_quarterly (Community Score) -----------------
  const cd = coinData.community_data || {};
  let CS_quarterly = ratioNormalize(coinData.community_score || 0, 0, 100);
  let socialBonus = 0;
  socialBonus += logNormalize(cd.twitter_followers || 0, 1, 5_000_000) * 0.08;
  socialBonus += logNormalize(cd.reddit_subscribers || 0, 1, 1_000_000) * 0.04;
  socialBonus += logNormalize(cd.telegram_channel_user_count || 0, 1, 500_000) * 0.03;
  CS_quarterly = Math.min(100, CS_quarterly + socialBonus);

  // ----------------- Final CQS -----------------
  const CQS = 0.15 * FLF + 0.20 * TKS + 0.20 * LRS + 0.20 * DEV + 0.25 * CS_quarterly;

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








const logNormalize = (value, min = 1, max = 1000000) => {
  if (!value || value <= min) return 0;
  if (value >= max) return 100;
  return ((Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))) * 100;
};

// Ratio normalization
const ratioNormalize = (value, min = 0, max = 1) => {
  if (!value || value <= min) return 0;
  if (value >= max) return 100;
  return ((value - min) / (max - min)) * 100;
};

// ----------------- CQS Calculation -----------------
export const calculateCQS = async (req, res) => {
  try {
    const { coin } = req.body;
    if (!coin) return res.status(400).json({ message: "Coin name or ID is required" });

    // ----------------- Fetch CoinGecko -----------------
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`, { timeout: 10000 });
    const coinSymbol = data.symbol?.toUpperCase();

    // ----------------- Parallel API calls -----------------
    const githubPromise = (async () => {
      try {
        const repos = data.links?.repos_url?.github || [];
        if (!repos.length) return { githubScore: 0, githubDebug: {} };
        const repoPath = repos[0].replace("https://github.com/", "");
        const gh = await axios.get(`https://api.github.com/repos/${repoPath}`);
        const githubScore =
          logNormalize(gh.data.stargazers_count, 1, 100000) * 0.5 +
          logNormalize(gh.data.forks_count, 1, 20000) * 0.3 +
          logNormalize(gh.data.open_issues_count, 1, 10000) * 0.2;
        return {
          githubScore,
          githubDebug: {
            stars: gh.data.stargazers_count,
            forks: gh.data.forks_count,
            watchers: gh.data.watchers_count,
            openIssues: gh.data.open_issues_count,
          },
        };
      } catch (e) {
        return { githubScore: 0, githubDebug: { error: e.message } };
      }
    })();

    const lunarPromise = (async () => {
      try {
        const lc = await axios.get(
          `https://lunarcrush.com/api3/coins?symbol=${coinSymbol}&data=market&key=${process.env.LUNARCRUSH_KEY}`
        );
        const lcData = lc.data?.data?.[0];
        if (!lcData) return { lunarScore: 0, lunarDebug: {} };
        const lunarScore =
          logNormalize(lcData.galaxy_score, 1, 100) * 0.5 +
          logNormalize(lcData.social_score, 1, 1000000) * 0.5;
        return {
          lunarScore,
          lunarDebug: {
            galaxyScore: lcData.galaxy_score,
            altRank: lcData.alt_rank,
            socialScore: lcData.social_score,
          },
        };
      } catch (e) {
        return { lunarScore: 0, lunarDebug: { error: e.message } };
      }
    })();

    const liquidityPromise = (async () => {
      try {
        const cc = await axios.get(
          `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinSymbol}&tsyms=USD&api_key=${process.env.CC_KEY}`
        );
        const raw = cc.data?.RAW?.[coinSymbol]?.USD;
        if (!raw) return { liquidityScore: 0, liquidityDebug: {} };
        const liquidityScore =
          logNormalize(raw.VOLUME24HOUR, 1, 1e9) * 0.5 +
          logNormalize(raw.MKTCAP, 1, 1e10) * 0.5;
        return {
          liquidityScore,
          liquidityDebug: {
            volume24h: raw.VOLUME24HOUR,
            marketCap: raw.MKTCAP,
          },
        };
      } catch (e) {
        return { liquidityScore: 0, liquidityDebug: { error: e.message } };
      }
    })();

    const [{ githubScore, githubDebug }, { lunarScore, lunarDebug }, { liquidityScore, liquidityDebug }] =
      await Promise.all([githubPromise, lunarPromise, liquidityPromise]);

    // ----------------- Feature Calculations -----------------

    // 1. FLF (Coin Age) - older coins score higher
    let FLF = 0;
    let debugFLF = 0;
    if (data.genesis_date) {
      const ageYears = (Date.now() - new Date(data.genesis_date).getTime()) / (1000 * 60 * 60 * 24 * 365);
      debugFLF = ageYears;
      FLF = Math.min(100, Math.max(0, (ageYears / 20) * 100)); // 20 years = 100 points
    }

    // 2. TKS (Supply Ratios)
    const circ = data.market_data?.circulating_supply || 0;
    const total = data.market_data?.total_supply || 1;
    const max = data.market_data?.max_supply || null;
    let TKS = 0;
    let debugTKS = { circ, total, max, circToTotal: circ / total, circToMax: max ? circ / max : null };
    if (max && max > 0) {
      TKS = ratioNormalize(circ / max, 0, 1) * 0.6 + ratioNormalize(circ / total, 0, 1) * 0.4;
    } else {
      TKS = ratioNormalize(circ / total, 0, 1);
    }

    // 3. LRS (Listings & Liquidity)
    const tickers = data.tickers || [];
    let LRS = logNormalize(tickers.length, 1, 1000);
    const topExchanges = ["binance", "coinbase", "kraken", "okx", "bybit"];
    const topExchangeCount = tickers.filter((t) =>
      topExchanges.includes(t.market?.identifier?.toLowerCase())
    ).length;
    LRS += Math.min(10, topExchangeCount * 2);
    LRS = Math.min(100, LRS);
    LRS = Math.min(100, LRS * 0.7 + liquidityScore * 0.3);

    // 4. DEV (Developer Activity)
    const dd = data.developer_data || {};
    let DEV = 0;
    let debugDEV = {
      commits: dd.commit_count_4_weeks || 0,
      contributors: dd.contributors || 0,
      forks: dd.forks || 0,
      stars: dd.stars || 0,
      totalIssues: dd.total_issues || 0,
      closedIssues: dd.closed_issues || 0,
    };
    const commits = logNormalize(dd.commit_count_4_weeks || 0, 1, 5000);
    const contributors = logNormalize(dd.contributors || 0, 1, 1000);
    const forks = logNormalize(dd.forks || 0, 1, 20000);
    const stars = logNormalize(dd.stars || 0, 1, 100000);
    const totalIssues = dd.total_issues || 0;
    const closedIssues = dd.closed_issues || 0;
    const issueCloseRate = totalIssues > 0 ? ratioNormalize(closedIssues / totalIssues, 0, 1) : 0.5;
    DEV = commits * 0.25 + contributors * 0.25 + forks * 0.15 + stars * 0.15 + issueCloseRate * 0.2 + githubScore * 0.2;
    DEV = Math.min(100, DEV);

    // 5. CS_quarterly (Community Score)
    const baseScore = data.community_score || 0;
    let CS_quarterly = ratioNormalize(baseScore, 0, 100);
    const cd = data.community_data || {};
    let debugCS = {
      baseScore,
      twitter: cd.twitter_followers || 0,
      reddit: cd.reddit_subscribers || 0,
      telegram: cd.telegram_channel_user_count || 0,
    };
    let socialBonus = 0;
    socialBonus += logNormalize(cd.twitter_followers || 0, 1, 5000000) * 0.08; // realistic max
    socialBonus += logNormalize(cd.reddit_subscribers || 0, 1, 1000000) * 0.04;
    socialBonus += logNormalize(cd.telegram_channel_user_count || 0, 1, 500000) * 0.03;
    socialBonus += lunarScore * 0.2;
    CS_quarterly = Math.min(100, CS_quarterly + socialBonus);

    // ----------------- Final CQS -----------------
    const CQS = 0.15 * FLF + 0.2 * TKS + 0.2 * LRS + 0.2 * DEV + 0.25 * CS_quarterly;

    let quality = "Low Quality";
    if (CQS >= 70) quality = "High Quality";
    else if (CQS >= 50) quality = "Medium Quality";

    // ----------------- Return Result -----------------
    res.json({
      coin: data.id,
      name: data.name || coin,
      symbol: coinSymbol || coin.toUpperCase(),
      totalScore: Number(CQS.toFixed(2)),
      breakdown: {
        FLF: Number(FLF.toFixed(2)),
        TKS: Number(TKS.toFixed(2)),
        LRS: Number(LRS.toFixed(2)),
        DEV: Number(DEV.toFixed(2)),
        CS_quarterly: Number(CS_quarterly.toFixed(2)),
      },
      quality,
      investable: CQS >= 50,
      debug: {
        coinAge: data.genesis_date
          ? `${((Date.now() - new Date(data.genesis_date).getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)} years`
          : "unknown",
        listingsCount: tickers.length,
        hasDevData: !!dd,
        communityScore: baseScore,
        debugFLF,
        debugTKS,
        debugLRS: tickers.length,
        debugDEV,
        debugCS,
        githubDebug,
        lunarDebug,
        liquidityDebug,
        rawValues: {
          FLF_raw: debugFLF,
          TKS_raw: debugTKS,
          LRS_raw: tickers.length,
          DEV_raw: debugDEV,
          CS_quarterly_raw: debugCS,
        },
        normalized: { FLF, TKS, LRS, DEV, CS_quarterly },
      },
    });
  } catch (error) {
    console.error("Error calculating CQS:", error.message);
    res.status(500).json({ message: "Failed to calculate CQS", error: error.message });
  }
};

