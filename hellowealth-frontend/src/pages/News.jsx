export const NewsPage = () => {
  return (
    <div className='flex h-full justify-center p-8'>
      <a
        class='twitter-timeline'
        data-width='90%'
        data-height='100%'
        href='https://twitter.com/Nasdaq?ref_src=twsrc%5Etfw'
      >
        Tweets from NASDAQ
      </a>
    </div>
  )
}

export default NewsPage
