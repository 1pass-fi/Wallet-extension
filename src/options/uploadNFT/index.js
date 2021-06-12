import React, { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import UploadNFTIcon from 'img/uploadNFT-icon.svg'
import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'

import './index.css'

const DragActive = ({ className = '' }) => {
  return (
    <div className={className + ' drag-active'}>
      <div className='description'>
        <div className='description-title'>Create an Atomic NFT</div>
        <div className='description-detail'>
          Drop your file here to store it forever and start earning attention
          rewards.
        </div>
        <UploadNFTIcon className='upload-nft-icon' />
      </div>
    </div>
  )
}

const UploadFormHeader = ({ stage }) => {
  if (stage != 3)
    return (
      <>
        <div className='description-title'>Create an Atomic NFT</div>
        <div className='description-detail'>
          Drop your file here to store it forever and start earning attention
          rewards.
        </div>
      </>
    )

  return (
    <>
      <div className='description-title'>
        Congratulations! Your new NFT is ready for action
      </div>
      <div className='description-detail'>
        Share your newly minted NFT with everyone you know to start earning
        attention rewards.
      </div>
    </>
  )
}

const BodyContent = ({
  stage,
  title,
  description,
  username,
  setDescription,
  setTitle,
  setUsername,
}) => {
  if (stage == 1) {
    return (
      <div className='right-column stage1'>
        <div className='field'>
          <label className='field-label'>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='field-input'
          ></input>
        </div>
        <div className='field'>
          <label className='field-label'>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='field-input'
          ></input>
        </div>
        <div className='field'>
          <label className='field-label'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='field-input'
          />
        </div>
      </div>
    )
  }

  if (stage == 2) {
    return (
      <div className='right-column stage2'>
        <div className='ntf-preview-infomation'>
          <div className='preview-info'>{title}</div>
          <div className='preview-info'>{username}</div>
          <div className='preview-info'>{description}</div>
        </div>
        <div className='estimate-cost'>
          <div className='estimate-cost-title'>Estimated Costs</div>
          <div className='estimate-ar'>0.0002 AR</div>
          <div className='estimate-koi'>1.00 KOI</div>
        </div>
      </div>
    )
  }

  return (
    <div className='right-column stage3'>
      <div className='preview-info'>{title}</div>
      <div className='preview-info'>{username}</div>
    </div>
  )
}

const BottomButton = ({ description, setStage, stage, title }) => {
  if (stage == 1) {
    return (
      <button
        className='create-ntf-button'
        onClick={() => setStage(2)}
        disabled={isEmpty(title) | isEmpty(description)}
      >
        Create New NFT
      </button>
    )
  }

  if (stage == 2) {
    return (
      <button className='create-ntf-button' onClick={() => setStage(3)}>
        Confirm Registration
      </button>
    )
  }

  return (
    <CopyToClipboard text='https://koi.registerlink.example'>
      <button className='create-ntf-button'>Confirm Registration</button>
    </CopyToClipboard>
  )
}

const UploadForm = ({ file, onClearFile, onCloseUploadModal }) => {
  const [stage, setStage] = useState(1)
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')
  const url = useMemo(() => URL.createObjectURL(file), [file])
  const onGoBack = () => {
    if (stage != 1) {
      setStage(stage - 1)
    } else {
      onClearFile()
    }
  }
  
  return (
    <div className='upload-form'>
      <UploadFormHeader stage={stage} />

      <div className='nft-infomation'>
        <div className='left-column'>
          <img src={url} className='nft-image' />
        </div>
        <BodyContent
          stage={stage}
          title={title}
          setTitle={setTitle}
          username={username}
          setUsername={setUsername}
          description={description}
          setDescription={setDescription}
          username={username}
        />
      </div>
      <BottomButton
        stage={stage}
        setStage={setStage}
        title={title}
        description={description}
      />
      <div className='close-button' onClick={onCloseUploadModal}>
        <CloseIcon />
      </div>
      <div className='goback-button' onClick={onGoBack}>
        <GoBackIcon />
      </div>
    </div>
  )
}

export default ({ file, isDragging, onClearFile, onCloseUploadModal }) => {
  console.log({ isDragging })
  if (!isDragging) {
    return <div></div>
  }

  return (
    <div className='uploadNFT-wrapper'>
      <div className={`uploadNFT`}>
        {isEmpty(file) ? (
          <DragActive />
        ) : (
          <UploadForm
            file={file}
            onClearFile={onClearFile}
            onCloseUploadModal={onCloseUploadModal}
          />
        )}
      </div>
    </div>
  )
}
