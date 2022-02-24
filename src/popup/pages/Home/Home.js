import React, { useEffect } from 'react'

import AccountInfo from './AccountInfo/AccountInfo'
import PopupBackground from 'img/popup/popup-background.svg'
import { ParallaxProvider } from 'react-scroll-parallax'
import HomeTop from './HomeTop'
const Home = () => {
  const [scrollEl, setScrollElement] = React.useState(null)
  const ref = React.useRef()

  useEffect(() => {
    setScrollElement(ref.current)
  }, [])

  return (
    <div
      className="flex flex-col w-full overflow-x-hidden"
      style={{ overflowY: 'overlay' }}
      ref={ref}
    >
      <ParallaxProvider scrollContainer={scrollEl}>
        <div className="pt-4.75 pl-4.75 mb-3.5">
          <HomeTop />
          <PopupBackground className="absolute top-13.5 right-0 z-30" />
        </div>
        <AccountInfo />
      </ParallaxProvider>
    </div>
  )
}

export default Home
