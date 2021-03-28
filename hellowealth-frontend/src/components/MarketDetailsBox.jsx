import { isNullOrEmpty } from '../services/helper'
import { InfoBox } from '../styles/global.styles'
import EquityDetailsRow from './EquityDetailsRow'

export const MarketDetailsBox = ({ summaryDetail }) => {
  return !isNullOrEmpty(summaryDetail) ? (
    <InfoBox className='flex flex-col flex-wrap lg:flex-row'>
      <EquityDetailsRow
        id='askPrice'
        toolTips='Would be seen as high price a buyer will pay.'
        label='Asked price'
        value={summaryDetail.ask.raw}
      />
      <EquityDetailsRow
        id='price'
        toolTips='Refers to the lowest price a seller accepts.'
        label='Price'
        value={summaryDetail.bid.raw}
      />
      <EquityDetailsRow
        label='Avg. Volume'
        id='avgVolume'
        toolTips='Total volume for specified period divided by the number of bars in the periods.'
        value={summaryDetail.averageVolume.raw}
        format='decimal'
      />
      <EquityDetailsRow
        label='Volume'
        id='volume'
        toolTips='Volume for specified period.'
        format='decimal'
        value={summaryDetail.volume.raw}
      />
      <EquityDetailsRow
        label='P/E ratio'
        id='peRatio'
        toolTips='This means the earning of the company in each stock.'
        format='decimal'
        value={summaryDetail.trailingPE.raw}
      />
      <EquityDetailsRow
        label='Beta'
        id='beta'
        toolTips='The volatile of stocks price compare to overall market.'
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
        id='marketCap'
        toolTips='This refer to volume of company share and how much the company worth.'
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
