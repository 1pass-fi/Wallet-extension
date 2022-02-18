import React from 'react'
import Modal from 'options/shared/modal'

import './index.css'

export default ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className="welcome-message">
        <div className="title">
          Finnie Wallet <span>v0.3.2 Notes</span>
        </div>
        <div className="content">
          <div className="paragraph">
            <span className="text-success-900">v0.3.2</span>
            <br></br>
            We fixed a few small bugs in the UI.
          </div>
          <div className="paragraph">
            <span className="text-success-900">v0.3.1</span>
            <br></br>
            We fixed a few small bugs in the UI.
          </div>

          <div className="paragraph">
            <span className="text-success-900">v0.3.0</span>
            <br></br>A new look, batch uploads, and customized Decentralized ID profile pages.
          </div>

          <div className="paragraph">
            Finnie just got a new look, and some wonderful new features to go along with the new
            outfit. This is the first time Finnie's style has been upgraded since it first came out
            and we are excited to share the new interface with you.
          </div>

          <div className="paragraph">
            We've reorganized the pages to make it easier to interact with each section, and now you
            can create NFTs directly from your Gallery. You still have the great option to drag and
            drop files directly from your device.
          </div>

          <div className="paragraph">
            In addition to NFT creation, we added a "Create Collection" feature where you can create
            multiple NFTs in a single interaction (aka batch uploads). We hope this will help
            artists everywhere spend more time making art and less time minting NFTs.
          </div>

          <div className="paragraph">
            The other very exciting new feature released with v0.3 is Decentralized IDs and
            customized profile pages to show them off. Now you can link your different keys to one
            ID. With your profile, you can add a profile photo (show off your coolest PFP) and a
            cover photo from your NFT collection. Add a description and any links you want, so
            people can follow you on social media or find your portfolio. You get a personalized
            link for sharing too! Each DID is an NFT stored on Arweave and it can be updated right
            from Finnie.
          </div>

          <div className="paragraph">
            We fixed a bug that affected signing transactions and sending AR, so now Finnie should
            be compatible with other Arweave apps. You can now pause Finnie for a specific webpage
            if you need to for any reason. If you encounter a problem, please let us know with a{' '}
            <a
              style={{ color: '#49ce8b' }}
              href="https://koii.me/support"
              className="link"
              target="_blank"
            >
              bug report.
            </a>
          </div>
          <div className="paragraph">
            We will be continuing to improve this new version, so keep an eye out.
          </div>

          <div className="report-request paragraph">
            Have a feature request? Submit it{' '}
            <a href="https://koii.me/featurerequest" className="link" target="_blank">
              here
            </a>
          </div>
        </div>
      </div>
    </Modal>
  )
}
