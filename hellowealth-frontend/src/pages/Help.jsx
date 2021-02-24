export const HelpPage = () => {
  return (
    <div className='flex flex-1 flex-col justify-center text-lg'>
      <h2 className='m-4 p-4 uppercase text-4xl'>Welcome</h2>
      <p className='p-4'>
        "We simply attempt to be fearful when others are greedy and to be greedy
        only when others are fearful." - Warren Buffett
      </p>
      <p className='p-4'>
        Buffett advises investors not to think of their investments as "stocks,"
        but to think of buying a stock as buying an entire business. "Never
        invest in a business you cannot understand."
      </p>
      <p className='p-4'>"Risk comes from not knowing what you're doing"</p>
    </div>
  )
}

HelpPage.defaultProps = {}

export default HelpPage
