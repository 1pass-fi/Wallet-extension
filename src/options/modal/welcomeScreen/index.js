import React from 'react'
import Modal from 'options/shared/modal'

import './index.css'

export default ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className='welcome-message'>
        <div className='title'>
          Finnie Wallet <span>v0.2.8 Notes</span>
        </div>
        <div className='content'>
          <div className='paragraph'>
            Welcome to Finnie, the best wallet for holding digital assets like
            NFTs.
          </div>

          <div className='paragraph'>
          The Ethereum bridge has arrived! We are so excited to announce that you can now transfer your Koii NFTs to any Ethereum marketplace, and transfer them back to your Finnie wallet to earn attention rewards via Proof of Real Traffic.
          </div>

          <div className='paragraph'>New features with this release:</div>
          Finnie can now hold multiple keys (e.g. two KOII wallets and two ETH wallets) and you can send NFTs to any other Arweave wallet. You will be able to view the NFTs from all your wallets right in the Gallery.
          <div className='paragraph'>
          Finnie also supports Dynamic NFTs like the Narcissus Flower.
          </div>
          <div className='paragraph'>
          Based on your feedback, we've made updates to speed up load times and fix bugs, and added usability improvements like hover tags on buttons.
          </div>


          <div className='report-request paragraph'>
            Have a feature? submit it <a
              href='https://koii.me/featurerequest'
              className='link'
              target='_blank'
            >here</a>
          </div>
        </div>
      </div>
    </Modal>
  )
}
