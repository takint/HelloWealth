import { useEffect, useState, useContext } from 'react'
import { Chart } from 'react-google-charts'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import LoadingSpinner from './LoadingSpinner'
import { currencyFormat } from '../services/helper'
import { getUserTrans } from '../services/api'
import { UserContext, initialUserContext } from '../services/context'
import { InfoBox, PriceBadge } from '../styles/global.styles'

export const UserBalanceBox = ({ token, accountBalance, assetList }) => {
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [balanceDataset, setBalanceDataset] = useState([])
  const [balanceChanged, setBalanceChanged] = useState(0)
  const [amountChanged, setAmountChanged] = useState(0)
  const [porfolioValue, setPorfolioValue] = useState(accountBalance)
  const numberFormat = new Intl.NumberFormat('en-CA')

  useEffect(() => {
    const loadUserData = async () => {
      setLoadingBalance(true)
      const transRes = await getUserTrans(token)
      const nBalanceDataset = [['Dates', 'Balance']]

      if (transRes.ok) {
        delete transRes.ok
        delete transRes.statusCode

        if (transRes.length === 0) {
          setLoadingBalance(false)
          return
        }

        let firstId = transRes[0].id
        let lastId = transRes[0].id

        transRes.forEach((trans) => {
          firstId = Math.min(firstId, trans.id)
          lastId = Math.max(lastId, trans.id)
          nBalanceDataset.push([
            moment(trans.transDate).format('DD MMM'),
            parseFloat(trans.balance),
          ])
        })

        let firstTrans = transRes.find((trans) => trans.id === firstId)
        let lastTrans = transRes.find((trans) => trans.id === lastId)

        let firstBalance = parseFloat(firstTrans.balance)
        let lastBalance = parseFloat(lastTrans.balance)

        let balanceFromStock = 0
        assetList.forEach((stock) => {
          let stockValue = stock.buyPrice * stock.quantityHold
          balanceFromStock += stockValue ? stockValue : 0
        })

        let diffAmount = lastBalance + balanceFromStock - firstBalance
        let newChanged =
          firstBalance !== 0 ? (diffAmount / firstBalance) * 100 : 0

        setAmountChanged(diffAmount)
        setBalanceChanged(newChanged)
        setPorfolioValue(firstBalance + diffAmount)
        setBalanceDataset(nBalanceDataset)
      } else if (transRes.statusCode === 401) {
        userContext.setContext(initialUserContext)
        history.push('/')
      }

      setLoadingBalance(false)
    }

    if (userContext.accountBalance !== 0) {
      loadUserData()
    }
  }, [token, assetList, history, userContext])

  return (
    <>
      <strong>Your porfolio value is:</strong>
      <br />
      <strong className='font-body text-4xl'>
        {loadingBalance ? 'calculating...' : currencyFormat(porfolioValue)}
      </strong>
      <p>
        Your're {balanceChanged < 0 ? 'losses' : 'profitting'}:
        <PriceBadge isDown={balanceChanged < 0}>
          {loadingBalance
            ? 'calculating...'
            : `${currencyFormat(amountChanged)} (${numberFormat.format(
                balanceChanged
              )}%)`}
        </PriceBadge>
      </p>
      <br />
      {balanceDataset.length > 0 && (
        <InfoBox>
          <Chart
            width={'100%'}
            height={'200px'}
            chartType='AreaChart'
            legendToggle={true}
            loader={<LoadingSpinner isShow />}
            data={balanceDataset}
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
      )}
    </>
  )
}

UserBalanceBox.defaultProps = {
  token: '',
  accountBalance: 0,
  assetList: [],
}

export default UserBalanceBox
