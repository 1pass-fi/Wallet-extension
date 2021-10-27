import React from 'react'

import './index.css'
import Modal from 'options/shared/UploadMessageModal'

const HasTwelveSeedPhrase = ({ isSeedPhrase }) => {
  const invalidPhraseMsg = 'A Recovery Phrase has 12 words. Make sure you have all 12.'
  const invalidPrivateMsg = 'Invalid Private Key.'

  return (
    <div className='has-twelve-seedphrase-modal'>
      <div className='twelve-seedphrase-description'>
        {isSeedPhrase ? invalidPhraseMsg : invalidPrivateMsg}
      </div>
    </div>
  )
}

export default () => {
  return (
    <div>
      <HasTwelveSeedPhrase />
    </div>
  )
}
