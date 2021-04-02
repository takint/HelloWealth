import { useState, useEffect, memo } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import EquityInfo from './EquityInfo'
import { getEquityInfo, parseWatchedEquity } from '../services/helper'
import { InfoBox } from '../styles/global.styles'

export const WatchListBox = ({ watchedEquities, onRemoveEquityClick }) => {
  const [watchListDetails, setWatchListDetails] = useState([])
  const [loading, setLoading] = useState(false)

  const onRemoveFromWatchlist = (equity) => {
    let nWatchList = watchListDetails.filter(
      (stock) => stock.symbol !== equity.symbol
    )

    setWatchListDetails(nWatchList)
    onRemoveEquityClick && onRemoveEquityClick(equity)
  }

  useEffect(() => {
    const loadEquityData = async () => {
      setLoading(true)
      let allEquities = []

      for (let i = 0; i < watchedEquities.length; i++) {
        let equityData = await getEquityInfo(watchedEquities[i])
        if (equityData.price !== null) {
          allEquities.push(parseWatchedEquity(equityData))
        }
      }

      if (allEquities.length > 0) {
        setWatchListDetails(allEquities)
      }

      setLoading(false)
    }

    if (!loading && watchListDetails.length === 0) {
      loadEquityData()
    }
  }, [watchedEquities, watchListDetails, loading])

  return (
    <InfoBox>
      {loading ? (
        <LoadingSpinner isShow />
      ) : watchListDetails.length > 0 ? (
        <ul>
          {watchListDetails.map((stock, idx) => (
            <li key={`watchlist-${idx}`}>
              <EquityInfo
                equityData={stock}
                onRemoveClick={onRemoveFromWatchlist}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-center'>Watch list is empty</p>
      )}
    </InfoBox>
  )
}

WatchListBox.defaultProps = {
  watchedEquities: [],
  onRemoveEquityClick: () => {},
}

export default memo(WatchListBox)
