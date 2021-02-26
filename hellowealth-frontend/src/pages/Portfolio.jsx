import { useContext } from 'react'
import DashboardNavBar from '../components/DashboardNavBar'
import { UserContext } from '../services/context'
import { InfoTitle, Spacer } from '../styles/global.styles'

export const PortfolioPage = () => {
  const userContext = useContext(UserContext)
  return (
    <div className='w-full'>
      <DashboardNavBar />
      <div className='w-full p-6'>
        <InfoTitle>
          Howdy, {userContext.userProfile.firstName}! Your portfolio will be
          comming soon!
        </InfoTitle>
      </div>
      <Spacer height='3rem' />
    </div>
  )
}

PortfolioPage.defaultProps = {}

export default PortfolioPage
