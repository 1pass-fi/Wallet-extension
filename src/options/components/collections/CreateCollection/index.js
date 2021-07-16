import React, { useState, useContext, useEffect } from 'react'
import { isEmpty } from 'lodash'

import './index.css'
import InputInfo from './InputInfo'
import SelectNFT from './SelectNFT'
import Success from './Success'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import { GalleryContext } from 'options/galleryContext'
import { ERROR_MESSAGE } from 'koiConstants'
import { backgroundRequest } from 'popup/backgroundRequest'

import { mockSaveCollections } from 'options/utils'
import { mockGetCollections } from 'options/utils'
import { getNftsDataForCollections } from 'options/utils'

export default () => {
  const { collectionNFT,
    setCollectionNFT, 
    setShowCreateCollection,
    stage, 
    setStage,
    setError,
    demoCollections,
    setDemoCollections,
    setPage,
    setTotalPage,
    address,
    setIsLoading,
    setCollections
  } = useContext(GalleryContext)
  // const [stage, setStage] = useState(1)

  const [collectionName, setCollectionName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])


  const onClose = () => {
    setShowCreateCollection(false)
    setCollectionNFT([])
    setPage(0)
    setTotalPage(1)
    setStage(1)
  }

  const onGoBack = () => {
    setStage(stage !== 1 ? stage - 1 : 1)
  }

  const handleCreateNewCollection = async () => {
    try {
      const nfts = collectionNFT.filter(nft => nft.id)
      const nftIds = nfts.map(nft => nft.id)
      console.log('Nfts list: ', nftIds)
      const collectionInfo = {
        name: collectionName,
        description,
        tags,
        owner: address
      }

      /*
        Currently we still not have a funciton to get collections. This code will be kept for now.
      */
      const newCollection = {
        id: Date.now(),
        name: collectionName,
        nftIds,
        views: 1234,
        earnedKoi: 1000,
        pieces: nfts.length,
        tags,
        koiRockUrl: 'https://koi.rocks'
      }

      await mockSaveCollections(newCollection)
      let newCollections = await mockGetCollections()
      newCollections = await Promise.all(newCollections.map(collection => getNftsDataForCollections(collection))) 
      setCollections(newCollections)
      /* 
        Create new collection using sdk
      */
      // setIsLoading(true)
      // const txId = await backgroundRequest.gallery.createNewCollection({ nftIds, collectionInfo })
      // setIsLoading(false)
      // console.log('Transaction Id: ', txId)

    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const confirmButtonOnClick = async () => {

    switch (stage) {
      case 1:
        if (!collectionName || !description) {
          setError(ERROR_MESSAGE.EMPTY_FIELDS)
        } else {
          setStage(stage + 1)
        }
        break
      case 2:
        setStage(stage + 1)
        break
      case 3:
        try {
          setIsLoading(true)
          await handleCreateNewCollection()
          setIsLoading(false)
          setStage(stage + 1)
          break
        } catch (err) {
          setError(err.message)
        }
    }
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
              setColletionName={setCollectionName}
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
        <div
          className='close-button'
          onClick={onClose}
        >
          <CloseIcon />
        </div>

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
