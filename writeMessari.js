import { appendFileSync } from "fs";
import { stringify } from "csv-stringify";
import { createGetPoolsQueryMessari, createPoolDataQueryMessari, fetchData } from "./src/query.js";
import { columns, filename, graphUrl } from "./src/settings.js";

let header = false;

function serializeData(data, { protocol, chain, rewardTokens, pool, pair, fees }) {
  data.forEach(element => {
    element.protocol = protocol;
    element.chain = chain;
    element.pool = pool;
    element.pair = pair;
    element["dailyVolumeByTokenUSD_1"] = element.dailyVolumeByTokenUSD[0];
    element["dailyVolumeByTokenUSD_2"] = element.dailyVolumeByTokenUSD[1];
    element["inputTokenBalances_1"] = element.inputTokenBalances[0];
    element["inputTokenBalances_2"] = element.inputTokenBalances[1];
    element["FIXED_LP_FEE"] = fees[0]?.feePercentage ?? null;
    element["FIXED_PROTOCOL_FEE"] = fees[1]?.feePercentage ?? null;
    element["FIXED_TRADING_FEE"] = fees[2]?.feePercentage ?? null;
    element["rewardTokenSymbol"] = rewardTokens.length > 0 ? rewardTokens[0].token?.symbol : null;
    element["rewardTokenAddress"] = rewardTokens.length > 0 ? rewardTokens[0].token?.id : null;
  });

  return data;
}

async function fetchAllPools(url, { maxTotalValue, minTotalValue }) {
  const allPoolsQuery = createGetPoolsQueryMessari({ maxTotalValue, minTotalValue })
  const { liquidityPools } = await fetchData(url, allPoolsQuery);
  if (liquidityPools.length >= 100) return console.error('Too many pools');

  return liquidityPools;
}

async function fetchPoolSnapshots(url, poolData) {
  const poolSnapshotQuery = createPoolDataQueryMessari(poolData)
  const { liquidityPoolDailySnapshots } = await fetchData(url, poolSnapshotQuery);

  return liquidityPoolDailySnapshots;
}

function writeCSV(snapshots, poolData) {
  const serialized = serializeData(snapshots, poolData);

  stringify(serialized, {
    header: header,
    columns: columns
  }, function (err, output) {
    if (err) return console.error(err);
    appendFileSync(filename, output);
  });

  header = false;
}

async function main(url, { maxTotalValue, minTotalValue, protocol, chain, timestamp, days }) {
  const allPools = await fetchAllPools(url, { maxTotalValue, minTotalValue });
  console.log('Total liquidity pools: ', allPools.length);

  for await (const pool of allPools) {
    const snapshots = await fetchPoolSnapshots(url, { days, pool: pool.id, timestamp })
    console.log('liquidity snapshots length ', snapshots.length);
    writeCSV(snapshots, {
      protocol,
      chain,
      rewardTokens: pool.rewardTokens,
      pool: pool.id,
      pair: pool.symbol,
      fees: pool.fees,
    });
  }
}

main(graphUrl.sushiswapEther, {
  maxTotalValue: Number.MAX_VALUE,
  minTotalValue: 400000,
  protocol: 'sushiswap',
  chain: 'mainnet',
  timestamp: 1640995200, // 1-jan
  days: 365,
});

