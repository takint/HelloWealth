import { useState, useContext, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import moment from 'moment'
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
import { updateUserPorfolio, getStockPrediction } from '../services/api'
import { isNullOrEmpty, getEquityInfo } from '../services/helper'
import { UserContext } from '../services/context'

const PRICE_TREND_CHART = {
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
}

export const DashboardPage = ({ equity }) => {
  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [equityDetails, setEquityDetails] = useState(null)
  const [watchlistBtn, setWatchlistBtn] = useState('Add to watch list')
  const [isSubmitWatchList, setIsSubmitWatchList] = useState(false)

  const onSearchHeaderChange = async (selectedEquity) => {
    if (!isNullOrEmpty(selectedEquity)) {
      setLoading(true)
      let equityInfo = await getEquityInfo(selectedEquity.data.symbol)

      if (equityInfo.price !== null) {
        // Currently we only run example prediction for MSFT
        if (selectedEquity.data.symbol === 'MSFT') {
          let predictRes = await getStockPrediction(userContext.token)

          if (predictRes.ok) {
            delete predictRes.ok
            delete predictRes.statusCode

            const predictPrices = [['Dates', 'Predicted Price']]

            predictRes.forEach((price) => {
              predictPrices.push([moment(price[0]).format('DD MMM'), price[1]])
            })

            equityInfo.predictPrices = predictPrices
          }
        }

        setEquityDetails(equityInfo)
      }

      setLoading(false)
    }
  }

  const watchListBtnClick = async () => {
    let nWatchList = userContext.watchedEquities

    if (userContext.watchedEquities.includes(equityDetails.symbol)) {
      nWatchList = userContext.watchedEquities.filter(
        (symbol) => symbol !== equityDetails.symbol
      )
      setWatchlistBtn('Add to watch list')
    } else {
      nWatchList.push(equityDetails.symbol)
      setWatchlistBtn('Remove from watch list')
    }

    setIsSubmitWatchList(true)

    const updateRes = await updateUserPorfolio(userContext.token, {
      alerts: userContext.alerts,
      assetEquities: userContext.assetEquities,
      watchedEquities: nWatchList,
      accountBalance: userContext.accountBalance,
      user: userContext.userProfile.userId,
    })

    if (updateRes.ok) {
      userContext.setContext({ ...userContext, watchedEquities: nWatchList })
    }

    setIsSubmitWatchList(false)
  }

  useEffect(() => {
    if (
      equityDetails &&
      userContext.watchedEquities.includes(equityDetails.symbol)
    ) {
      setWatchlistBtn('Remove to watch list')
    } else {
      setWatchlistBtn('Add to watch list')
    }
  }, [equityDetails, userContext.watchedEquities])

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
              <WatchListButton
                disabled={isSubmitWatchList}
                onClick={watchListBtnClick}
                type='button'
              >
                {isSubmitWatchList ? 'Saving...' : watchlistBtn}
              </WatchListButton>
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
              <InfoTitle>{'Prediction trend (Beta)'}</InfoTitle>
              <InfoBox>
                {!isNullOrEmpty(equityDetails.priceTrend) && (
                  <Chart
                    width='100%'
                    height={350}
                    chartType='ScatterChart'
                    loader={<LoadingSpinner isShow />}
                    data={equityDetails.priceTrend}
                    options={{ ...PRICE_TREND_CHART }}
                    rootProps={{ 'data-testid': 'priceTrend' }}
                  />
                )}
              </InfoBox>
              <InfoTitle>{'In next 30 days (Beta)'}</InfoTitle>
              <InfoBox>
                {!isNullOrEmpty(equityDetails.predictPrices) ? (
                  <Chart
                    width='100%'
                    height={350}
                    chartType='ScatterChart'
                    loader={<LoadingSpinner isShow />}
                    data={equityDetails.predictPrices}
                    options={{
                      backgroundColor: '#000',
                      colors: ['cyan'],
                    }}
                    rootProps={{ 'data-testid': 'predictPrice' }}
                  />
                ) : (
                  <p className='text-center'>
                    This stock doesn't have predict data yet
                  </p>
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
