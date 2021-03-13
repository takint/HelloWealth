import {chartDisplayText} from '../styles/global.styles'

export const PRICE_CANDLESTICK_OPT = {
  legend: 'none',
  bar: { groupWidth: '100%' }, // Remove space between bars.
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: '#b91c1c' }, // red
    risingColor: { strokeWidth: 0, fill: '#538135' }, // green
  },
  title: 'Price performance',
  titleTextStyle: {
    ...chartDisplayText,
    bold: true,
  },
  tooltip: {
    textStyle: { ...chartDisplayText, fontName: 'Belleza', bold: true },
  },
  vAxis: {
    title: 'Prices range (in USD)',
    titleTextStyle: {
      ...chartDisplayText,
      italic: false,
    },
  },
  hAxis: {
    format: 'currency',
    title: 'Stock price since last 6 months',
    direction: -1,
    titleTextStyle: {
      ...chartDisplayText,
    },
  },
}

export const watchlist = [
  {
    symbol: 'TSLA',
    minPrice: 200,
    buyPrice: 200,
    todayPrice: 201,
    changedPercent: 1.1,
    highPrice: 230,
    lowPrice: 200,
    openPrice: 202,
    changedPercentOpen: 0.4,
    closePrice: 205,
    changedPercentClose: 0.2,
    weeklyPrices: [
      ['W1', 205.2],
      ['W2', 205.6],
      ['W3', 207.2],
      ['W4', 205],
      ['W4', 204],
      ['W4', 206],
    ],
  },
  {
    symbol: 'MSFT',
    minPrice: 200,
    buyPrice: 200,
    todayPrice: 201,
    changedPercent: 1.1,
    highPrice: 230,
    lowPrice: 200,
    openPrice: 202,
    changedPercentOpen: 0.4,
    closePrice: 205,
    changedPercentClose: 0.2,
    weeklyPrices: [
      ['W1', 205.2],
      ['W2', 205.6],
      ['W3', 207.2],
      ['W4', 205],
      ['W4', 204],
      ['W4', 206],
    ],
  },
]

export const assetList = [
  {
    symbol: 'TSLA',
    minPrice: 200,
    buyPrice: 200,
    todayPrice: 201,
    changedPercent: 1.1,
    highPrice: 230,
    lowPrice: 200,
    openPrice: 202,
    changedPercentOpen: 0.4,
    closePrice: 205,
    changedPercentClose: 0.2,
    weeklyPrices: [
      ['W1', 205.2],
      ['W2', 205.6],
      ['W3', 207.2],
      ['W4', 205],
      ['W4', 204],
      ['W4', 206],
    ],
  },
  {
    symbol: 'MSFT',
    minPrice: 100,
    buyPrice: 200,
    todayPrice: 201,
    changedPercent: 1.1,
    highPrice: 230,
    lowPrice: 200,
    openPrice: 202,
    changedPercentOpen: 0.4,
    closePrice: 205,
    changedPercentClose: 0.2,
    weeklyPrices: [
      ['W1', 5.2],
      ['W2', 5.6],
      ['W3', 7.2],
      ['W4', 5],
      ['W4', 4],
      ['W4', 6],
    ],
  },
]

export const transactionList = [
  {
    id: 1,
    transDate: '2021/03/12 12:00',
    transContent: 'Claim Virtual Cash',
    transType: 'plus',
    amount: 6006,
    balance: 6006,
  },
  {
    id: 2,
    transDate: '2021/03/12 12:00',
    transContent: 'Buy 10 shares MSFT',
    transType: 'sub',
    amount: 2500,
    balance: 6006,
  },
  {
    id: 3,
    transDate: '2021/03/12 12:00',
    transContent: 'Buy 10 shares TSLA',
    transType: 'sub',
    amount: 6006,
    balance: 6006,
  },
  {
    id: 4,
    transDate: '2021/03/12 12:00',
    transContent: 'Sold 10 shares TSLA',
    transType: 'plus',
    amount: 6006,
    balance: 6006,
  },
]
