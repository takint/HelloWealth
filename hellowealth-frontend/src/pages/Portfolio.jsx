import { useContext, useState } from 'react'
import DashboardNavBar from '../components/DashboardNavBar'
import WatchListBox from '../components/WatchListBox'
import TransasctionBox from '../components/TransasctionBox'
import UserBalanceBox from '../components/UserBalanceBox'
import UserAssetBox from '../components/UserAssetBox'
import { UserContext } from '../services/context'
import { currencyFormat } from '../services/helper'
import { updateUserPorfolio, createUserTrans } from '../services/api'
import { MAX_CLAIM } from '../services/constants'
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
  const [watchList, setWatchList] = useState(userContext.watchedEquities)
  const [assetList, setAssetList] = useState(userContext.assetEquities)

  const onEditClaim = (e) => {
    setAddedBalance(e.target.value)
  }

  const onBuyStock = async (equity, quantity) => {
    let totalPrice = equity.buyPrice * quantity

    if (totalPrice <= userContext.accountBalance) {
      let boughtStock = {
        symbol: equity.symbol,
        boughtAt: equity.buyPrice,
        quantityHold: quantity,
      }

      let nBalance = userContext.accountBalance - totalPrice

      const postTransRes = await createUserTrans(userContext.token, {
        transContent: `Buy ${quantity} of ${equity.symbol}`,
        transType: 'sub',
        amount: totalPrice,
        balance: nBalance,
        user: userContext.userProfile.userId,
      })

      if (postTransRes.ok) {
        let nAsset = userContext.assetEquities
        let existedAsset = nAsset.findIndex(
          (item) => item.symbol === equity.symbol
        )

        if (existedAsset < 0) {
          nAsset.push(boughtStock)
        } else {
          nAsset[existedAsset].boughtAt = equity.buyPrice
          nAsset[existedAsset].quantityHold += quantity
        }

        userContext.setContext({
          ...userContext,
          accountBalance: nBalance,
          assetEquities: nAsset,
        })

        await updateUserPorfolio(userContext.token, {
          ...userContext,
          accountBalance: nBalance,
          assetEquities: nAsset,
          user: userContext.userProfile.userId,
        })

        setAssetList(nAsset)
      }
    }
  }

  const onSellStock = async (equity, quantity) => {
    let nAsset = userContext.assetEquities
    let existedAsset = nAsset.findIndex((item) => item.symbol === equity.symbol)

    if (quantity <= nAsset[existedAsset].quantityHold) {
      let totalPrice = equity.buyPrice * quantity
      let nBalance = userContext.accountBalance + totalPrice

      const postTransRes = await createUserTrans(userContext.token, {
        transContent: `Sell ${quantity} of ${equity.symbol}`,
        transType: 'plus',
        amount: totalPrice,
        balance: nBalance,
        user: userContext.userProfile.userId,
      })

      if (postTransRes.ok) {
        if (nAsset[existedAsset] - quantity === 0) {
          nAsset = nAsset.filter((stock) => stock.symbol !== equity.symbol)
        } else {
          nAsset[existedAsset].quantityHold -= quantity
        }

        userContext.setContext({
          ...userContext,
          accountBalance: nBalance,
          assetEquities: nAsset,
        })

        await updateUserPorfolio(userContext.token, {
          ...userContext,
          accountBalance: nBalance,
          assetEquities: nAsset,
          user: userContext.userProfile.userId,
        })

        setAssetList(nAsset)
      }
    }
  }

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
        transType: addAmount > 0 ? 'plus' : 'sub',
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
            onBuy={onBuyStock}
          />
          <InfoTitle>Your Assets</InfoTitle>
          <UserAssetBox
            assets={assetList}
            onBuy={onBuyStock}
            onSell={onSellStock}
          />
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
