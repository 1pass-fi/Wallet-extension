import React, { useMemo, useState } from 'react'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'

import BottomButton from './bottomButton'
import Header from './header'
import BodyContent from './bodyContent'
import { getFileType, NFT_TYPES } from './utils'

export default ({ file, onClearFile, onCloseUploadModal }) => {
  const [stage, setStage] = useState(1)
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')
  const url = useMemo(() => URL.createObjectURL(file), [file])
  const fileType = useMemo(() => getFileType(file), [file])
  const onGoBack = () => {
    if (stage != 1) {
      setStage(stage - 1)
    } else {
      onClearFile()
    }
  }

  return (
    <div className='upload-form'>
      <Header stage={stage} />

      <div className='nft-infomation'>
        <div className='left-column'>
          {fileType == NFT_TYPES.IMAGE && (
            <img src={url} className='nft-image' />
          )}
          {fileType == NFT_TYPES.VIDEO && (
            <video controls src={url} className='nft-image' />
          )}
          {fileType == NFT_TYPES.AUDIO && (
            <audio controls src={url} className='nft-image' />
          )}
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
        file={file}
        username={username}
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
