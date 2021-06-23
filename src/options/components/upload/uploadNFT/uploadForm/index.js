import React, { useMemo, useState, useContext } from 'react'
import { trim } from 'lodash'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'

import BottomButton from './bottomButton'
import Header from './header'
import BodyContent from './bodyContent'
import { getFileType, NFT_TYPES } from './utils'
import './index.css'

import { UploadContext } from '../../index'
import { GalleryContext } from 'options/galleryContext'

const Tag = ({ tag, stage }) => {
  const { tags, setTags } = useContext(UploadContext)

  const removeTag = (e) => {
    const newTags = tags.filter(tag => tag !== e.target.textContent)
    setTags(newTags)
  }

  return (
    <div onClick={removeTag} className={stage === 2 ? 'tag stage2' : 'tag'}>{tag}</div>
  )
}

export default () => {
  const {
    file,
    onClearFile,
    onCloseUploadModal,
  } = useContext(GalleryContext)
  const { tags, setTags } = useContext(UploadContext)
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
      setTags([])
    }
  }

  return (
    <div className='upload-form'>
      <Header stage={stage} />

      <div className={stage === 2 ? 'nft-infomation stage2' : 'nft-infomation'}>
        <div className={ stage === 2 ? 'left-column stage2' : 'left-column'}>
          <div className='picture'>
            {fileType == NFT_TYPES.IMAGE && (
              <img src={url} className='nft-image' />
            )}
            {fileType == NFT_TYPES.VIDEO && (
              <video controls src={url} className='nft-image' />
            )}
            {fileType == NFT_TYPES.AUDIO && (
              <audio controls src={url} className='nft-image' />
            )}
            {
              stage === 2 &&
                <div className='nft-preview-infomation'>
                  <div className='preview-info'>{title}</div>
                  <div className='preview-info'>{username}</div>
                  <div className='preview-info description'>{description}</div>
                  <div className='tags stage2'>
                    {tags.map((tag, index) => <Tag key={index} tag={tag} stage={stage}/>)}
                  </div>
                </div>
            }
          </div>
          {
            stage === 1 &&
              <div className='tags'>
                {tags.map((tag, index) => <Tag key={index} tag={tag} stage={stage}/>)}
              </div>
          }
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
      <div className='close-button' onClick={() => {
        setTags([])
        onCloseUploadModal()
      }}>
        <CloseIcon />
      </div>
      <div className='goback-button' onClick={onGoBack}>
        <GoBackIcon />
      </div>
    </div>
  )
}
