import React from 'react'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router-dom'
import { useParallax } from 'react-scroll-parallax'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import BackBtn from 'img/v2/popup-back-btn.svg'
import includes from 'lodash/includes'
import { fiatCurrencyFormat, numberFormat } from 'utils'

import Activity from './Activity'
import Assets from './Assets'
import Tokens from './Tokens'

const AccountInfo = ({ displayingAccount, currency, price, currentProviderAddress }) => {
  const history = useHistory()

  const tabs = [
    // { name: chrome.i18n.getMessage('assets'), to: '/assets' },
    { name: chrome.i18n.getMessage('tokens'), to: '/tokens' },
    { name: chrome.i18n.getMessage('activity'), to: '/activity' }
  ]

  const assetHeaderParallax = useParallax({
    translateX: [-100, 0],
    shouldAlwaysCompleteAnimation: true,
    startScroll: 0,
    endScroll: 161
  })

  const location = useLocation()

  return (
    <div>
      <div
        ref={assetHeaderParallax.ref}
        className={clsx(
          'z-20 w-full bg-white fixed top-13.5',
          includes(location.pathname, 'assets') ? 'h-15.25' : 'h-24'
        )}
      >
        <BackBtn
          onClick={() => history.goBack()}
          className="w-8.75 h-8.75 z-20 absolute top-3.25 left-3.75 cursor-pointer"
        />
        {!includes(location.pathname, 'assets') ? (
          <div className="h-full px-17.25 py-3">
            {displayingAccount.type === TYPE.SOLANA && (
              <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                {numberFormat(displayingAccount.balance / Math.pow(10, 9))} SOL
              </div>
            )}
            {displayingAccount.type === TYPE.K2 && (
              <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                {numberFormat(displayingAccount.balance / Math.pow(10, 9))} KOII
              </div>
            )}
            {displayingAccount.type === TYPE.ARWEAVE && (
              <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                {numberFormat(displayingAccount.balance)} AR
              </div>
            )}
            {displayingAccount.type === TYPE.ETHEREUM && (
              <div className="flex flex-col">
                <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                  {numberFormat(displayingAccount.balance)} ETH
                </div>
                <div
                  className="text-base leading-8 tracking-finnieSpacing-tight"
                  style={{ color: '#707070' }}
                >
                  {fiatCurrencyFormat(displayingAccount.balance * price.ETH)} {currency}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div
        className={clsx(
          'sticky shadow-lg h-10.75 z-40 flex items-stretch bg-trueGray-100 text-blue-600 text-base',
          includes(location.pathname, 'assets') ? 'top-15.25' : 'top-24'
        )}
      >
        {tabs.map((tab, idx) => (
          <NavLink
            key={idx}
            to={tab.to}
            className={clsx('w-1/3 h-10.75 flex items-center justify-center cursor-pointer')}
            activeClassName="font-semibold bg-lightBlue"
            data-testid={tab.name}
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
      <Switch>
        {/* <Route exact path="/assets">
          <Assets currentProviderAddress={currentProviderAddress} />
        </Route> */}
        <Route exact path="/activity">
          <Activity />
        </Route>
        <Route exact path="/tokens">
          <Tokens currentProviderAddress={currentProviderAddress} currency={currency} />
        </Route>
        <Redirect to="/tokens" />
      </Switch>
    </div>
  )
}

export default AccountInfo
