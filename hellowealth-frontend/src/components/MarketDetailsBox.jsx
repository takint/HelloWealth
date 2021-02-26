import { isNullOrEmpty } from '../services/helper'
import { InfoBox } from '../styles/global.styles'
import EquityDetailsRow from './EquityDetailsRow'

export const MarketDetailsBox = ({ summaryDetail }) => {
  return !isNullOrEmpty(summaryDetail) ? (
    <InfoBox className='flex flex-col flex-wrap lg:flex-row'>
      <EquityDetailsRow label='Asked price' value={summaryDetail.ask.raw} />
      <EquityDetailsRow label='Price' value={summaryDetail.bid.raw} />
      <EquityDetailsRow
        label='Avg. Volume'
        value={summaryDetail.averageVolume.raw}
        format='decimal'
      />
      <EquityDetailsRow
        label='Volume'
        format='decimal'
        value={summaryDetail.volume.raw}
      />
      <EquityDetailsRow
        label='P/E ratio'
        format='decimal'
        value={summaryDetail.trailingPE.raw}
      />
      <EquityDetailsRow
        label='Beta'
        value={summaryDetail.beta.raw}
        format='decimal'
      />
      <EquityDetailsRow
        label="Today's High"
        color='text-green font-bold'
        value={summaryDetail.dayHigh.raw}
      />
      <EquityDetailsRow
        label="Today's Low"
        color='text-red font-bold'
        value={summaryDetail.dayLow.raw}
      />

      <EquityDetailsRow
        label="52-weeks's High"
        color='text-green font-bold'
        value={summaryDetail.fiftyTwoWeekHigh.raw}
      />
      <EquityDetailsRow
        label="52-weeks's Low"
        color='text-red font-bold'
        value={summaryDetail.fiftyTwoWeekLow.raw}
      />

      <EquityDetailsRow
        label='Yesterday close at'
        value={summaryDetail.previousClose.raw}
      />
      <EquityDetailsRow
        label='Avg. 200-days'
        value={summaryDetail.twoHundredDayAverage.raw}
      />

      <EquityDetailsRow
        label='Market Cap'
        value={summaryDetail.marketCap.raw}
        shortFormat={summaryDetail.marketCap.fmt}
      />
    </InfoBox>
  ) : (
    <InfoBox>Getting data...</InfoBox>
  )
}

MarketDetailsBox.defaultProps = {
  summaryDetail: null,
}

export default MarketDetailsBox
