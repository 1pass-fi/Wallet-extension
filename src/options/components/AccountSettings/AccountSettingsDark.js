import React from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import AboutIcon from 'img/v2/sidebar/about-icon.svg'
import SecurityIcon from 'img/v2/sidebar/lock-icon.svg'
import NeedhelpIcon from 'img/v2/sidebar/need-help-icon.svg'
import WalletIcon from 'img/v2/sidebar/wallet-icon.svg'
import ToolTip from 'options/components/ToolTip'

const accountSettingItems = [
  { text: chrome.i18n.getMessage('walletSettings'), path: '/settings/wallet', icon: WalletIcon },
  { text: chrome.i18n.getMessage('security'), path: '/settings/security', icon: SecurityIcon },
  { text: chrome.i18n.getMessage('about'), path: '/settings/about', icon: AboutIcon },
  { text: chrome.i18n.getMessage('needHelp'), path: '/settings/need-help', icon: NeedhelpIcon }
]

const AccountSettingsDark = React.forwardRef(({ className }, ref) => {
  return (
    <div
      ref={ref}
      style={{backgroundColor: '#373570'}}
      className={clsx(
        'z-50 flex flex-col w-58.5 xl: 2xl: 3xl:w-64 text-white px-2 justify-evenly',
        'font-semibold text-sm xl: 2xl: 3xl:text-base rounded',
        className
      )}
    >
      {accountSettingItems.map(({ text, path, disabled, icon: Icon }, idx) =>
        disabled ? (
          <>
            <div
              style={{
                borderBottom: '1px solid rgba(137, 137, 199, 0.5)'
              }}
              className={clsx(
                'h-9.75 xl: 2xl: 3xl:h-11 text-trueGray-500 cursor-default flex items-center',
              )}
              data-tip={chrome.i18n.getMessage('featureUnderConstruction')}
              data-for="did-coming-soon"
            >
              <div className='flex flex-row items-center'>
                <div className='w-7 flex items-center justify-left'><Icon/></div>
                <div className='ml-4'>{text}</div>
              </div>
            </div>
            <ToolTip id="did-coming-soon" />
          </>
        ) : (
          <NavLink
            key={path}
            to={path}
            style={{
              borderBottom: '1px solid rgba(137, 137, 199, 0.5)'
            }}
            className={clsx(
              'h-11 xl: 2xl: 3xl:h-11 flex items-center pl-2',
            )}
          >
            <div className='flex flex-row items-center'>
              <div className='w-7 flex items-center justify-center'><Icon/></div>
              <div className='ml-4'>{text}</div>
            </div>
          </NavLink>
        )
      )}
    </div>
  )
})

export default AccountSettingsDark
