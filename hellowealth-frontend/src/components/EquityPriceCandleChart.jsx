import { Chart } from 'react-google-charts'
import LoadingSpinner from '../components/LoadingSpinner'
import { PRICE_CANDLESTICK_OPT } from '../services/constants'
import { isNullOrEmpty } from '../services/helper'

export const EquityPriceCandleChart = ({ priceHistory, isLoading }) => {
  return isLoading ? (
    <LoadingSpinner isShow={isLoading} />
  ) : !isNullOrEmpty(priceHistory) ? (
    <Chart
      width='100%'
      height={350}
      chartType='CandlestickChart'
      loader={<div>Loading...</div>}
      data={priceHistory}
      options={PRICE_CANDLESTICK_OPT}
      rootProps={{ 'data-testid': '1' }}
    />
  ) : (
    <p>Getting chart dataset...</p>
  )
}

EquityPriceCandleChart.defaultProps = {
  priceHistory: null,
  isLoading: false,
}

export default EquityPriceCandleChart
