import axios from "axios"

const headers = {
  'content-type': 'application/json'
}

export function createPoolDataQueryMessari({ days, pool, timestamp }) {
  return {
    operationName: 'getPoolData',
    query: `
      query getPoolData {
      liquidityPoolDailySnapshots (
        first: ${days},
        where: {
          pool: "${pool}"
          timestamp_gte: ${timestamp}
        }
      ) {
        id
        timestamp
        blockNumber
        totalValueLockedUSD
        dailyTotalRevenueUSD
        dailySupplySideRevenueUSD
        dailyProtocolSideRevenueUSD
        dailyVolumeUSD
        dailyVolumeByTokenUSD
        inputTokenBalances
        outputTokenSupply
        stakedOutputTokenAmount
      }
    }`
  }
}

export function createGetPoolsQueryMessari({ maxTotalValue, minTotalValue }) {
  return {
    operationName: 'getSymbols',
    query: `
      query getSymbols {
        liquidityPools (
          where: {
            totalValueLockedUSD_lte: ${maxTotalValue},
            totalValueLockedUSD_gte: ${minTotalValue}, 
          }
        ) {
          id
          symbol
          fees { feeType, feePercentage }
          rewardTokens { token { symbol, id } }
          totalValueLockedUSD
        }
      }
    `
  }
}

export function createMarketDataQueryMessari({ days, market, timestamp }) {
  return {
    operationName: 'getMarket',
    query: `
    query getMarket {
      marketDailySnapshots (
        first: ${days},
        where: {
            market: "${market}", 
            timestamp_gte: ${timestamp}
        }
      ) {
        id
        timestamp
        blockNumber
        rates { id, rate, duration, side, type} 
        totalValueLockedUSD
        dailySupplySideRevenueUSD
        dailyProtocolSideRevenueUSD
        dailyTotalRevenueUSD
        dailyBorrowUSD
        exchangeRate
        rewardTokenEmissionsUSD
      }
    }`
  }
}


export function createVaultDataQueryMessari({ days, market, timestamp }) {
  return {
    operationName: 'getVaults',
    query: `
    query getVaults {
      vaultDailySnapshots (
        first: ${days},
        where: {
            vault: "${market}", 
            timestamp_gte: ${timestamp}
        }
      ) {
        timestamp
        blockNumber
        totalValueLockedUSD
        dailySupplySideRevenueUSD
        dailyProtocolSideRevenueUSD
        dailyTotalRevenueUSD
        pricePerShare
        rewardTokenEmissionsUSD
      }
    }`
  }
}

export function createGetMarketsQueryMessari(markets) {
  return {
    operationName: 'getMarkets',
    query: `
    query getMarkets {
      ${markets} (
        where: {
          totalValueLockedUSD_gt: 10000
         }
      ) {
        id
        name
        inputToken { symbol }
        outputToken { symbol }
        rewardTokens { token { symbol, id } }
        totalValueLockedUSD
      }
    }
    `
  }
}

export function createPoolDataQueryStock({ days, pool, timestamp }) {
  return {
    operationName: 'getPoolData',
    query: `
      query getPoolData {
        pairDayDatas (
          first: ${days}
          where: {
              pairAddress: "${pool}", 
              date_gt: ${timestamp}
          }
        ) {
          id
          date
          dailyVolumeUSD
          reserve0
          reserve1
          reserveUSD
        }
      }`
  }
}

export function createGetPoolsQueryStock({ maxTotalValue, minTotalValue }) {
  return {
    operationName: 'getSymbols',
    query: `
      query getSymbols {
        pairs(
          where: {
            reserveUSD_lte: ${maxTotalValue},
            reserveUSD_gte: ${minTotalValue},
            volumeUSD_gte: "10"
          }
          orderBy: reserveUSD
          orderDirection: desc
        ) {
          id
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
          reserveUSD
          volumeUSD
        }
      }
    `
  }
}

export async function fetchData(url, query) {
  const response = await axios.post(url, query, headers);
  if (response.data.errors) return console.log(response.data.errors[0]);

  return response.data.data;
}


