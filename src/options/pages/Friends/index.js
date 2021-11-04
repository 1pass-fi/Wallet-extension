import React, { useState, useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import BlockRewardIcon from 'img/block-reward-icon.svg'
import LinkIcon from 'img/link-icon.svg'
import EmailIcon from 'img/social-icons/email-icon.svg'
import FacebookIcon from 'img/social-icons/facebook-icon.svg'
import LinkedinIcon from 'img/social-icons/linkedin-icon.svg'
import TwitterIcon from 'img/social-icons/twitter-icon.svg'

import { GalleryContext } from 'options/galleryContext'

import { Web } from '@_koi/sdk/web'
export const koi = new Web()

import { shareFriendCode } from 'options/helpers'

import './index.css'
import { FRIEND_REFERRAL_ENDPOINTS, STATEMENT } from 'constants/koiConstants'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

export default () => {
  const { 
    affiliateCode, 
    account,
    setIsLoading, 
    setError, 
    setNotification, 
    totalReward } = useContext(GalleryContext)
  const [isCopied, setIsCopied] = useState(false)
  const code = affiliateCode

  const handleClaimReward = async () => {
    try {
      setIsLoading(true)
      if (account) {
        const { message, status } = await backgroundRequest.gallery.friendReferral({
          endpoints: FRIEND_REFERRAL_ENDPOINTS.CLAIM_REWARD
        })
  
        if (status != 200) {
          switch (message) {
            case `Affiliate Invites doesn't exists or already claimed`:
              setNotification(STATEMENT.NO_REWARD)
              break
            default:
              setNotification(message)
          }
        } else {
          console.log('RECEIVED KOII')
        }
      }
    } catch (err) {
      setError(err.message)
    }
    setIsLoading(false)
  }

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
            <button className='share-button' onClick={() => shareFriendCode(code, 'twitter')}>Share Code on Twitter</button>
            <button onClick={handleClaimReward} className='email-button'>Claim My Rewards</button>
          </div>
          <div className='social-media'>
            <TwitterIcon onClick={() => shareFriendCode(code, 'twitter')} className='social-icon' />
            <FacebookIcon onClick={() => shareFriendCode(code, 'facebook')} className='social-icon' />
            <LinkedinIcon onClick={() => shareFriendCode(code, 'linkedin')} className='social-icon' />
            <a href={`mailto:?subject=Use my Koii Friend Referral code&body=Use my code to get 1 free NFT upload on koi.rocks: \n${code}`} title="Share by Email">
              <EmailIcon className='social-icon' />
            </a>

          </div>
        </div>

        <div className='bottom-section'>
          <div className='reward-box'>
            <BlockRewardIcon className='reward-icon' />
            <div className='reward-text'>
              You’ve earned <span className='koi-quantity'>{totalReward} KOII</span> by
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
