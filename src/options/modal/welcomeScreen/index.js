import React from 'react'
import Modal from 'options/shared/modal'

import './index.css'

export default ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className='welcome-message'>
        <div className='title'>
          Finnie Wallet <span>v0.2.10 Notes</span>
        </div>
        <div className='content'>
          <div className='paragraph'>
          Decentralized Identities (DID) are here! Now you can link your different keys to one ID and create a personalized profile too. Each DID is an NFT stored on Arweave and it can be updated right from Finnie.
          </div>

          <div className='paragraph'>
          With your profile, you can add a profile photo (show off your coolest PFP) and a cover photo from your NFT collection. Add a description and any links you want, so people can follow you on social media or find your portfolio.
          </div>

          <div className='paragraph'>
          We fixed a bug that affected signing transactions and sending AR, so now Finnie should be compatible with other Arweave apps. You can now pause Finnie for a specific webpage if you need to for any reason. If you encounter a problem, please let us know with a <a style={{ color: '#49ce8b' }} href='https://koii.me/support'
              className='link'
              target='_blank'>bug report.</a>
          </div>
          <div className='paragraph'>
          We’re currently working on speeding up transaction times and giving Finnie a new look, so keep an eye out!
          </div>


          <div className='report-request paragraph'>
            Have a request? submit it <a
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
