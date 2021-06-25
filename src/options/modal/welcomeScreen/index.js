import React from 'react'
import Modal from 'options/shared/modal'

import './index.css'

export default () => {
  return (
    <Modal>
      <div className='welcome-message'>
        <div className='title'>Welcome! A few notes:</div>
        <div className='content'>
          Collections will launch soon and will allow you to have your own personalized page. For now, all items will appear on koi.rocks so that you can share them with friends and fans.
          <br></br>
          <br></br>
          The wallet currently supports 'Import from Opensea' and 'Drag and Drop' so you can archive your NFTs and content permanently. You will start earning KOII whenever they are viewed.
          <br></br>
          <br></br>
          We are building bridges to a number of major blockchains to make it possible to list these NFTs anywhere and will be working towards lazy-minting. That way, you will only need to pay a small fee on Arweave ($0.01) to be able to sell your work on any exchange.
          <br></br>
          <br></br>
          Thanks for being a part of this wonderful community!
        </div>
      </div>
    </Modal>
  )
}
