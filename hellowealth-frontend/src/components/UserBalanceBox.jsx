import { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import LoadingSpinner from './LoadingSpinner'
import { currencyFormat } from '../services/helper'
import { getUserTrans } from '../services/api'
import { InfoBox, PriceBadge } from '../styles/global.styles'

export const UserBalanceBox = ({ token, accountBalance }) => {
  const [loadingBalance, setLoadingBalance] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      setLoadingBalance(true)
      const transRes = await getUserTrans(token)

      if (transRes.ok) {
        delete transRes.ok
        delete transRes.statusCode
      }
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
        Your're profitting:
        <PriceBadge>
          {loadingBalance
            ? 'calculating...'
            : `${currencyFormat(10.0)} (${1.2}%)`}
        </PriceBadge>
      </p>
      <br />
      <InfoBox>
        {loadingBalance ? (
          <LoadingSpinner isShow />
        ) : (
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
        )}
      </InfoBox>
    </>
  )
}

UserBalanceBox.defaultProps = {
  token: '',
  accountBalance: 0,
}

export default UserBalanceBox
