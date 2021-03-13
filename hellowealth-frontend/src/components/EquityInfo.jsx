import { Chart } from 'react-google-charts'
import { currencyFormat } from '../services/helper'
import {
  StockWrapper,
  StockSymbolWrapper,
  PriceWrapper,
  PriceBadge,
  Button,
  TradeButton,
} from '../styles/global.styles'

export const EquityInfo = ({
  equityData,
  onRemoveClick,
  onBuyClick,
  onSellClick,
  isOnAssetList,
}) => {
  const onRemoveBtnClick = () => {
    onRemoveClick && onRemoveClick(equityData)
  }

  const onBuyBtnClick = () => {
    onBuyClick && onBuyClick(equityData)
  }

  const onSellBtnClick = () => {
    onSellClick && onSellClick(equityData)
  }

  return (
    <StockWrapper>
      <StockSymbolWrapper>
        <strong>{equityData.symbol}</strong>
        {isOnAssetList ? (
          <>
            <TradeButton type='button' onClick={onBuyBtnClick}>
              Buy
            </TradeButton>
            <TradeButton type='button' onClick={onSellBtnClick}>
              Sell
            </TradeButton>
          </>
        ) : (
          <Button type='button' onClick={onRemoveBtnClick}>
            Remove
          </Button>
        )}
      </StockSymbolWrapper>
      {isOnAssetList ? (
        <div>
          <PriceWrapper>
            Buy at:
            <PriceBadge noArrow>
              {currencyFormat(equityData.buyPrice)}
            </PriceBadge>
            Current:
            <PriceBadge>
              {`${currencyFormat(equityData.todayPrice)} (${
                equityData.changedPercent
              } %)`}
            </PriceBadge>
          </PriceWrapper>
        </div>
      ) : (
        <div>
          <PriceWrapper>
            High:
            <PriceBadge>{currencyFormat(equityData.highPrice)}</PriceBadge>
            Low:
            <PriceBadge isDown>
              {currencyFormat(equityData.lowPrice)}
            </PriceBadge>
          </PriceWrapper>
          <PriceWrapper>
            Open:{' '}
            <PriceBadge>
              {`${currencyFormat(equityData.openPrice)} (${
                equityData.changedPercentOpen
              } %)`}
            </PriceBadge>
            Close:{' '}
            <PriceBadge isDown>
              {`${currencyFormat(equityData.closePrice)} (${
                equityData.changedPercentClose
              } %)`}
            </PriceBadge>
          </PriceWrapper>
        </div>
      )}

      <div>
        <Chart
          width={'350px'}
          height={'200px'}
          chartType='AreaChart'
          legendToggle={true}
          loader={<div>Loading Chart</div>}
          data={[['Style', equityData.symbol], ...equityData.weeklyPrices]}
          options={{
            height: 150,
            legend: 'none',
            colors: ['#7EC8E3'],
            vAxis: {
              minValue: equityData.minPrice,
            },
          }}
          rootProps={{ 'data-testid': 'TSLA' }}
        />
      </div>
    </StockWrapper>
  )
}

EquityInfo.defaultProps = {
  equityData: {
    symbol: 'MSFT',
    minPrice: 100,
    buyPrice: 200,
    todayPrice: 201,
    changedPercent: 1.1,
    highPrice: 230,
    lowPrice: 200,
    openPrice: 202,
    changedPercentOpen: 0.4,
    closePrice: 205,
    changedPercentClose: 0.2,
    weeklyPrices: [
      ['W1', 5.2],
      ['W2', 5.6],
      ['W3', 7.2],
      ['W4', 5],
      ['W4', 4],
      ['W4', 6],
    ],
  },
}

export default EquityInfo
