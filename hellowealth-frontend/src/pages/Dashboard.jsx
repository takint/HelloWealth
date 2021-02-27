import { useState } from 'react'
import { Chart } from 'react-google-charts'
import LoadingSpinner from '../components/LoadingSpinner'
import MarketDetailsBox from '../components/MarketDetailsBox'
import EquityPriceCandleChart from '../components/EquityPriceCandleChart'
import DashboardNavBar from '../components/DashboardNavBar'
import {
  InfoTitle,
  InfoBox,
  Spacer,
  WatchListButton,
} from '../styles/global.styles'
import { getEquitySummary, getEquityPriceHistory } from '../services/api'
import { isNullOrEmpty, buildEquityPriceDataframe } from '../services/helper'

export const DashboardPage = ({ equity }) => {
  const [loading, setLoading] = useState(false)
  const [equityDetails, setEquityDetails] = useState(null)

  const onSearchHeaderChange = async (selectedEquity) => {
    if (!isNullOrEmpty(selectedEquity)) {
      setLoading(true)
      const requestParam = {
        region: 'US',
        symbol: selectedEquity.value,
      }
      const historyDf = [
        [
          'Day',
          'Min. Price',
          'Open Price',
          'Close Price',
          'High Price',
          { type: 'string', role: 'tooltip' },
        ],
      ]
      const openPriceList = [['Market price', 'Close']]

      const [summaryResp, historyResp] = await Promise.all([
        getEquitySummary(requestParam),
        getEquityPriceHistory(requestParam),
      ])

      if (!summaryResp.error && summaryResp.ok) {
        if (!historyResp.error && historyResp.ok) {
          const priceDf = buildEquityPriceDataframe(historyResp.prices)
          priceDf.forEach((row) => {
            historyDf.push(row)
            openPriceList.push([row[1], row[2]])
          })
        }

        setEquityDetails({
          symbol: selectedEquity.data.symbol,
          longname: selectedEquity.data.longname,
          price: summaryResp.price,
          summaryDetail: summaryResp.summaryDetail,
          summaryProfile: summaryResp.summaryProfile,
          priceHistory: historyDf,
          priceTrend: openPriceList,
        })
      }

      console.log(equityDetails)
      setLoading(false)
    }
  }

  return (
    <div className='w-full'>
      <DashboardNavBar onSearchInputChange={onSearchHeaderChange} />
      <div className='w-full p-6'>
        <InfoTitle>
          NASDAQ market will be opened at{' '}
          <span className='text-green'>09:30 AM</span> and closed at{' '}
          <span className='text-red'>04:30 PM</span> Estern time on weekdays
        </InfoTitle>
        {loading ? (
          <LoadingSpinner isShow={loading} />
        ) : !isNullOrEmpty(equityDetails) ? (
          <>
            <div className='flex flex-col justify-between items-center lg:flex-row'>
              <h2>
                <span className='px-1 text-lg'>{equityDetails.symbol}</span>
                <strong className='border-l-2 px-1 border-blue text-lg'>
                  {equityDetails.longname}
                </strong>
              </h2>
              <WatchListButton type='button'>Add to watch list</WatchListButton>
            </div>
            <div className='flex flex-col'>
              {/* === Stock Performance === */}
              <InfoTitle>Performance</InfoTitle>
              <InfoBox>
                <EquityPriceCandleChart
                  isLoading={loading}
                  priceHistory={equityDetails.priceHistory}
                />
              </InfoBox>

              {/* === Market details === */}
              <InfoTitle>Market Details</InfoTitle>
              <MarketDetailsBox summaryDetail={equityDetails.summaryDetail} />

              {/* === About company === */}
              <InfoTitle>
                About {equityDetails && equityDetails.longname}
              </InfoTitle>
              <InfoBox>
                {!isNullOrEmpty(equityDetails) &&
                !isNullOrEmpty(equityDetails.summaryProfile) ? (
                  <p>{equityDetails.summaryProfile.longBusinessSummary}</p>
                ) : (
                  <p>Getting information...</p>
                )}
              </InfoBox>

              {/* === Prediction trend === */}
              <InfoTitle>Prediction trend</InfoTitle>
              <InfoBox>
                {!isNullOrEmpty(equityDetails.priceTrend) && (
                  <Chart
                    width='100%'
                    height={350}
                    chartType='ScatterChart'
                    loader={<LoadingSpinner isShow />}
                    data={equityDetails.priceTrend}
                    options={{
                      backgroundColor: '#000',
                      colors: ['cyan'],
                      trendlines: {
                        0: {
                          type: 'polynomial',
                          degree: 3,
                          color: 'cyan',
                          visibleInLegend: true,
                          labelInLegend: 'Trend',
                        },
                      },
                    }}
                    rootProps={{ 'data-testid': '2' }}
                  />
                )}
              </InfoBox>
            </div>
          </>
        ) : (
          <InfoTitle>Select an equity</InfoTitle>
        )}
      </div>
      <Spacer height='3rem' />
    </div>
  )
}

DashboardPage.defaultProps = {
  equity: null,
}

export default DashboardPage
