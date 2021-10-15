import React from 'react'

import './index.css'
import Modal from 'options/shared/UploadMessageModal'

const HasTwelveSeedPhrase = () => {
  const invalidPhraseMsg = 'A Recovery Phrase has 12 words. Make sure you have all 12.'

  return (
    <div className='has-twelve-seedphrase-modal'>
      <div className='twelve-seedphrase-description'>
        {invalidPhraseMsg}
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
