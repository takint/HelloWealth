import { useState } from 'react'
import { Chart } from 'react-google-charts'
import DisplayPriceLabel from './DisplayPriceLabel'
import { currencyFormat } from '../services/helper'
import {
  StockWrapper,
  StockSymbolWrapper,
  PriceWrapper,
  PriceBadge,
  Button,
  TradeButton,
  FormInput,
} from '../styles/global.styles'

export const EquityInfo = ({
  equityData,
  onRemoveClick,
  onBuyClick,
  onSellClick,
  isOnAssetList,
}) => {
  const [buyOpen, setBuyOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const [addedStock, setAddedStock] = useState(0)
  const [removedStock, setRemovedStock] = useState(0)
  const numberFormat = new Intl.NumberFormat('en-CA')

  const onBuyQuantityChange = (e) => {
    setAddedStock(e.target.value)
  }

  const onSellQuantityChange = (e) => {
    setRemovedStock(e.target.value)
  }

  const onToggleBuyBtnClick = () => setBuyOpen(!buyOpen)
  const onToggleSellBtnClick = () => setSellOpen(!sellOpen)

  const onRemoveBtnClick = () => {
    onRemoveClick && onRemoveClick(equityData)
  }

  const onBuyBtnClick = () => {
    onBuyClick && onBuyClick(equityData, addedStock)
  }

  const onSellBtnClick = () => {
    onSellClick && onSellClick(equityData, removedStock)
  }

  return (
    <StockWrapper>
      <StockSymbolWrapper>
        <strong>{equityData.symbol}</strong>

        <TradeButton type='button' onClick={onToggleBuyBtnClick}>
          Buy
        </TradeButton>
        {buyOpen && (
          <div className='flex flex-col mb-2 lg:block'>
            <FormInput
              type='number'
              value={addedStock}
              className='my-2 lg:mr-2 text-right'
              placeholder='10'
              onChange={onBuyQuantityChange}
              min={0}
              max={1000}
              name='addedQuantity'
            />
            <Button onClick={onBuyBtnClick} type='button'>
              Get Stock
            </Button>
          </div>
        )}

        {isOnAssetList && (
          <>
            <TradeButton type='button' onClick={onToggleSellBtnClick}>
              Sell
            </TradeButton>

            {sellOpen && (
              <div className='flex flex-col mb-2 lg:block'>
                <FormInput
                  type='number'
                  value={removedStock}
                  className='my-2 lg:mr-2 text-right'
                  placeholder='10'
                  onChange={onSellQuantityChange}
                  min={0}
                  max={1000}
                  name='removedQuantity'
                />
                <Button onClick={onSellBtnClick} type='button'>
                  Sell Stock
                </Button>
              </div>
            )}
          </>
        )}

        {!isOnAssetList && (
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
              {currencyFormat(equityData.boughtAt)}
            </PriceBadge>
            Current:
            <PriceBadge isDown={equityData.changedPercent < 0}>
              {`${currencyFormat(equityData.buyPrice)} (${numberFormat.format(
                equityData.changedPercent
              )} %)`}
            </PriceBadge>
          </PriceWrapper>
        </div>
      ) : (
        <div>
          <PriceWrapper>
            High:
            <PriceBadge noArrow>
              {currencyFormat(equityData.highPrice)}
            </PriceBadge>
            Low:
            <PriceBadge noArrow isDown>
              {currencyFormat(equityData.lowPrice)}
            </PriceBadge>
          </PriceWrapper>
          <PriceWrapper>
            <DisplayPriceLabel
              id={'open-1'}
              priceChange={equityData.changedPercentOpen}
              equityPrice={equityData.openPrice}
              priceType='Open'
              toolTips='This price is compared to previouse closed price'
            />
            <DisplayPriceLabel
              id={'close-1'}
              priceChange={equityData.changedPercentClose}
              equityPrice={equityData.closePrice}
              priceType='Close'
              toolTips='This price is compared to today opened price'
            />
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
              format: 'currency',
            },
            hAxis: {
              direction: -1,
            },
          }}
          rootProps={{ 'data-testid': equityData.symbol }}
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
