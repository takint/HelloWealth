import { useContext } from 'react'
import DashboardNavBar from '../components/DashboardNavBar'
import { UserContext } from '../services/context'
import { currencyFormat } from '../services/helper'
import { InfoTitle, InfoBox, Spacer } from '../styles/global.styles'

export const PortfolioPage = () => {
  const userContext = useContext(UserContext)
  return (
    <div className='w-full'>
      <DashboardNavBar />
      <div className='w-full p-6 flex flex-col lg:flex-row'>
        <div className='flex-none p-2'>
          <InfoTitle>
            {`Howdy, ${userContext.userProfile.firstName}! Your porfolio value is`}
            <br />
            <strong className='font-body text-4xl'>
              {currencyFormat(userContext.accountBalance)}
            </strong>
          </InfoTitle>
          <InfoTitle>
            {`Avalable cash for buying stock is`}
            <br />
            <strong className='font-body text-2xl'>
              {currencyFormat(userContext.accountBalance)}
            </strong>
          </InfoTitle>
          <InfoTitle>If you want to try your trading skills</InfoTitle>
          <InfoBox>
            <label>Amount:</label>
            <input type='number' value='0' name='userBalance' />
            <button type='button'>Claim virtual cash</button>
          </InfoBox>
        </div>
        <div className='flex-auto p-2'>
          <InfoTitle>Your watchlist</InfoTitle>
          <InfoBox>
            <ul>
              <li>TSLA</li>
              <li>MSFT</li>
              <li>AMZN</li>
              <li>GOOLG</li>
            </ul>
          </InfoBox>
          <InfoTitle>Your Assets</InfoTitle>
          <InfoBox>
            <ul>
              <li>TSLA</li>
              <li>MSFT</li>
              <li>AMZN</li>
              <li>GOOLG</li>
            </ul>
          </InfoBox>
        </div>
      </div>
      <div className='w-full p-6'>
        <InfoTitle>Your Transaction</InfoTitle>
        <InfoBox>
          <ul>
            <li>TSLA</li>
            <li>MSFT</li>
            <li>AMZN</li>
            <li>GOOLG</li>
          </ul>
        </InfoBox>
      </div>
      <Spacer height='3rem' />
    </div>
  )
}

PortfolioPage.defaultProps = {}

export default PortfolioPage
