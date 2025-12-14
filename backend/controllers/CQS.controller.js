import axios from "axios";
import { calculateCQSValue } from "../services/cqsCalculator.js"

const logNormalize = (value, min, max) => {
  if (!value || value <= 0) return 0;
  return Math.min(1, Math.max(0, Math.log10(value / min) / Math.log10(max / min)));
};
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
        return { githubScore, githubDebug: gh.data };
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
        return { lunarScore, lunarDebug: lcData };
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
        return { liquidityScore, liquidityDebug: raw };
      } catch (e) {
        return { liquidityScore: 0, liquidityDebug: { error: e.message } };
      }
    })();

    const [{ githubScore, githubDebug }, { lunarScore, lunarDebug }, { liquidityScore, liquidityDebug }] =
      await Promise.all([githubPromise, lunarPromise, liquidityPromise]);

    // ----------------- Calculate CQS -----------------
    const cqsResult = calculateCQSValue(data, { lunarScore }, { githubScore }, { ...liquidityDebug });

    res.json({
      coin: data.id,
      name: data.name || coin,
      symbol: coinSymbol || coin.toUpperCase(),
      ...cqsResult,
      debug: { githubDebug, lunarDebug, liquidityDebug }
    });
  } catch (error) {
    console.error("Error calculating CQS:", error.message);
    res.status(500).json({ message: "Failed to calculate CQS", error: error.message });
  }
};
