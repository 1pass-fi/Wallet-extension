import React, { useMemo, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { trim } from 'lodash'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'

import BottomButton from './bottomButton'
import Header from './header'
import BodyContent from './bodyContent'
import { getFileType, NFT_TYPES } from './utils'
import './index.css'

import BigCard from '../../bigNFTCard'
import { UploadContext } from '../../index'
import { GalleryContext } from 'options/galleryContext'
import { PATH } from 'constants/koiConstants'
import { stringTruncate } from '../../../../utils'

import ReactTooltip from 'react-tooltip'

const Tag = ({ tag, stage }) => {
  const { tags, setTags } = useContext(UploadContext)

  const removeTag = (e) => {
    const newTags = tags.filter((aTag) => aTag !== tag)
    setTags(newTags)
  }

  return (
    <div onClick={removeTag} className={stage === 2 ? 'tag stage2' : 'tag'}>
      {stringTruncate(tag, 15)}
    </div>
  )
}

export default ({ stage, setStage }) => {
  const history = useHistory()
  const { file, setFile, onClearFile, onCloseUploadModal } = useContext(
    GalleryContext
  )
  const { tags, setTags, transactionId, createdAt, contentType } = useContext(UploadContext)
  // const [stage, setStage] = useState(1)
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

  const handleRegisterMore = () => {
    setFile({})
    setTags([])
    setTitle('')
    setUsername('')
    setDescription('')
    setStage(1)
  }

  const handleGoToGallery = () => {
    history.push('/')
    setFile({})
  }

  return (
    <div>
      {stage !== 3 ? (
        <div className='upload-form'>
          <Header stage={stage} />
          <div
            className={stage === 2 ? 'nft-infomation stage2' : 'nft-infomation'}
          >
            <div className={stage === 2 ? 'left-column stage2' : 'left-column'}>
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
              </div>
              {stage === 2 && (
                <div className='nft-preview-infomation'>
                  <div className='preview-info'>{title}</div>
                  <div className='preview-info'>{username}</div>
                  <div className='preview-info description'>{description}</div>
                  <div className='tags stage2'>
                    {tags.map((tag, index) => (
                      <Tag key={index} tag={tag} stage={stage} />
                    ))}
                  </div>
                </div>
              )}
              {stage === 1 && (
                <div className='tags'>
                  {tags.map((tag, index) => (
                    <Tag key={index} tag={tag} stage={stage} />
                  ))}
                </div>
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
          <div
            className='close-button'
            onClick={() => {
              setTags([])
              onCloseUploadModal()
            }}
          >
            <CloseIcon data-tip='Close'/>
          </div>
          <div data-tip='Back' className='goback-button' onClick={onGoBack}>
            <GoBackIcon data-tip='Back'/>
          </div>
        </div>
      ) : (
        <div className='success-screen'>
          <div className='message'>
            <div className='title'>
              Congratulations! Your NFT is ready for action{' '}
            </div>
            <div className='description'>
              Share your newly minted media with everyone you know to start
              earning attention rewards.
            </div>
            <div className='btns'>
              <button onClick={handleRegisterMore} className='btn'>
                Register More
              </button>
              <button onClick={handleGoToGallery} className='btn'>
                Go to My Gallery
              </button>
            </div>
          </div>
          <div className='card'>
            <BigCard
              txId={transactionId}
              name={title}
              imageUrl={url}
              contentType={contentType || 'image'}
              createdAt={createdAt}
              tags={tags}
              koiRockUrl={`${PATH.KOI_ROCK}/${transactionId}`}
              description={description}
            />
          </div>
        </div>
      )}
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}
