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
        label='Beta'
        value={summaryDetail.beta.raw}
        format='decimal'
      />
      <EquityDetailsRow
        label="Today's High"
        value={summaryDetail.dayHigh.raw}
      />
      <EquityDetailsRow label="Today's Low" value={summaryDetail.dayLow.raw} />
      <EquityDetailsRow
        label='Market Cap'
        value={summaryDetail.marketCap.raw}
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
