import { useState } from 'react'
import { Tooltip } from 'reactstrap'
import { currencyFormat } from '../services/helper'
import { PriceBadge } from '../styles/global.styles'

const DisplayPriceLabel = ({
  id,
  priceType,
  toolTips,
  equityPrice,
  priceChange,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)
  const numberFormat = new Intl.NumberFormat('en-CA')

  return (
    <>
      <span className='cursor-default' id={id}>
        {`${priceType}: `}
      </span>
      <Tooltip
        popperClassName='my-2 px-2 font-display bg-gray-600 bg-opacity-80 text-white rounded'
        placement='bottom'
        isOpen={tooltipOpen}
        target={id}
        toggle={toggle}
      >
        {toolTips}
      </Tooltip>
      {equityPrice && priceChange && (
        <PriceBadge isDown={priceChange <= 0}>
          {`${currencyFormat(equityPrice)} (${numberFormat.format(
            priceChange
          )} %)`}
        </PriceBadge>
      )}
    </>
  )
}

DisplayPriceLabel.defaultProps = {
  priceType: '',
  toolTips: '',
}

export default DisplayPriceLabel
