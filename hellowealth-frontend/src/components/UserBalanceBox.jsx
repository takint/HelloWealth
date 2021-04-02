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
  const numberFormat = new Intl.NumberFormat('en-CA')

  useEffect(() => {
    const loadUserData = async () => {
      setLoadingBalance(true)
      const transRes = await getUserTrans(token)
      const nBalanceDataset = [['Dates', 'Balance']]

      if (transRes.ok) {
        delete transRes.ok
        delete transRes.statusCode

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
        let diffAmount = lastTrans.balance - firstTrans.balance
        let newChanged = diffAmount / firstTrans.balance

        setAmountChanged(diffAmount)
        setBalanceChanged(newChanged)
      } else if (transRes.statusCode === 401) {
        userContext.setContext(initialUserContext)
        history.push('/')
      }

      setBalanceDataset(nBalanceDataset)
      setLoadingBalance(false)
    }

    loadUserData()
  }, [token, accountBalance])

  return (
    <>
      <strong>Your porfolio value is:</strong>
      <br />
      <strong className='font-body text-4xl'>
        {currencyFormat(accountBalance)}
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
    </>
  )
}

UserBalanceBox.defaultProps = {
  token: '',
  accountBalance: 0,
  assetList: [],
}

export default UserBalanceBox
