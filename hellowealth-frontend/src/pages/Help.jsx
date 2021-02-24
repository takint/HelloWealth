import { Link } from 'react-router-dom'
export const HelpPage = () => {
  return (
    <div className='flex flex-1 flex-col justify-center text-lg'>
      <Link to='/dashboard' className='self-start bg-gray-500 p-2 m-2 rounded'>
        Back to dashboard
      </Link>
      <h1 className='text-center text-4xl font-bold font-display'>
        Don't know which one to pick for your interested:
      </h1>
      <img alt='Stock List' src='static/stocklist.jpg' />
    </div>
  )
}

HelpPage.defaultProps = {}

export default HelpPage
