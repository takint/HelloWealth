import { useContext, useState } from 'react'
import { Chart } from 'react-google-charts'
import DashboardNavBar from '../components/DashboardNavBar'
import EquityInfo from '../components/EquityInfo'
import { UserContext } from '../services/context'
import { currencyFormat } from '../services/helper'
import { watchlist, assetList, transactionList } from '../services/constants'
import {
  InfoTitle,
  InfoBox,
  InfoRow,
  PriceBadge,
  Button,
  FormInput,
  Spacer,
} from '../styles/global.styles'

export const PortfolioPage = () => {
  const userContext = useContext(UserContext)
  const [addedBalance, setAddedBalance] = useState(undefined)

  const onEditClaim = (e) => {
    setAddedBalance(e.target.value)
  }

  const onBuyStock = (equity) => {}
  const onSellStock = (equity) => {}
  const onRemoveFromWatchlist = (equity) => {}

  return (
    <div className='w-full'>
      <DashboardNavBar />
      <div className='w-full px-4 py-1 flex flex-col lg:flex-row'>
        <div className='flex-none p-2'>
          <InfoTitle>
            {`Howdy, ${userContext.userProfile.firstName}!`}
            <br />
            <strong>Your porfolio value is:</strong>
            <br />
            <strong className='font-body text-4xl'>
              {currencyFormat(userContext.accountBalance)}
            </strong>
            <p>
              Your're profitting:
              <PriceBadge>
                {currencyFormat(10.0)} {'(1.2%)'}
              </PriceBadge>
            </p>
            <br />
            <InfoBox>
              <Chart
                width={'100%'}
                height={'200px'}
                chartType='AreaChart'
                legendToggle={true}
                loader={<div>Loading Chart</div>}
                data={[
                  ['Style', 'Balance'],
                  ['W1', 5.2],
                  ['W2', 5.6],
                  ['W3', 7.2],
                  ['W4', 5],
                  ['W4', 4],
                  ['W4', 6],
                ]}
                options={{
                  height: 150,
                  legend: 'none',
                  colors: ['#538135'], //#b91c1c
                  vAxis: {
                    minValue: 3,
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </InfoBox>
          </InfoTitle>
          <InfoTitle>
            Available cash for buying stock is:
            <br />
            <strong className='font-body text-2xl'>
              {currencyFormat(userContext.accountBalance)}
            </strong>
          </InfoTitle>
          <InfoTitle>If you want to try your trading skills</InfoTitle>
          <InfoBox className='flex flex-col lg:block'>
            <label>Amount $:</label>
            <FormInput
              type='number'
              value={addedBalance}
              className='my-2 lg:mx-2'
              placeholder='1000.00'
              onChange={onEditClaim}
              name='userBalance'
            />
            <Button type='button'>Claim virtual cash</Button>
          </InfoBox>
        </div>
        <div className='flex-auto p-2'>
          <InfoTitle>Your watchlist</InfoTitle>
          <InfoBox>
            <ul>
              {watchlist.map((stock, idx) => (
                <li key={`watchlist-${idx}`}>
                  <EquityInfo
                    equityData={stock}
                    onRemoveClick={onRemoveFromWatchlist}
                  />
                </li>
              ))}
            </ul>
          </InfoBox>
          <InfoTitle>Your Assets</InfoTitle>
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
        </div>
      </div>
      <div className='w-full px-4 py-1'>
        <InfoTitle>Your Transaction</InfoTitle>
        <InfoBox>
          <div>
            <InfoRow>
              <strong>Trans. ID</strong>
              <strong>Date Time</strong>
              <strong>Transaction</strong>
              <strong>Amount</strong>
              <strong>Balance</strong>
            </InfoRow>
            {transactionList.map((item, idx) => (
              <InfoRow key={idx}>
                <span>{item.id}</span>
                <span>{item.transDate}</span>
                <span>{item.transContent}</span>
                <span
                  className={
                    item.transType === 'plus' ? 'text-green' : 'text-red'
                  }
                >
                  {currencyFormat(item.amount)}
                </span>
                <span>{currencyFormat(item.balance)}</span>
              </InfoRow>
            ))}
          </div>
        </InfoBox>
      </div>
      <Spacer height='3rem' />
    </div>
  )
}

PortfolioPage.defaultProps = {}

export default PortfolioPage
