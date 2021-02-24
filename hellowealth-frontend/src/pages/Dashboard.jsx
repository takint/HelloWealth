import { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Chart } from 'react-google-charts'
import AsyncSelect from 'react-select/async'
import LoadingSpinner from '../components/LoadingSpinner'
import MarketDetailsBox from '../components/MarketDetailsBox'
import {
  ReactSelectStyles,
  UserMenu,
  InfoTitle,
  InfoBox,
  Spacer,
  WatchListButton,
} from '../styles/global.styles'
import {
  logout,
  symbolNameAutoComplete,
  getEquitySummary,
} from '../services/api'
import { UserContext, initialUserContext } from '../services/context'
import { isNullOrEmpty, buildEquitiesOptions } from '../services/helper'
import { removeCookie, JWT_COOKIE } from '../services/cookies'

export const DashboardPage = ({ equity }) => {
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [selectedEquity, setSelectedEquity] = useState(equity)
  const [equityDetails, setEquityDetails] = useState({
    price: null,
    summaryDetail: null,
    summaryProfile: null,
  })

  const [searchInput, setSearchInput] = useState({
    isSearched: false,
    error: false,
    value: null,
  })

  const loadOptions = async (q, callback) => {
    let results = []

    setSearchInput({
      ...searchInput,
      isSearched: false,
      error: false,
    })

    if (!loading && q.length >= 2) {
      setLoading(true)

      setSearchInput({
        ...searchInput,
        isSearched: true,
      })

      // TODO: will allow users choose region in the future
      const response = await symbolNameAutoComplete({ region: 'US', q })

      if (!response.error && response.ok) {
        // TODO: there is news inside response
        const autocomplete = response.quotes
        let rsData = {
          equities: autocomplete || [],
        }

        Object.keys(rsData).map((key) => {
          if (rsData[key].length) {
            results.push(buildEquitiesOptions(rsData[key], key))
          }
          return null
        })
      }

      setLoading(false)
    }

    callback(results)
  }

  const onInputChange = async (option) => {
    setSearchInput({
      ...searchInput,
      error: false,
    })

    setSelectedEquity(option)

    if (!isNullOrEmpty(selectedEquity)) {
      setLoading(true)
      const response = await getEquitySummary({
        region: 'US',
        symbol: selectedEquity.value,
      })

      //const response = {}

      if (!response.error && response.ok) {
        setEquityDetails({
          price: response.price,
          summaryDetail: response.summaryDetail,
          summaryProfile: response.summaryProfile,
        })
      }
      console.log(response)
      console.log(equityDetails)
      setLoading(false)
    }
  }

  const onLogOutClick = async () => {
    const response = await logout()
    if (!response.error) {
      removeCookie(JWT_COOKIE)
      userContext.setContext({
        ...userContext,
        ...initialUserContext,
      })

      history.push('/')
    }
  }

  return (
    <div className='w-full'>
      <UserMenu>
        <Link to='/portfolio'>Portfolio</Link>
        <Link to='/dashboard'>Dashboard</Link>
        <AsyncSelect
          cacheOptions
          className='rounded w-full lg:w-1/2'
          classNamePrefix='query-field'
          instanceId='equitiesSearchBar'
          styles={ReactSelectStyles}
          name='listing'
          value={isNullOrEmpty(selectedEquity) ? null : selectedEquity}
          onFocus={() => {
            setSearchInput({
              ...searchInput,
              isSearched: false,
              value: null,
            })
          }}
          noOptionsMessage={() =>
            searchInput.isSearched ? 'No Results' : null
          }
          blurInputOnSelect={true}
          loadOptions={loadOptions}
          onChange={onInputChange}
          placeholder='Search for symbol or name'
        />
        <button type='button' onClick={onLogOutClick}>
          Log Out
        </button>
        <Link to='/help'>Help</Link>
      </UserMenu>
      <div className='w-full p-6'>
        {isNullOrEmpty(selectedEquity) ? (
          <LoadingSpinner isShow={loading} />
        ) : (
          <>
            <div className='flex flex-col justify-between items-center lg:flex-row'>
              <h2>
                <span className='px-1 text-lg'>
                  {selectedEquity.data.symbol}
                </span>
                <strong className='border-l-2 px-1 border-blue text-lg'>
                  {selectedEquity.data.longname}
                </strong>
              </h2>
              <WatchListButton type='button'>Add to watch list</WatchListButton>
            </div>
            <div className='flex flex-col'>
              {/* === Stock Performance === */}
              <InfoTitle>Performance</InfoTitle>
              <InfoBox>
                <Chart
                  width='100%'
                  height={350}
                  chartType='CandlestickChart'
                  loader={<LoadingSpinner isShow />}
                  data={[
                    ['day', 'a', 'b', 'c', 'd'],
                    ['Mon', 20, 28, 38, 45],
                    ['Tue', 31, 38, 55, 66],
                    ['Wed', 50, 55, 77, 80],
                    ['Thu', 77, 77, 66, 50],
                    ['Fri', 68, 66, 22, 15],
                  ]}
                  options={{
                    legend: 'none',
                    bar: { groupWidth: '100%' }, // Remove space between bars.
                    candlestick: {
                      fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                      risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
                    },
                  }}
                  rootProps={{ 'data-testid': '2' }}
                />
              </InfoBox>

              {/* === Market details === */}
              <InfoTitle>Market Details</InfoTitle>
              <MarketDetailsBox summaryDetail={equityDetails.summaryDetail} />

              {/* === About company === */}
              <InfoTitle>
                About {selectedEquity && selectedEquity.data.longname}
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
                <Chart
                  width='100%'
                  height={350}
                  chartType='CandlestickChart'
                  loader={<LoadingSpinner isShow />}
                  data={[
                    ['day', 'a', 'b', 'c', 'd'],
                    ['Mon', 20, 28, 38, 45],
                    ['Tue', 31, 38, 55, 66],
                    ['Wed', 50, 55, 77, 80],
                    ['Thu', 77, 77, 66, 50],
                    ['Fri', 68, 66, 22, 15],
                  ]}
                  options={{
                    legend: 'none',
                    bar: { groupWidth: '100%' }, // Remove space between bars.
                    candlestick: {
                      fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                      risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
                    },
                  }}
                  rootProps={{ 'data-testid': '2' }}
                />
              </InfoBox>
            </div>
          </>
        )}
      </div>
      <Spacer height='3rem' />
    </div>
  )
}

DashboardPage.defaultProps = {
  equity: {
    data: {
      symbol: 'TSLA',
      longname: 'Test Comp',
    },
    value: 'TSLA',
  },
}

export default DashboardPage
