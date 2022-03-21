import React, { useEffect, useState } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import AccountInfo from './AccountInfo/AccountInfo'
import PopupBackground from 'img/popup/popup-background.svg'

import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

import HomeTop from './HomeTop'

const Home = () => {
  const [currentProviderAddress, setCurrentProviderAddress] = useState({})
  const displayingAccount = useSelector(getDisplayingAccount)

  const price = useSelector((state) => state.price)

  const ref = React.useRef()
  const [scrollEl, setScrollElement] = React.useState(null)

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
          <HomeTop
            displayingAccount={displayingAccount}
            price={price}
            currentProviderAddress={currentProviderAddress}
            setCurrentProviderAddress={setCurrentProviderAddress}
          />
          <div style={{ width: '177px', height: '156px' }} className="absolute top-13.5 right-0">
            <PopupBackground />
          </div>
        </div>
        <AccountInfo
          displayingAccount={displayingAccount}
          price={price}
          currentProviderAddress={currentProviderAddress}
        />
      </ParallaxProvider>
    </div>
  )
}

export default Home
