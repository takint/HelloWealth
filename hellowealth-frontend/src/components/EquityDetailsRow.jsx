import { useState } from 'react'
import { Tooltip } from 'reactstrap'
import { isNullOrEmpty } from '../services/helper'

export const EquityDetailsRow = ({
  id,
  toolTips,
  label,
  value,
  format,
  shortFormat,
  color,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

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
      <strong id={id} className='cursor-pointer'>
        {label}
      </strong>
      <span className={`font-display ${color}`}>
        {formatter.format(value)}
        {!isNullOrEmpty(shortFormat) && ` (${shortFormat}) `}
      </span>
      {id && toolTips && (
        <Tooltip
          popperClassName='mx-2 px-2 font-display bg-green bg-opacity-80 text-white rounded'
          placement='right'
          isOpen={tooltipOpen}
          target={id}
          toggle={toggle}
        >
          {toolTips}
        </Tooltip>
      )}
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
