import React, { useState, useEffect } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import AccountInfo from './AccountInfo/AccountInfo'
import PopupBackground from 'img/popup/popup-background.svg'

import HomeTop from './HomeTop'

const Home = () => {
  const defaultArweaveAccount = useSelector((state) => state.defaultAccount.AR)
  const defaultEthereumAccount = useSelector((state) => state.defaultAccount.ETH)
  const price = useSelector((state) => state.price)

  const ref = React.useRef()
  const [scrollEl, setScrollElement] = React.useState(null)
  const [defaultAccount, setDefaultAccount] = useState({})

  useEffect(() => {
    if (!isEmpty(defaultArweaveAccount.address)) {
      setDefaultAccount(defaultArweaveAccount)
      return
    }
    if (!isEmpty(defaultEthereumAccount.address)) {
      setDefaultAccount(defaultEthereumAccount)
      return
    }
  }, [defaultArweaveAccount, defaultEthereumAccount])

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
          <HomeTop defaultAccount={defaultAccount} price={price} />
          <div style={{ width: '177px', height: '156px' }} className="absolute top-13.5 right-0">
            <PopupBackground />
          </div>
        </div>
        <AccountInfo defaultAccount={defaultAccount} price={price} />
      </ParallaxProvider>
    </div>
  )
}

export default Home
