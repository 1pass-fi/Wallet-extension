import React from 'react'

import { Link } from 'react-router-dom'
import { useParallax } from 'react-scroll-parallax'

import FinnieIcon from 'img/popup/finnie-icon-blue.svg'
import SendIcon from 'img/popup/send-icon.svg'
import ReceiveIcon from 'img/popup/receive-icon.svg'
import { TYPE } from 'constants/accountConstants'
import { fiatCurrencyFormat, numberFormat } from 'utils'
import storage from 'services/storage'

const HomeTop = ({ displayingAccount, price }) => {
  const p = useParallax({
    translateX: [0, 100],
    shouldAlwaysCompleteAnimation: true,
    startScroll: 0,
    endScroll: 161
  })

  return (
    <div>
      <div ref={p.ref}>
        <FinnieIcon className="" style={{ width: '54px', height: '40px' }} />
        {displayingAccount.type !== TYPE.ETHEREUM && (
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
              {numberFormat(displayingAccount.koiBalance)} KOII
            </div>
            <div
              hidden
              className="text-base leading-8 tracking-finnieSpacing-tight"
              style={{ color: '#707070' }}
            >
              ${fiatCurrencyFormat(displayingAccount.koiBalance * price.KOI)} USD
            </div>
          </div>
        )}
        {displayingAccount.type === TYPE.ETHEREUM && (
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
              {numberFormat(displayingAccount.balance)} ETH
            </div>
            <div
              className="text-base leading-8 tracking-finnieSpacing-tight"
              style={{ color: '#707070' }}
            >
              ${fiatCurrencyFormat(displayingAccount.balance * price.ETH)} USD
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between" style={{ width: '140px' }}>
          <div className="flex flex-col items-center justify-center">
            <Link
              className="rounded-full bg-lightBlue shadow flex items-center justify-center cursor-pointer"
              style={{ width: '44px', height: '44px' }}
              to="/send"
            >
              <SendIcon style={{ width: '23px', height: '20px' }} />
            </Link>
            <div className="mt-2.25 text-center text-xs leading-3 tracking-finnieSpacing-wide">
              SEND
            </div>
            <button style={{backgroundColor: 'pink', borderRadius: '4px', marginTop: '5px'}} onClick={async () => {
              console.log('RUNNN')
              // change provider
              const mainnetProvider = 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
              await storage.setting.set.ethereumProvider(mainnetProvider)

              // reload all account
              

            }}>Change Provider</button>
            <button style={{backgroundColor: 'pink', marginTop:'5px', borderRadius: '4px'}} onClick={() => {

            }}>Change Chain</button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link
              className="rounded-full bg-lightBlue shadow flex items-center justify-center cursor-pointer"
              style={{ width: '44px', height: '44px' }}
              to="/receive"
            >
              <ReceiveIcon style={{ width: '23px', height: '20px' }} />
            </Link>
            <div className="mt-2.25 text-center text-xs leading-3 tracking-finnieSpacing-wide">
              RECEIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeTop
