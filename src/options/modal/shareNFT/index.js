import React from 'react'
import Modal from 'options/shared/modal'

import './index.css'

import TwitterIcon from 'img/social/facebook-icon.svg'
import FacebookIcon from 'img/social/facebook-icon.svg'
import EmailIcon from 'img/social/email-icon.svg'
import LinkedInIcon from 'img/social/linkedin-icon.svg'

const TextBox = ({title, text, buttonText}) => {
  return (
    <div className='share-nft text-box'>
      <div className='share-nft text-box title'>{title}</div>
      <div className='share-nft text-box content'>
        <input className='share-nft text-box text' disabled value={text}/>
        <button className='share-nft text-box btn'>{buttonText}</button>
      </div>
    </div>
  )
}

const ShareNFT = () => {
  return (
    <div className='share-nft container'>
      <div className='share-nft title container'>
        Share to earn Attention Rewards
      </div>
      <div className='share-nft text-box container'>
        <TextBox text='https://permalinkgoeshere.com/whatever123456123' title='Share:' buttonText='get share link'/>
        <TextBox text='https://iframetoembedlink.com/whatever123456123' title='Embed:' buttonText='get embed link'/>
      </div>
      <div className='share-nft social-icon container'>
        <TwitterIcon />
        <FacebookIcon />
        <LinkedInIcon />
        <EmailIcon />
      </div>
    </div>
  )
}

export default ({ onClose }) => {
  return (
    <div>
      <Modal onClose={onClose}><ShareNFT /></Modal>
    </div>
  )
}
