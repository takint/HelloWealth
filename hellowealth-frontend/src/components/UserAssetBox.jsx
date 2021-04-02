import EquityInfo from './EquityInfo'
import { InfoBox } from '../styles/global.styles'

export const UserAssetBox = () => {
  const assetList = []

  const onBuyStock = (stock) => {}
  const onSellStock = (stock) => {}

  return (
    <InfoBox>
      <ul>
        {assetList.map((stock, idx) => (
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
    </InfoBox>
  )
}

export default UserAssetBox
