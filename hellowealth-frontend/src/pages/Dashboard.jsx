import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart } from 'react-google-charts'
import AsyncSelect from 'react-select/async'
import LoadingSpinner from '../components/LoadingSpinner'
import EquityDetailsRow from '../components/EquityDetailsRow'
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

export const DashboardPage = ({ equity }) => {
  const [loading, setLoading] = useState(false)
  const [selectedEquity, setSelectedEquity] = useState(equity)
  const [equityDetails, setEquityDetails] = useState(equity)
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
              {equityDetails && equityDetails.summaryDetail ? (
                <InfoBox className='flex flex-col flex-wrap lg:flex-row'>
                  <EquityDetailsRow
                    label='Asked price'
                    value={equityDetails.summaryDetail.ask.raw}
                  />
                  <EquityDetailsRow
                    label='Price'
                    value={equityDetails.summaryDetail.bid.raw}
                  />
                  <EquityDetailsRow
                    label='Avg. Volume'
                    value={equityDetails.summaryDetail.averageVolume.raw}
                    format='decimal'
                  />
                  <EquityDetailsRow
                    label='Beta'
                    value={equityDetails.summaryDetail.beta.raw}
                    format='decimal'
                  />
                  <EquityDetailsRow
                    label="Today's High"
                    value={equityDetails.summaryDetail.dayHigh.raw}
                    format='decimal'
                  />
                  <EquityDetailsRow
                    label="Today's Low"
                    value={equityDetails.summaryDetail.dayLow.raw}
                    format='decimal'
                  />
                  <EquityDetailsRow
                    label='Market Cap'
                    value={equityDetails.summaryDetail.marketCap.raw}
                  />
                </InfoBox>
              ) : (
                <InfoBox>Missing data</InfoBox>
              )}

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
