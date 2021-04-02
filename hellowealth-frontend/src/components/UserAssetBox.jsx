import { useState, useEffect } from 'react'
import EquityInfo from './EquityInfo'
import LoadingSpinner from './LoadingSpinner'
import { getEquityInfo, parseWatchedEquity } from '../services/helper'
import { InfoBox } from '../styles/global.styles'

export const UserAssetBox = ({ onBuy, onSell, assets, onNewInfoLoaded }) => {
  const [assetListDetails, setAssetListDetails] = useState([])
  const [loading, setLoading] = useState(false)

  const onBuyStock = (stock, quantity) => {
    onBuy && onBuy(stock, quantity)
  }

  const onSellStock = (stock, quantity) => {
    onBuy && onSell(stock, quantity)
  }

  useEffect(() => {
    const loadEquityData = async () => {
      setLoading(true)
      let allEquities = []

      for (let i = 0; i < assets.length; i++) {
        let equityData = await getEquityInfo(assets[i].symbol)
        if (equityData.price !== null) {
          allEquities.push({
            ...parseWatchedEquity(equityData),
            boughtAt: assets[i].boughtAt,
            quantityHold: assets[i].quantityHold,
          })
        }
      }

      if (allEquities.length > 0) {
        setAssetListDetails(allEquities)
      }

      onNewInfoLoaded && onNewInfoLoaded(allEquities)
      setLoading(false)
    }

    if (!loading && assetListDetails.length === 0) {
      loadEquityData()
    }
  }, [assets, assetListDetails, loading, onNewInfoLoaded])

  return (
    <InfoBox>
      {loading ? (
        <LoadingSpinner isShow />
      ) : assetListDetails.length > 0 ? (
        <ul>
          {assetListDetails.map((stock, idx) => (
            <li key={`asset-${idx}`}>
              <EquityInfo
                isOnAssetList
                equityData={stock}
                onBuyClick={onBuyStock}
                onSellClick={onSellStock}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-center'>Asset list is empty</p>
      )}
    </InfoBox>
  )
}

UserAssetBox.defaultProps = {
  onBuy: (stock, quantity) => {},
  onSell: (stock, quantity) => {},
  onNewInfoLoaded: (updatedStocks) => {},
  assets: [],
}

export default UserAssetBox
