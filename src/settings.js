const messariUrl = 'https://api.thegraph.com/subgraphs/name/messari/'

export const graphUrl = {
  sushiswapEther: messariUrl + 'sushiswap-ethereum',
  sushiswapArbitrum: messariUrl + 'sushiswap-arbitrum',
  sushiswapPolygon: messariUrl + 'sushiswap-polygon',
  velodromeOptimism: messariUrl + 'velodrome-optimism',
  uniswapv2Ether: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  pancakeswap: 'https://data-platform.nodereal.io/graph/v1/6c77425ac68d44519968b6471c51f42c/projects/pancakeswap',
  aaveV2Ether: messariUrl + 'aave-v2-ethereum',
  aaveV2Avalanche: messariUrl + 'aave-v2-avalanche',
  aaveV3Arbitrum: messariUrl + 'aave-v3-arbitrum',
  aaveV3Polygon: messariUrl + 'aave-v3-polygon',
  aaveV3Optimism: messariUrl + 'aave-v3-optimism',
  compoundV2Ether: messariUrl + 'compound-v2-ethereum',
  compoundV3Ether: messariUrl + 'compound-v3-ethereum',
  yearnV2Ether: messariUrl + 'yearn-v2-ethereum',
  yearnV2Arbitrum: messariUrl + 'yearn-v2-arbitrum',
  beefyArbitrum: messariUrl + 'beefy-finance-arbitrum'
}

export const filename = "./dexPoolData.csv";
export const filenameLending = "./lendingPoolData.csv";

export const columns = [
  "protocol",
  "chain",
  "pool",
  "pair",
  "id",
  "timestamp",
  "blockNumber",
  "totalValueLockedUSD", // uni
  "dailyTotalRevenueUSD",
  "dailySupplySideRevenueUSD",
  "dailyProtocolSideRevenueUSD",
  "dailyVolumeUSD", // uni
  "dailyVolumeByTokenUSD_1",
  "dailyVolumeByTokenUSD_2",
  "inputTokenBalances_1", // uni
  "inputTokenBalances_2", // uni
  "outputTokenSupply",
  "FIXED_LP_FEE",
  "FIXED_PROTOCOL_FEE",
  "FIXED_TRADING_FEE",
  "rewardTokenSymbol",
  "rewardTokenAddress",
  "stakedOutputTokenAmount",
];

export const columnsLending = [
  "protocol",
  "chain",
  "market",
  "name",
  "inputToken",
  "timestamp",
  "blockNumber",
  "totalValueLockedUSD",
  "dailySupplySideRevenueUSD",
  "dailyProtocolSideRevenueUSD",
  "dailyTotalRevenueUSD",
  "dailySupplySideRevenueUSD",
  "dailyBorrowUSD",
  "exchangeRate",
  "rewardToken_1",
  "rewardToken_2",
  "rewardTokenEmissionsUSD_1",
  "rewardTokenEmissionsUSD_2",
];
