import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import BlockRewardIcon from 'img/block-reward-icon.svg'
import LinkIcon from 'img/link-icon.svg'
import EmailIcon from 'img/social-icons/email-icon.svg'
import FacebookIcon from 'img/social-icons/facebook-icon.svg'
import LinkedinIcon from 'img/social-icons/linkedin-icon.svg'
import TwitterIcon from 'img/social-icons/twitter-icon.svg'

import './index.css'

export default () => {
  const [isCopied, setIsCopied] = useState(false)
  const code = 'ABCD-1234'
  return (
    <div className='friends-page-wrapper'>
      <div className='friends-page'>
        <div className='top-section'>
          <div className='title'>Give a little, get a little</div>
          <div className='description'>
            Invite friends to use the Koii browser extension. You’ll get 1 KOII
            free for each friend who registers an NFT with your code and they’ll
            get 1 KOII free, too.
          </div>
        </div>

        <div className='content-section'>
          <div className='code-label'>Your code is</div>
          <div className='code-text'>
            <span>{code}</span>
            <LinkIcon className='link-icon' />
          </div>
          <CopyToClipboard text={code}>
            <div
              onClick={() => setIsCopied(true)}
              disabled={isCopied}
              className={`copy-button ${isCopied ? 'copied' : ''}`}
            >
              {isCopied ? 'Link copied!' : 'click to copy'}
            </div>
          </CopyToClipboard>
          <div className='share'>
            <button className='share-button'>Share Code on Twitter</button>
            <button className='email-button'>Email My Code</button>
          </div>
          <div className='social-media'>
            <TwitterIcon className='social-icon' />
            <FacebookIcon className='social-icon' />
            <LinkedinIcon className='social-icon' />
            <EmailIcon className='social-icon' />
          </div>
        </div>

        <div className='bottom-section'>
          <div className='reward-box'>
            <BlockRewardIcon className='reward-icon' />
            <div className='reward-text'>
              You’ve earned <span className='koi-quantity'>8 KOII</span> by
              using your referral code.
              <br />
              <strong> Keep sharing for free KOII.</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
