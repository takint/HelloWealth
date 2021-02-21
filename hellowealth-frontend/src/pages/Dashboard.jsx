import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Chart } from 'react-google-charts'
import AsyncSelect from 'react-select/async'
import LoadingSpinner from '../components/LoadingSpinner'
import { ReactSelectStyles, UserMenu } from '../styles/global.styles'
import { symbolNameAutoComplete } from '../services/api'
import { isNullOrEmpty, buildEquitiesOptions } from '../services/helper'

export const DashboardPage = () => {
  const [loading, setLoading] = useState(false)
  const [selectedEquity, setSelectedEquity] = useState(null)
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
        //TODO: there is news inside response
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

  const onInputChange = (option) => {
    setSearchInput({
      ...searchInput,
      error: false,
    })

    setSelectedEquity(option)
    console.log(selectedEquity)
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
      <div className='w-full'>
        {isNullOrEmpty(selectedEquity) ? (
          <LoadingSpinner isShow={loading} />
        ) : (
          <>
            <div>
              <h2>
                <span className='px-1'>{selectedEquity.data.symbol}</span>
                <strong className='border-l px-1 border-blue'>
                  {selectedEquity.data.longname}
                </strong>
              </h2>
              <button type='button'>Add to watch list</button>
            </div>
            <div>
              <h3>Performance</h3>
              <div>
                <Chart
                  width={'100%'}
                  height={350}
                  chartType='CandlestickChart'
                  loader={<div>Loading Chart</div>}
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
              </div>
              <h3>Market Details</h3>
              <div>Market box</div>
              <h3>About {selectedEquity && selectedEquity.data.longname}</h3>
              <p>
                Amarin Corporation plc, a pharmaceutical company, develops and
                commercializes therapeutics for the treatment of cardiovascular
                diseases in the United States. The company's lead product is
                Vascepa, a prescription-only omega-3 fatty acid capsule, used as
                an adjunct to diet for reducing triglyceride levels in adult
                patients with severe hypertriglyceridemia. It is also involved
                in developing REDUCE-IT for the treatment of patients with high
                triglyceride levels who are also on statin therapy for elevated
                low-density lipoprotein cholesterol levels. The company sells
                its products principally to wholesalers and specialty pharmacy
                providers through direct sales force. It has a collaboration
                with Mochida Pharmaceutical Co., Ltd. to develop and
                commercialize drug products and indications based on the active
                pharmaceutical ingredient in Vascepa, the omega-3 acid, and
                eicosapentaenoic acid. The company was formerly known as Ethical
                Holdings plc and changed its name to Amarin Corporation plc in
                1999. Amarin Corporation plc was incorporated in 1989 and is
                headquartered in Dublin, Ireland.
              </p>
              <h3>Prediction trend</h3>
              <div>
                <Chart
                  width={'100%'}
                  height={350}
                  chartType='CandlestickChart'
                  loader={<div>Loading Chart</div>}
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
