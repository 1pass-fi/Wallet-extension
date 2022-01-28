import React, { useMemo, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { find, isEmpty, get } from 'lodash'
import ReactTooltip from 'react-tooltip'

import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import EditIcon from 'img/v2/collection-detail/edit-icon.svg'

import NftCard from './NftCard'
import { GalleryContext } from 'options/galleryContext'
import { popupAccount } from 'services/account'
import { COLLECTION_CONTRACT_SRC } from 'constants/koiConstants'

const CollectionDetails = () => {
  const history = useHistory()

  const { setEditingCollectionId, setSelectedNftIds } = useContext(GalleryContext)
  const { collectionId } = useParams()

  const collectionState = useSelector(state => state.collections)
  const assets = useSelector(state => state.assets)

  const [updatePending, setUpdatePending] = useState(false)
  const [usedOldContractSrc, setUsedOldContractSrc] = useState(false)

  const nftLoaded = useMemo(() => {
    return !isEmpty(assets.nfts)
  }, [assets.nfts])

  const collection = useMemo(() => {
    const collection = find(
      collectionState.collections,
      (collection) => collection.id === collectionId
    )

    if (collection) {
      return collection
    }
    return { title: '', totalViews: 0, totalReward: 0, description: '', collection: [] }
  }, [collectionState.collections])

  const openEditCollectionForm = () => {
    setEditingCollectionId(collectionId)

    // set nft ids
    const nftIds = collection?.collection || []
    setSelectedNftIds(nftIds) 

    history.push(`/collections/edit/select-nft/${collectionId}`)
  }

  useEffect(() => {
    if (collectionId) {
      setEditingCollectionId(collectionId)
    }
  }, [collectionId])

  useEffect(() => {
    const loadPendingStatus = async () => {
      const owner = get(collection, 'owner')
      if (owner) {
        const account = await popupAccount.getAccount({ address: owner })
        const pendingTransactions = await account.get.pendingTransactions()

        const isPending = !(pendingTransactions.every(tx => {
          try {
            const _collectionId = get(tx, 'data.collectionId')
            return _collectionId !== collectionId 
          } catch (err) {
            console.error(err.message)
            return true
          }
        }))

        setUpdatePending(isPending)
      }
    }

    const loadContractSrc = async () => {
      const contractSrc = get(collection, 'contractSrc')
      setUsedOldContractSrc(contractSrc !== COLLECTION_CONTRACT_SRC)
    }

    if (collection) loadPendingStatus()
    if (collection) loadContractSrc()
  }, [collection])

  const editButtonDataTip = useMemo(() => {
    if (usedOldContractSrc) return 'This version of Collection does not support updating'
    if (updatePending) return 'Transaction pending'
    return ''
  }, [updatePending, usedOldContractSrc])

  return (
    <div className='w-full relative'>
      <div data-tip={editButtonDataTip}>
        <button 
          data-tip={updatePending ? 'Transaction pending' : ''}
          disabled={updatePending || usedOldContractSrc}
          onClick={openEditCollectionForm} 
          className='w-5 h-5.5 z-40 cursor-pointer disabled:cursor-not-allowed mb-2'>
          <EditIcon />
        </button>
      </div>
      {/* DESCRIPTION */}
      <div 
        className='text-white w-full h-25.5 text-sm leading-6 pr-3 mb-3'
        style={{
          overflowY: 'overlay'
        }}
      >{get(collection, 'description')}</div>
      {/* NFT CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-3.75 place-items-stretch'>
        {nftLoaded && collection?.collection?.map((nft, index) => (
          <NftCard key={index} nft={nft} />
        ))}
      </div>
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}

export default CollectionDetails
