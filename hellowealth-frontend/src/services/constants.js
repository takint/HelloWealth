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
