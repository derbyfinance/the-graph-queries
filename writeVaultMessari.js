import { appendFileSync } from "fs";
import { stringify } from "csv-stringify";
import { createGetMarketsQueryMessari, createMarketDataQueryMessari, createVaultDataQueryMessari, fetchData } from "./src/query.js";
import { columnsLending, filenameLending, graphUrl } from "./src/settings.js";

function serializeData(data, { protocol, name, chain, inputToken, rewardTokens, market }) {
  data.forEach(element => {
    element.protocol = protocol;
    element.chain = chain;
    element.market = market;
    element.name = name;
    element.inputToken = inputToken;
    element["exchangeRate"] = element.pricePerShare
    element["rewardToken_1"] = rewardTokens?.length > 0 ? rewardTokens[0].token?.id : null;
    element["rewardToken_2"] = rewardTokens?.length > 1 ? rewardTokens[1].token?.id : null;
    element["rewardTokenEmissionsUSD_1"] = element.rewardTokenEmissionsUSD?.length > 0 ? element.rewardTokenEmissionsUSD[0] : null;
    element["rewardTokenEmissionsUSD_2"] = element.rewardTokenEmissionsUSD?.length > 0 ? element.rewardTokenEmissionsUSD[1] : null;
  });

  return data;
}

async function fetchAllMarkets(url) {
  const allMarketsQuery = createGetMarketsQueryMessari('vaults');
  const { vaults } = await fetchData(url, allMarketsQuery);
  if (vaults.length >= 100) return console.error('Too many pools');

  return vaults;
}

async function fetchMarketSnapshots(url, poolData) {
  const vaultSnapshotQuery = createVaultDataQueryMessari(poolData)
  const { vaultDailySnapshots } = await fetchData(url, vaultSnapshotQuery);

  return vaultDailySnapshots;
}

function writeCSV(snapshots, poolData) {
  const serialized = serializeData(snapshots, poolData);

  stringify(serialized, {
    header: header,
    columns: columnsLending
  }, function (err, output) {
    if (err) return console.error(err);
    appendFileSync(filenameLending, output);
  });

  header = false;
}

async function main(url, { protocol, chain, timestamp, days }) {
  const markets = await fetchAllMarkets(url);
  console.log(markets)
  console.log('Total liquidity pools: ', markets.length);

  for await (const market of markets) {
    if (
      market.inputToken.symbol != 'USDT' &&
      market.inputToken.symbol != 'USDC' &&
      market.inputToken.symbol != 'DAI'
    ) continue;

    const snapshots = await fetchMarketSnapshots(url, { days, market: market.id, timestamp })
    console.log(snapshots)
    console.log('markets snapshots length ', snapshots.length);

    writeCSV(snapshots, {
      protocol,
      chain,
      name: market.name,
      inputToken: market.inputToken.symbol,
      rewardTokens: market.rewardTokens,
      market: market.id,
    });
  }
}

let header = false;

main(graphUrl.yearnV2Arbitrum, {
  protocol: 'yearn-v2',
  chain: 'mainnet',
  timestamp: 1640995200, // 1-jan
  days: 365,
});

