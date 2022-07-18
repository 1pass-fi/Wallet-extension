import React from 'react'
import ReactTooltip from 'react-tooltip'

import UploadIcon from 'img/startup/upload.svg'
import ImportIcon from 'img/startup/import.svg'
import CreateIcon from 'img/startup/create.svg'
import QuestionIcon from 'img/startup/question-mark.svg'

import './index.css'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div className='start-up'>
      <div className='welcome-wrapper'>
        <div className='welcome'>
          <div className='title'>Welcome to the Finnie Wallet</div>

          <div className='get-started'>Let’s get started.</div>

          <div className='description'>
            <div>To use the Finnie Wallet, add a key.</div>
            <div>This can be one you already have or you can make a new one.</div>
          </div>

          <div className='actions'>
            <Link data-tip='New Key' to='/create-wallet' className='action'>
              <CreateIcon className='icon' />
              <div className='action-title'>Get a new key</div>
              <div className='action-description'>Start from the beginning.</div>
            </Link>

            <Link data-tip='.JSON file' to='/upload-wallet' className='action'>
              <UploadIcon className='icon' />
              <div className='action-title'>Upload a .JSON file</div>
              <div className='action-description'>
              Import an existing key by uploading a .JSON file.
              </div>
            </Link>

            <Link data-tip='Seed phrase' to='/import-wallet' className='action'>
              <ImportIcon className='icon' />
              <div style={{textAlign:'center',fontSize:'12px',padding:'5px 15px 0px 15px'}} className='action-title'>Import with a seed phrase or private key</div>
              <div style={{fontSize:'10px'}} className='action-description'>
              Import an existing key using a 12-word secret phrase or private key.
              </div>
            </Link>
          </div>

          <div className='question'>
            <QuestionIcon className='question-icon' />
            <div className='question-text'>
            If you received a wallet from the KOII or AR faucet, start here.
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}
