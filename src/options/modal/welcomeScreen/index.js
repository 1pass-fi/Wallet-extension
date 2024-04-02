import React from 'react'
import Modal from 'options/shared/modal'

import './index.css'

export default ({ onClose }) => {
  return (
    <Modal onClose={onClose} isWelcomeScreen={true}>
      <div className="welcome-message">
        <div className="title">
          Finnie Wallet <span>v0.4. Notes</span>
        </div>
        <div className="content">
          <div className="paragraph">
            <span className="text-success">v0.5.0</span>
            <br></br>
            <div className='paragraph'>
              The latest version of Finnie is now compatible with K2, Koii’s new settlement layer, and Solana keys, and there have been many more upgrades behind the scenes. 
            </div>
            <div className='paragraph'>
              K2 has been running smoothly for a few months. Since the launch of K2, Finnie is faster than ever before. We are hard at work upgrading our entire system and Finnie has been working on those sprints right alongside. This means faster payments and fewer dropped transactions while using the Koii Network.
            </div>
            <div className='paragraph'>
              This means that Finnie is now compatible with 4 types of keys: K2 (KOII), ETH, SOL, and AR.
            </div>
            <div className='paragraph'>
              What about the existing KOII? Don’t worry! Your tokens will make the transition to K2, but only once the system is fully audited. In Finnie, the legacy tokens will be called KOII 1st Testnet. After the network has been audited, we will have a transition process where you can convert your tokens and NFTs to earn rewards through K2.            </div>
            <div className='paragraph'>
              Speaking of NFTs! K2 NFT creation is in the works. It’s a bit complicated but we are working to make it just as easy as the current version. You can still create Arweave NFTs from Finnie, but they will still require AR tokens to pay the storage fee.           
            </div>
            <div className='paragraph'>
            Try out the new version and see just how fast Finnie can swim! We always want to hear from you. Let us know what you like about the new Finnie
              <a 
                style={{ color: '#9BE7C4' }} 
                href="https://twitter.com/KoiiNetwork" 
                className="link" 
                target="_blank">
                {' '}on Twitter{' '}
              </a>
              {'(#Finnie)'} and if you find any issues, fill out a
              <a
                style={{ color: '#9BE7C4' }}
                href="https://share.hsforms.com/1Nmy8p6zWSN2J2skJn5EcOQc20dg"
                className="link"
                target="_blank"
              >
                {' '}bug report{' '}
              </a>
            so we can fix it ASAP. 
            </div>
          </div>
          <div className="paragraph">
            <span className="text-success">v0.4.9</span>
            <br></br>
            <div className='paragraph'>
              The latest version of Finnie is now compatible with K2, Koii’s new settlement layer, and Solana keys, and there have been many more upgrades behind the scenes. 
            </div>
            <div className='paragraph'>
              K2 has been running smoothly for a few months. Since the launch of K2, Finnie is faster than ever before. We are hard at work upgrading our entire system and Finnie has been working on those sprints right alongside. This means faster payments and fewer dropped transactions while using the Koii Network.
            </div>
            <div className='paragraph'>
              This means that Finnie is now compatible with 4 types of keys: K2 (KOII), ETH, SOL, and AR.
            </div>
            <div className='paragraph'>
              What about the existing KOII? Don’t worry! Your tokens will make the transition to K2, but only once the system is fully audited. In Finnie, the legacy tokens will be called KOII 1st Testnet. After the network has been audited, we will have a transition process where you can convert your tokens and NFTs to earn rewards through K2.            </div>
            <div className='paragraph'>
              Speaking of NFTs! K2 NFT creation is in the works. It’s a bit complicated but we are working to make it just as easy as the current version. You can still create Arweave NFTs from Finnie, but they will still require AR tokens to pay the storage fee.           
            </div>
          </div>
          <div className="paragraph">
            <span className="text-success">v0.3.4</span>
            <br></br>
            <div className='paragraph'>
              TL;DR: Like Metamask, but better. And Universal Crypto Addresses are here!
            </div>
            <div className='paragraph'>
              We are excited to announce that you can now send tokens to any Universal Crypto Address (like koiinetwork.wallet, for example) that is registered with{' '}
              <a
                style={{ color: '#9BE7C4' }}
                href="https://unstoppabledomains.com"
                className="link"
                target="_blank"
              >
              Unstoppable Domains
              </a>. Just type the site into the Address field when sending tokens and, voila, you don’t have to worry about mixing up address digits anymore.
            </div>
            <div className='paragraph'>
              In other news, let’s celebrate expanded Ethereum compatibility! With this new version, Finnie can sign any type of Ethereum transaction (if you find one that doesn’t work,{' '}
              <a
                style={{ color: '#9BE7C4' }}
                href="https://koii.me/support"
                className="link"
                target="_blank"
              >
              please let us know
              </a>
              {' '}so we can troubleshoot).
            </div>
            <div className='paragraph'>
              You can send, receive, and import existing or custom Ethereum sub-tokens and keep track of all your balances. To help our community stay safe in transacting, we are working on improved user experiences for signing transactions, so keep your eyes peeled for UX updates that are on the way. 
            </div>
            <div className='paragraph'>
              We have fixed a few small bugs related to notifications and the UI.
            </div>
          </div>
          <div className="paragraph">
            <span className="text-success">v0.3.1</span>
            <br></br>
            We fixed a few small bugs in the UI.
          </div>

          <div className="paragraph">
            <span className="text-success">v0.3.0</span>
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
              style={{ color: '#9BE7C4' }}
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
