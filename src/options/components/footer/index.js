import React from 'react'
import { useHistory } from 'react-router-dom'

import AddButton from 'img/add-button.svg'

import './index.css'

export default ({ showDropzone, inputFileRef }) => {
  const history = useHistory()
  return (
    <footer className='footer-wrapper'>
      <div className='footer-content'>
        <AddButton className='add-nft-button' onClick={() => {
          showDropzone()
          inputFileRef.current.click()
          history.push('/create')
        }} 
        />
        <div className='footer-text'>
          Drag & drop any file onto this page to create a new NFT
        </div>
      </div>
    </footer>
  )
}
