import { appendFileSync } from "fs";
import { stringify } from "csv-stringify";
import { createGetPoolsQueryStock, createPoolDataQueryStock, fetchData } from "./src/query.js";
import { columns, filename, graphUrl } from "./src/settings.js";

let header = false;

function serializeData(data, { protocol, chain, rewardTokens, pool, token0, token1, fees }) {
  data.forEach(element => {
    element.protocol = protocol;
    element.chain = chain;
    element.pool = pool;
    element.pair = `${token0.symbol}/${token1.symbol}`;
    element["timestamp"] = element.date;
    element["inputTokenBalances_1"] = element.reserve0;
    element["inputTokenBalances_2"] = element.reserve1;
    element["totalValueLockedUSD"] = element.reserveUSD;
    element["FIXED_LP_FEE"] = null;
    element["FIXED_PROTOCOL_FEE"] = null;
    element["FIXED_TRADING_FEE"] = null;
    element["rewardTokenSymbol"] = null;
    element["rewardTokenAddress"] = null;
  });

  return data;
}

async function fetchAllPools(url, { maxTotalValue, minTotalValue }) {
  const allPoolsQuery = createGetPoolsQueryStock({ maxTotalValue, minTotalValue })
  const { pairs } = await fetchData(url, allPoolsQuery);
  if (pairs.length >= 100) return console.error('Too many pools');

  return pairs;
}

async function fetchPoolSnapshots(url, poolData) {
  const poolSnapshotQuery = createPoolDataQueryStock(poolData)
  const data = await fetchData(url, poolSnapshotQuery);
  if (!data) return;
  return data?.pairDayDatas;
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

  return;

  for await (const pool of allPools) {
    const snapshots = await fetchPoolSnapshots(url, { days, pool: pool.id, timestamp })
    if (!snapshots) continue;
    console.log('liquidity snapshots length ', snapshots.length);
    writeCSV(snapshots, {
      protocol,
      chain,
      rewardTokens: null,
      pool: pool.id,
      token0: pool.token0,
      token1: pool.token1,
      fees: null,
    });
  }
}

main(graphUrl.pancakeswap, {
  maxTotalValue: Number.MAX_SAFE_INTEGER, // Number.MAX_SAFE_INTEGER
  minTotalValue: 500000,
  protocol: 'uniswap-v2',
  chain: 'mainnet',
  timestamp: 1640995100, // 1-jan
  days: 365,
});

