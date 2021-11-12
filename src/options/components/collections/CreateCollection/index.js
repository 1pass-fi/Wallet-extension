import React, { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import ReactTooltip from 'react-tooltip'

import './index.css'
import InputInfo from './InputInfo'
import SelectNFT from './SelectNFT'
import Success from './Success'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import { GalleryContext } from 'options/galleryContext'
import { ERROR_MESSAGE, NOTIFICATION } from 'constants/koiConstants'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import { popupAccount } from 'services/account'
import { getBalance } from 'options/selectors/defaultAccount'

import { setCreateCollection } from 'options/actions/createCollection'
import { setAssets } from 'options/actions/assets'

export default () => {
  const { 
    setShowCreateCollection,
    setError,
    setIsLoading,
    setNotification,
  } = useContext(GalleryContext)
  const dispatch = useDispatch()

  const [collectionName, setCollectionName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])

  const [balance, koiBalance] = useSelector(getBalance)

  const createCollection = useSelector(state => state.createCollection)
  const assets = useSelector(state => state.assets)
  const defaultAccount = useSelector(state => state.defaultAccount)

  const onClose = () => {
    setShowCreateCollection(false)
    const payload = {
      selectedNfts: [],
      currentPage: 0,
      totalPage: 1,
      stage: 1
    }

    dispatch(setCreateCollection(payload))
  }

  const onGoBack = () => {
    dispatch(setCreateCollection({ stage: createCollection.stage !== 1 ? createCollection.stage - 1 : 1 }))
  }

  const handleCreateNewCollection = async () => {
    try {

      // Balances validations.
      if (balance < 0.000004) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_AR)
      if (koiBalance < 1) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
      const nfts = createCollection.selectedNfts.filter(nft => nft.id)
      if (!isEmpty(nfts)) {
        const nftIds = nfts.map(nft => nft.id)
        console.log('Nfts list: ', nftIds)
        const collectionInfo = {
          name: collectionName,
          description,
          tags,
          owner: defaultAccount.address
        }

        setIsLoading(true)
        const txId = await backgroundRequest.gallery.createNewCollection({ nftIds, collectionInfo, address: defaultAccount.address })
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
    switch (createCollection.stage) {
      case 1:
        if (!collectionName || !description) {
          setError(ERROR_MESSAGE.EMPTY_FIELDS)
        } else {
          dispatch(setCreateCollection({ stage: createCollection.stage + 1 }))
        }
        break
      case 2:
        nfts = createCollection.selectedNfts.filter(nft => nft.id)
        if (isEmpty(nfts)) {
          setError(ERROR_MESSAGE.COLLECTION_NFT_EMPTY)
        } else {
          dispatch(setCreateCollection({ stage: createCollection.stage + 1 }))
        }
        break
      case 3:
        try {
          setIsLoading(true)
          await handleCreateNewCollection()
          setIsLoading(false)
          dispatch(setCreateCollection({ stage: createCollection.stage + 1 }))
          break
        } catch (err) {
          setIsLoading(false)
          setError(err.message)
        }
    }
  }

  useEffect(() => {
    return async () => {
      let allAssets = await popupAccount.getAllAssets()
      allAssets = allAssets.filter(asset => asset.name !== '...')
      dispatch(setAssets({ nfts: allAssets }))
    }
  }, [])

  return (
    <div className='create-collection'>
      <div className={createCollection.stage == 4 ? 'wrapper stage4' : 'wrapper'}>
        {/* TITLE */}
        {createCollection.stage !== 4 && <div className='form-title'>Create a new collection</div>}
        {/* {stage == 4 && <div className='form-title stage4'>Your collection {collectionName} is ready to share!</div>} */}
        {createCollection.stage == 4 && <div className='form-title stage4'>Your collection {collectionName} is ready to share!</div>}

        {/* FORM BODY */}
        <div className='content'>
          {
            /* 
              Input: 
                - Name
                - Description
                - Tags
            */
            createCollection.stage == 1 && <InputInfo
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
            (createCollection.stage == 2 || createCollection.stage == 3) && <SelectNFT 
              nfts={isEmpty(createCollection.selectedNfts) ? [{}, {}, {}, {}, {}] : createCollection.selectedNfts} tags={tags} 
              collectionName={collectionName}
              description={description}
            />
          }
          {
            /* 
              Created successfully screen.
            */
            createCollection.stage == 4 && <Success collectionName={collectionName} description={description} tags={tags}/>
          }
        </div>

        {/* CLOSE BUTTON */}
        <div
          className='close-button'
          onClick={onClose}
        >
          <CloseIcon data-tip='Close'/>
        </div>

        {/* GO BACK BUTTON */}
        {createCollection.stage !== 4 && <div className='goback-button' onClick={onGoBack}>
          <GoBackIcon data-tip='Back'/>
        </div>}

        {/* CONFIRM BUTTON */}
        { createCollection.stage !== 4 &&
        <div onClick={confirmButtonOnClick} className='confirm-button'>
          <button>
            {createCollection.stage === 1 && 'Select NFTs'}
            {createCollection.stage === 2 && 'Create collection'}
            {createCollection.stage === 3 && 'Confirm Registration on Smartweave'}
          </button>
        </div>
        }
      </div>
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}
