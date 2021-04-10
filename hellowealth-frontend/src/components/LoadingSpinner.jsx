import { SpinnerWrap, Spinner } from '../styles/global.styles'

export const LoadingSpinner = ({ isShow }) => {
  return (
    isShow && (
      <SpinnerWrap>
        <Spinner className='ease-linear' />
      </SpinnerWrap>
    )
  )
}

LoadingSpinner.defaultProps = {
  isShow: false,
}

export default LoadingSpinner
