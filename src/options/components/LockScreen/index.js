import React from 'react'
import KoiIcon from 'img/finnie-koi-logo-white.svg'
import Button from 'shared/button'

import './index.css'

export default () => {
  return (
    <div className='app-content'>
      <KoiIcon className="startup-logo" />
      <div className='lock-Screen'>
        <div className='unlock-message'>{chrome.i18n.getMessage('UnlockFinnie')}</div>
        {/* <div className='unlock-message'>Unlock Finnie to view your gallery or create a new NFT</div> */}
        {/* <Button className='unlock-button' label={'Unlock Finnie'} /> */}
      </div>
    </div>
  )
}
