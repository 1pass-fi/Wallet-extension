import React from 'react'
import Modal from 'options/shared/modal'

import './index.css'

export default ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className='welcome-message'>
        <div className='title'>
          Finnie Wallet <span>v0.2.0 Notes</span>
        </div>
        <div className='content'>
          <div className='paragraph'>
            Welcome to Finnie, the best wallet for holding digital assets like
            NFTs.
          </div>

          <div className='paragraph'>
            The wallet currently supports 'Drag and Drop' to archive your
            content permanently on Arweave. You will start earning KOII whenever
            they are viewed. Creating NFTs takes less than one minute and costs
            less than $00.01. Check out our tutorial here if it’s your first
            time creating with Finnie.
          </div>

          <div className='paragraph'>New features with this release:</div>
          <ul className='paragraph'>
            <li className='list-item'>
              Create and update collections from media in my gallery
            </li>
            <li className='list-item'>Search my gallery</li>
            <li className='list-item'>
              Create a Koii decentralized identity (kID). Finnie will use your
              kID to connect keys & wallets across chains (coming soon)
            </li>
            <li className='list-item'>
              Invite a Friend referral codes (earn up to 5 KOII for friends who
              use Finnie to upload an NFT)
            </li>
          </ul>

          <div className='paragraph'>What we’re currently working on:</div>
          <ul className='paragraph'>
            <li className='list-item'>
              Ethereum bridge: soon Finnie will be able to hold Arweave/Koii AND
              Ethereum keys, which means media from OpenSea can be imported to
              Arweave (store it forever, no rug pulls!) or Atomic NFTs can be
              sold on Ethereum-based platforms
            </li>
            <li className='list-item'>
              Direct buying & selling on Koii with 0% commissions (yeah, you
              read that correctly. NO commissions)
            </li>
            <li className='list-item'>Make an offer to buy an NFT</li>
            <li className='list-item'>Customizable Galleries</li>
            <li className='list-item'>
              Verification badges: make sure the artist you’re buying from is
              the real deal
            </li>
            <li className='list-item'>
              Curated collection (collections with pieces that are owned by
              multiple people
            </li>
          </ul>

          <div className='report-request paragraph'>
            <a
              href='https://docs.google.com/forms/d/1AUecQDPLSkq9TTbDetjj7L61azuQY6JU43fX6FCqtaQ/'
              className='link'
              target='_blank'
            >
              Report
            </a>
            &nbsp;a bug or &nbsp;
            <a
              href='https://docs.google.com/forms/d/13nYOjTOlnjXnFAxf-fuNXvyTL5bEUQC27sR7VI-z_zE/'
              className='link'
              target='_blank'
            >
              request
            </a>
            &nbsp; a feature.
          </div>
        </div>
      </div>
    </Modal>
  )
}
