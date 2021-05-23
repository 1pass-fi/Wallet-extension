import React from 'react'

import ArweaveIcon from 'img/alternative-wallet-icon.svg'
import KoiIcon from 'img/koi-logo-no-bg.svg'
import Card from 'shared/card'
import Button from 'shared/button'

import './index.css'

export default ({ sourceAccount, destinationAccount }) => {
  const walletIcon = {
    koi: <KoiIcon className='icon' />,
    arweave: <ArweaveIcon />,
  }
  return (
    <div className='sign-tx'>
      <div className='account-section'>
        <div className='source-account account'>
          {walletIcon[sourceAccount.type]}
          <div className='account-info'>
            <div className='title'>{sourceAccount.title}</div>
            <div className='address'>
              {sourceAccount.address.substring(0, 6)}...
              {sourceAccount.address.substring(38, 43)}
            </div>
          </div>
        </div>
        <div className='divider'>
          <div className='arrow' />
        </div>
        <div className='destination-account account'>
          {walletIcon[destinationAccount.type]}
          <div className='account-info'>
            <div className='address'>
              {destinationAccount.address.substring(0, 6)}...
              {destinationAccount.address.substring(38, 43)}
            </div>
          </div>
        </div>
      </div>
      <div className='content-section'>
        <Card className='transaction-detail'>
          <div>Transaction detail</div>
          <div className='button-group'>
            <Button label='Confirm' />
            <Button label='Reject' type='layout' className='reject-button' />
          </div>
        </Card>
      </div>
    </div>
  )
}
