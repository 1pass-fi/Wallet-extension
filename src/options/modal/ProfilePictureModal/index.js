import { GalleryContext } from 'options/galleryContext'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import './index.css'

export default () => {
  const history = useHistory()

  const { setShowProfilePictureModal } = useContext(GalleryContext)

  return (
    <div onClick={() => {history.push('/settings/k-id'); setShowProfilePictureModal(prev => !prev)}} className='profile-picture-modal'>
      Koii Identity (DID)
    </div>
  )
}
