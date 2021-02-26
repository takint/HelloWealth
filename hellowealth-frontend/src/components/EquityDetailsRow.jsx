import { isNullOrEmpty } from '../services/helper'

export const EquityDetailsRow = ({
  label,
  value,
  format,
  shortFormat,
  color,
}) => {
  let formatter = new Intl.NumberFormat('en-US', {
    style: format,
    currency: 'USD',
  })

  switch (format) {
    case 'percent':
      formatter = new Intl.NumberFormat('en-US', {
        style: format,
      })
      break
    default:
      break
  }

  return (
    <div className='flex border-b flex-auto flex-row justify-between m-1 p-2 lg:w-2/5'>
      <strong>{label}</strong>
      <span className={`font-display ${color}`}>
        {formatter.format(value)}
        {!isNullOrEmpty(shortFormat) && ` (${shortFormat}) `}
      </span>
    </div>
  )
}

EquityDetailsRow.defaultProps = {
  label: 'field',
  value: 0,
  format: 'currency',
  shortFormat: '',
  color: '',
}

export default EquityDetailsRow
