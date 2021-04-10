import { isNullOrEmpty, getRawOrDefault } from '../services/helper'
import { InfoBox } from '../styles/global.styles'
import EquityDetailsRow from './EquityDetailsRow'

export const MarketDetailsBox = ({ summaryDetail }) => {
  return !isNullOrEmpty(summaryDetail) ? (
    <InfoBox className='flex flex-col flex-wrap lg:flex-row'>
      <EquityDetailsRow
        id='askPrice'
        toolTips='Would be seen as high price a buyer will pay.'
        label='Asked price'
        value={getRawOrDefault(summaryDetail.ask)}
      />
      <EquityDetailsRow
        id='price'
        toolTips='Refers to the lowest price a seller accepts.'
        label='Price'
        value={getRawOrDefault(summaryDetail.bid)}
      />
      <EquityDetailsRow
        label='Avg. Volume'
        id='avgVolume'
        toolTips='Total volume for specified period divided by the number of bars in the periods.'
        value={getRawOrDefault(summaryDetail.averageVolume)}
        format='decimal'
      />
      <EquityDetailsRow
        label='Volume'
        id='volume'
        toolTips='Volume for specified period.'
        format='decimal'
        value={getRawOrDefault(summaryDetail.volume)}
      />
      <EquityDetailsRow
        label='P/E ratio'
        id='peRatio'
        toolTips='This means the earning of the company in each stock.'
        format='decimal'
        value={getRawOrDefault(summaryDetail.trailingPE)}
      />
      <EquityDetailsRow
        label='Beta'
        id='beta'
        toolTips='The volatile of stocks price compare to overall market.'
        value={getRawOrDefault(summaryDetail.beta)}
        format='decimal'
      />
      <EquityDetailsRow
        label="Today's High"
        color='text-green font-bold'
        value={getRawOrDefault(summaryDetail.dayHigh)}
      />
      <EquityDetailsRow
        label="Today's Low"
        color='text-red font-bold'
        value={getRawOrDefault(summaryDetail.dayLow)}
      />

      <EquityDetailsRow
        label="52-weeks's High"
        color='text-green font-bold'
        value={getRawOrDefault(summaryDetail.fiftyTwoWeekHigh)}
      />
      <EquityDetailsRow
        label="52-weeks's Low"
        color='text-red font-bold'
        value={getRawOrDefault(summaryDetail.fiftyTwoWeekLow)}
      />

      <EquityDetailsRow
        label='Yesterday close at'
        value={getRawOrDefault(summaryDetail.previousClose)}
      />
      <EquityDetailsRow
        label='Avg. 200-days'
        value={getRawOrDefault(summaryDetail.twoHundredDayAverage)}
      />

      <EquityDetailsRow
        label='Market Cap'
        id='marketCap'
        toolTips='This refer to volume of company share and how much the company worth.'
        value={getRawOrDefault(summaryDetail.marketCap)}
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
