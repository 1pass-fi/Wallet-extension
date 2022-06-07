import React, { useEffect, useState } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import AccountInfo from './AccountInfo/AccountInfo'
import PopupBackground from 'img/popup/popup-background.svg'
import PopupArrow from 'img/popup/popup-arrow-icon.svg'
import FinnieIcon from 'img/popup/finnie-icon-blue.svg'

import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

import HomeTop from './HomeTop'
import { TYPE } from 'constants/accountConstants'

const Home = () => {
  const [currentProviderAddress, setCurrentProviderAddress] = useState()
  const [currentSolanaProviderAddress, setCurrentSolanaProviderAddress] = useState()
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
      {isEmpty(displayingAccount?.address) ? (
        <div>
          <PopupArrow className="absolute" style={{ top: '67px', left: '30px' }} />
          <PopupBackground
            style={{ width: '177px', height: '156px' }}
            className="absolute top-13.5 right-0 z-10"
          />
          <div
            style={{ width: '300px' }}
            className="font-normal text-2xl tracking-finnieSpacing-tight ml-5 mt-40 text-blue-800"
          >
            Select an account to see a summary.
          </div>
          <FinnieIcon className="ml-5 mt-8" style={{ width: '54px', height: '40px' }} />
        </div>
      ) : (
        <ParallaxProvider scrollContainer={scrollEl}>
          <div className="pt-4.75 pl-4.75 mb-3.5">
            <HomeTop
              displayingAccount={displayingAccount}
              price={price}
              currentProviderAddress={currentProviderAddress}
              setCurrentProviderAddress={setCurrentProviderAddress}
            />
            <PopupBackground
              style={{ width: '177px', height: '156px' }}
              className="absolute top-13.5 right-0 z-10"
            />
          </div>
          <AccountInfo
            displayingAccount={displayingAccount}
            price={price}
            currentProviderAddress={currentProviderAddress}
          />
        </ParallaxProvider>
      )}
    </div>
  )
}

export default Home
