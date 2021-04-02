import { useContext, useState } from 'react'
import DashboardNavBar from '../components/DashboardNavBar'
import EquityInfo from '../components/EquityInfo'
import WatchListBox from '../components/WatchListBox'
import TransasctionBox from '../components/TransasctionBox'
import UserBalanceBox from '../components/UserBalanceBox'
import UserAssetBox from '../components/UserAssetBox'
import { UserContext } from '../services/context'
import { currencyFormat } from '../services/helper'
import { updateUserPorfolio, createUserTrans } from '../services/api'
import { assetList, MAX_CLAIM } from '../services/constants'
import {
  InfoTitle,
  InfoBox,
  Button,
  FormInput,
  Spacer,
  ErrorMsg,
} from '../styles/global.styles'

export const PortfolioPage = () => {
  const userContext = useContext(UserContext)
  const [addedBalance, setAddedBalance] = useState(0)
  const [cashError, setCashError] = useState(false)
  const [watchList, setWatchList] = useState([]) //userContext.watchedEquities

  const onEditClaim = (e) => {
    setAddedBalance(e.target.value)
  }

  const onBuyStock = (equity) => {}
  const onSellStock = (equity) => {}

  const onClaimBtnClick = async () => {
    const addAmount = parseFloat(addedBalance)
    const balanceAdded = userContext.accountBalance + addAmount

    if (addAmount > MAX_CLAIM || balanceAdded > MAX_CLAIM) {
      setCashError(true)
      setAddedBalance(0)
      setTimeout(() => {
        setCashError(false)
      }, 2000)
    } else {
      const postTransRes = await createUserTrans(userContext.token, {
        transContent: 'Claim Virtual Cash',
        transType: 'plus',
        amount: addAmount,
        balance: balanceAdded,
        user: userContext.userProfile.userId,
      })

      if (postTransRes.ok) {
        userContext.setContext({ ...userContext, accountBalance: balanceAdded })
        await updateUserPorfolio(userContext.token, {
          ...userContext,
          accountBalance: balanceAdded,
          user: userContext.userProfile.userId,
        })
      }
    }
  }

  const onRemoveFromWatchlist = async (equity) => {
    let nWatchList = userContext.watchedEquities.filter(
      (symbol) => equity.symbol !== symbol
    )

    userContext.setContext({ ...userContext, watchedEquities: nWatchList })

    await updateUserPorfolio(userContext.token, {
      alerts: userContext.alerts,
      assetEquities: userContext.assetEquities,
      watchedEquities: userContext.watchedEquities,
      accountBalance: userContext.accountBalance,
      user: userContext.userProfile.userId,
    })

    setWatchList(nWatchList)
  }

  return (
    <div className='w-full'>
      <DashboardNavBar />
      <div className='w-full px-4 py-1 flex flex-col lg:flex-row'>
        <div className='flex-none p-2'>
          <InfoTitle>
            {`Howdy, ${userContext.userProfile.firstName}!`}
            <br />
            <UserBalanceBox
              token={userContext.token}
              accountBalance={userContext.accountBalance}
            />
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
            {cashError && <ErrorMsg>Virtual Cash limit exceed!</ErrorMsg>}
            <label>Amount $:</label>
            <FormInput
              type='number'
              value={addedBalance}
              className='my-2 lg:mx-2'
              placeholder='1000.00'
              onChange={onEditClaim}
              name='userBalance'
            />
            <Button onClick={onClaimBtnClick} type='button'>
              Claim virtual cash
            </Button>
          </InfoBox>
        </div>
        <div className='flex-auto p-2'>
          <InfoTitle>Your watchlist</InfoTitle>
          <WatchListBox
            watchedEquities={watchList}
            onRemoveEquityClick={onRemoveFromWatchlist}
          />
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
      <TransasctionBox
        token={userContext.token}
        newBalance={userContext.accountBalance}
      />
      <Spacer height='3rem' />
    </div>
  )
}

PortfolioPage.defaultProps = {}

export default PortfolioPage
