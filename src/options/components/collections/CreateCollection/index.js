import React, { useState, useContext, useEffect } from 'react'
import { isEmpty } from 'lodash'

import './index.css'
import InputInfo from './InputInfo'
import SelectNFT from './SelectNFT'
import Success from './Success'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import { GalleryContext } from 'options/galleryContext'

export default () => {
  const { collectionNFT, setCollectionNFT, setShowCreateCollection } = useContext(GalleryContext)
  const [stage, setStage] = useState(1)

  const [collectionName, setColletionName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])


  const onClose = () => {
    setShowCreateCollection(false)
    setCollectionNFT([])
  }

  const onGoBack = () => {
    setStage(stage !== 1 ? stage - 1 : 1)
  }

  const confirmButtonOnClick = () => {
    stage !== 4 && setStage(stage + 1)
  }

  return (
    <div className='create-collection'>
      <div className={stage == 4 ? 'wrapper stage4' : 'wrapper'}>
        {/* TITLE */}
        {stage !== 4 && <div className='form-title'>Create a new collection</div>}
        {stage == 4 && <div className='form-title stage4'>Your collection {collectionName} is ready to share!</div>}

        {/* FORM BODY */}
        <div className='content'>
          {
            /* 
              Input: 
                - Name
                - Description
                - Tags
            */
            stage == 1 && <InputInfo
              tags={tags}
              setColletionName={setColletionName}
              setDescription={setDescription}
              setTags={setTags}
              collectionName={collectionName}
            />
          }
          {
            /* 
              Stage 2: select NFTs to put into the collection
              Stage 3: preview the collections
            */
            (stage == 2 || stage == 3) && <SelectNFT 
              nfts={isEmpty(collectionNFT) ? [{}, {}, {}, {}, {}] : collectionNFT} tags={tags} 
              collectionName={collectionName}
              description={description}
              setNfts={setCollectionNFT}
              stage={stage}
              description={description}
            />
          }
          {
            /* 
              Created successfully screen.
            */
            stage == 4 && <Success collectionName={collectionName} description={description} tags={tags}/>
          }
        </div>

        {/* CLOSE BUTTON */}
        {stage !== 4 && <div
          className='close-button'
          onClick={onClose}
        >
          <CloseIcon />
        </div>}

        {/* GO BACK BUTTON */}
        {stage !== 4 && <div className='goback-button' onClick={onGoBack}>
          <GoBackIcon />
        </div>}

        {/* CONFIRM BUTTON */}
        { stage !== 4 &&
        <div onClick={confirmButtonOnClick} className='confirm-button'>
          <button>
            {stage === 1 && 'Select NFTs'}
            {stage === 2 && 'Create collection'}
            {stage === 3 && 'Confirm Registration on Smartweave'}
          </button>
        </div>
        }
      </div>
    </div>
  )
}
