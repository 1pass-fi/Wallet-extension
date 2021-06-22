import React from 'react'

import AddButton from 'img/add-button.svg'

import './index.css'

export default ({ showDropzone }) => {
  return (
    <footer className='footer-wrapper'>
      <div className='footer-content'>
        <AddButton className='add-nft-button' onClick={showDropzone} />
        <div className='footer-text'>
          Drag & drop any file onto this page to create a new NFT
        </div>
      </div>
    </footer>
  )
}
