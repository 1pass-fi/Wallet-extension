import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import clsx from 'clsx'
import { COLLECTION_CONTRACT_SRC } from 'constants/koiConstants'
import EditIcon from 'img/v2/collection-detail/edit-icon.svg'
import { find, get, isEmpty } from 'lodash'
import { setEditingCollectionId } from 'options/actions/editingCollectionId'
import { setSelectedNftIds } from 'options/actions/selectedNftIds'
import Sidebar from 'options/components/Sidebar'
import { popupAccount } from 'services/account'

import NftCard from './NftCard'

const CollectionDetails = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const { collectionId } = useParams()

  const collectionState = useSelector((state) => state.collections)
  const assets = useSelector((state) => state.assets)

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
    dispatch(setEditingCollectionId(collectionId))

    // set nft ids
    const nftIds = collection?.collection || []
    dispatch(setSelectedNftIds(nftIds))

    history.push(`/collections/edit/select-nft/${collectionId}`)
  }

  useEffect(() => {
    if (collectionId) {
      dispatch(setEditingCollectionId(collectionId))
    }
  }, [collectionId])

  useEffect(() => {
    const loadPendingStatus = async () => {
      const owner = get(collection, 'owner')
      if (owner) {
        const account = await popupAccount.getAccount({ address: owner })
        const pendingTransactions = await account.get.pendingTransactions()

        const isPending = !pendingTransactions.every((tx) => {
          try {
            const _collectionId = get(tx, 'data.collectionId')
            return _collectionId !== collectionId
          } catch (err) {
            console.error(err.message)
            return true
          }
        })

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
    <>
      <div className="w-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
        <div className="w-full 2xl:w-5/6 mx-auto">
          <div className="px-4.25 pt-6">
            <aside className="fixed z-51 w-61">
              <div
                className={clsx(
                  'text-base uppercase text-white w-61 text-center mb-8 break-words',
                  collection.title?.length > 45 ? 'text-base' : 'text-2xl'
                )}
              >
                {collection.title || collection.name}

                <div className="inline ml-1" data-tip={editButtonDataTip}>
                  <button
                    data-tip={updatePending ? 'Transaction pending' : ''}
                    disabled={updatePending || usedOldContractSrc}
                    onClick={openEditCollectionForm}
                    className="inline w-4 z-40 cursor-pointer disabled:cursor-not-allowed mb-2"
                  >
                    <EditIcon />
                  </button>
                </div>
              </div>
              <Sidebar />
            </aside>
            <main className="ml-65.5 pb-5">
              <div className="w-full relative">
                <div
                  className="text-white w-full h-25.5 text-sm leading-6 pr-3 mb-3"
                  style={{
                    overflowY: 'overlay'
                  }}
                >
                  {get(collection, 'description')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-3.75 place-items-stretch">
                  {nftLoaded &&
                    collection?.collection?.map((nft, index) => <NftCard key={index} nft={nft} />)}
                </div>
                <ReactTooltip place="top" type="dark" effect="float" />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default CollectionDetails
