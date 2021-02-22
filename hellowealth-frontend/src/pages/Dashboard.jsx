import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart } from 'react-google-charts'
import AsyncSelect from 'react-select/async'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  ReactSelectStyles,
  UserMenu,
  InfoTitle,
  InfoBox,
  Spacer,
  WatchListButton,
} from '../styles/global.styles'
import { symbolNameAutoComplete, getEquitySummary } from '../services/api'
import { isNullOrEmpty, buildEquitiesOptions } from '../services/helper'

export const DashboardPage = () => {
  const [loading, setLoading] = useState(false)
  const [selectedEquity, setSelectedEquity] = useState(null)
  const [equityDetails, setEquityDetails] = useState({})
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

  useEffect(() => {
    const getEquityData = async () => {
      setLoading(true)
      const response = await getEquitySummary({
        region: 'US',
        symbol: selectedEquity.value,
      })

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

    if (!isNullOrEmpty(selectedEquity)) {
      getEquityData()
    }
  }, [selectedEquity])

  const onInputChange = async (option) => {
    setSearchInput({
      ...searchInput,
      error: false,
    })

    setSelectedEquity(option)
  }
  /*
  ask: {raw: 760, fmt: "760.00"}
  askSize: {raw: 800, fmt: "800", longFmt: "800"}
  averageDailyVolume10Day: {raw: 21237340, fmt: "21.24M", longFmt: "21,237,340"}
  averageVolume: {raw: 40965440, fmt: "40.97M", longFmt: "40,965,440"}
  averageVolume10days: {raw: 21237340, fmt: "21.24M", longFmt: "21,237,340"}
  beta: {raw: 2.090715, fmt: "2.09"}
  bid: {raw: 759.55, fmt: "759.55"}
  bidSize: {raw: 800, fmt: "800", longFmt: "800"}
  circulatingSupply: {}
  currency: "USD"
  dayHigh: {raw: 796.7899, fmt: "796.79"}
  dayLow: {raw: 777.39, fmt: "777.39"}
  dividendRate: {}
  dividendYield: {}
  exDividendDate: {}
  expireDate: {}
  fiftyDayAverage: {raw: 828.02423, fmt: "828.02"}
  fiftyTwoWeekHigh: {raw: 900.4, fmt: "900.40"}
  fiftyTwoWeekLow: {raw: 70.102, fmt: "70.10"}
  fiveYearAvgDividendYield: {}
  forwardPE: {raw: 144.41774, fmt: "144.42"}
  fromCurrency: null
  lastMarket: null
  marketCap: {raw: 749933953024, fmt: "749.93B", longFmt: "749,933,953,024"}
  maxAge: 1
  maxSupply: {}
  navPrice: {}
  open: {raw: 795, fmt: "795.00"}
  openInterest: {}
  payoutRatio: {raw: 0, fmt: "0.00%"}
  previousClose: {raw: 787.38, fmt: "787.38"}
  priceHint: {raw: 2, fmt: "2", longFmt: "2"}
  priceToSalesTrailing12Months: {raw: 23.780249, fmt: "23.78"}
  regularMarketDayHigh: {raw: 796.7899, fmt: "796.79"}
  regularMarketDayLow: {raw: 777.39, fmt: "777.39"}
  regularMarketOpen: {raw: 795, fmt: "795.00"}
  regularMarketPreviousClose: {raw: 787.38, fmt: "787.38"}
  regularMarketVolume: {raw: 18958255, fmt: "18.96M", longFmt: "18,958,255"}
  startDate: {}
  strikePrice: {}
  toCurrency: null
  totalAssets: {}
  tradeable: false
  trailingAnnualDividendRate: {}
  trailingAnnualDividendYield: {}
  trailingPE: {raw: 1220.7812, fmt: "1,220.78"}
  twoHundredDayAverage: {raw: 554.72736, fmt: "554.73"}
  volume: 
*/
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
        <Link to='/logout'>Log Out</Link>
        <Link to='/help'>Help</Link>
      </UserMenu>
      <div className='w-full p-6'>
        {isNullOrEmpty(selectedEquity) ? (
          <LoadingSpinner isShow={loading} />
        ) : (
          <>
            <div className='flex justify-between items-center'>
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
              <InfoTitle>Market Details</InfoTitle>
              <InfoBox>Market box</InfoBox>
              <InfoTitle>
                About {selectedEquity && selectedEquity.data.longname}
              </InfoTitle>
              <InfoBox>
                {/* {!isNullOrEmpty(equityDetails) &&
                  !isNullOrEmpty(equityDetails.summaryProfile) && (
                    <p>{equityDetails.summaryProfile.longBusinessSummary}</p>
                  )} */}
                <p>
                  Tesla, Inc. designs, develops, manufactures, leases, and sells
                  electric vehicles, and energy generation and storage systems
                  in the United States, China, and internationally. The company
                  operates in two segments, Automotive, and Energy Generation
                  and Storage. The Automotive segment offers electric vehicles,
                  as well as sells automotive regulatory credits. It provides
                  sedans and sport utility vehicles through direct and used
                  vehicle sales, a network of Tesla Superchargers, and in-app
                  upgrades; and purchase financing and leasing services. This
                  segment is also involved in the provision of non-warranty
                  after-sales vehicle services, sale of used vehicles, retail
                  merchandise, and vehicle insurance, as well as sale of
                  products through its subsidiaries to third party customers;
                  services for electric vehicles through its company-owned
                  service locations, and Tesla mobile service technicians; and
                  vehicle limited warranties and extended service plans. The
                  Energy Generation and Storage segment engages in the design,
                  manufacture, installation, sale, and leasing of solar energy
                  generation and energy storage products, and related services
                  to residential, commercial, and industrial customers and
                  utilities through its website, stores, and galleries, as well
                  as through a network of channel partners. This segment also
                  offers service and repairs to its energy product customers,
                  including under warranty; and various financing options to its
                  solar customers. The company was formerly known as Tesla
                  Motors, Inc. and changed its name to Tesla, Inc. in February
                  2017. Tesla, Inc. was founded in 2003 and is headquartered in
                  Palo Alto, California.
                </p>
              </InfoBox>
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

export default DashboardPage
