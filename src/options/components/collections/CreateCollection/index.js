import React, { useState, useContext } from 'react'
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

import { NOTIFICATION } from 'koiConstants'

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
    setCollections,
    totalAr,
    totalKoi,
    setNotification,
    account
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

      // Balances validations.
      if (totalAr < 0.000004) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_AR)
      if (totalKoi < 1) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
      const nfts = collectionNFT.filter(nft => nft.id)
      if (!isEmpty(nfts)) {
        const nftIds = nfts.map(nft => nft.id)
        console.log('Nfts list: ', nftIds)
        const collectionInfo = {
          name: collectionName,
          description,
          tags,
          owner: address
        }

        setIsLoading(true)
        const txId = await backgroundRequest.gallery.createNewCollection({ nftIds, collectionInfo, address: account.address })
        setIsLoading(false)
        console.log('Transaction Id: ', txId)
        setNotification(NOTIFICATION.CREATE_COLLECTION_SUCCESS)
      } else {
        throw new Error(ERROR_MESSAGE.COLLECTION_NFT_EMPTY)
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  const confirmButtonOnClick = async () => {
    let nfts
    switch (stage) {
      case 1:
        if (!collectionName || !description) {
          setError(ERROR_MESSAGE.EMPTY_FIELDS)
        } else {
          setStage(stage + 1)
        }
        break
      case 2:
        nfts = collectionNFT.filter(nft => nft.id)
        if (isEmpty(nfts)) {
          setError(ERROR_MESSAGE.COLLECTION_NFT_EMPTY)
        } else {
          setStage(stage + 1)
        }
        break
      case 3:
        try {
          setIsLoading(true)
          await handleCreateNewCollection()
          setIsLoading(false)
          setStage(stage + 1)
          break
        } catch (err) {
          setIsLoading(false)
          setError(err.message)
        }
    }
  }

  return (
    <div className='create-collection'>
      <div className={stage == 4 ? 'wrapper stage4' : 'wrapper'}>
        {/* TITLE */}
        {stage !== 4 && <div className='form-title'>Create a new collection</div>}
        {/* {stage == 4 && <div className='form-title stage4'>Your collection {collectionName} is ready to share!</div>} */}
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
