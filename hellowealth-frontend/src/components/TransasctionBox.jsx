import { useEffect, useState } from 'react'
import moment from 'moment'
import LoadingSpinner from '../components/LoadingSpinner'
import { getUserTrans } from '../services/api'
import { currencyFormat } from '../services/helper'
import { InfoTitle, InfoBox, InfoRow } from '../styles/global.styles'

export const TransasctionBox = ({ token, newBalance }) => {
  const [loadingTrans, setLoadingTrans] = useState(false)
  const [userTransactions, setUserTransactions] = useState([])

  useEffect(() => {
    const loadUserData = async () => {
      setLoadingTrans(true)
      const transRes = await getUserTrans(token)

      if (transRes.ok) {
        delete transRes.ok
        delete transRes.statusCode

        setUserTransactions(transRes.reverse())
      }
      setLoadingTrans(false)
    }

    loadUserData()
  }, [token, newBalance])

  return (
    <div className='w-full px-4 py-1'>
      <InfoTitle>Your Transaction</InfoTitle>
      <InfoBox>
        {userTransactions.length > 0 && !loadingTrans ? (
          <div>
            <InfoRow>
              <strong>Trans. ID</strong>
              <strong>Date Time</strong>
              <strong>Transaction</strong>
              <strong>Amount</strong>
              <strong>Balance</strong>
            </InfoRow>
            {userTransactions.map((item, idx) => (
              <InfoRow key={idx}>
                <span>{item.id}</span>
                <span>
                  {moment(item.transDate).format('DD MMM YYYY - hh:mm A')}
                </span>
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
        ) : loadingTrans ? (
          <LoadingSpinner isShow />
        ) : (
          <p className='text-center'>No Transaction</p>
        )}
      </InfoBox>
    </div>
  )
}

TransasctionBox.defaultProps = {
  token: '',
  newBalance: 0,
}

export default TransasctionBox
