import { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ReactSelectStyles, UserMenu } from '../styles/global.styles'
import { logout, symbolNameAutoComplete } from '../services/api'
import { UserContext, initialUserContext } from '../services/context'
import { isNullOrEmpty, buildEquitiesOptions } from '../services/helper'
import { removeCookie, JWT_COOKIE } from '../services/cookies'
import AsyncSelect from 'react-select/async'

const DashboardNavBar = ({ onSearchInputChange }) => {
  const userContext = useContext(UserContext)
  const history = useHistory()
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
      setSearchInput({
        ...searchInput,
        isSearched: true,
      })

      setLoading(true)

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
    }

    setLoading(false)
    callback(results)
  }

  const onInputChange = async (option) => {
    setSearchInput({
      ...searchInput,
      error: false,
    })

    setSelectedEquity(option)
    onSearchInputChange && onSearchInputChange(option)
  }

  const onLogOutClick = async () => {
    const response = await logout()
    if (!response.error) {
      removeCookie(JWT_COOKIE)
      userContext.setContext(initialUserContext)

      history.push('/')
    }
  }

  return (
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
        noOptionsMessage={() => (searchInput.isSearched ? 'No Results' : null)}
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
  )
}

DashboardNavBar.defaultProps = {
  onSearchInputChange: (selectedEquity) => {},
}

export default DashboardNavBar
