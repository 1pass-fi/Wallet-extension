import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { find, isEmpty } from 'lodash'

import { getChromeStorage } from 'utils'
import { STORAGE } from 'constants/koiConstants'
import NFTCard from './nftCard'
import EditCollection from './EditCollection'
import CollectionInfo from './CollectionInfo'

import { setCollections } from 'options/actions/collections'
import { GalleryContext } from 'options/galleryContext'

import GoBack from 'img/goback-icon.svg'
import GalleryViewIcon from 'img/gallery-view-icon.svg'
import GridViewIcon from 'img/grid-view-icon.svg'
import ListViewIcon from 'img/list-view-icon.svg'

import NavBar from 'finnie-v2/components/NavBar'

import './index.css'

export default () => {
  const [editCollection, setEditCollection] = useState(false)
  const [publishCollection, setPublishCollection] = useState(false)

  const { showEarnedKoi, showViews } = useContext(GalleryContext)
  const { collectionId } = useParams()

  const collectionState = useSelector((state) => state.collections)

  const dispatch = useDispatch()

  useEffect(() => {
    const getCollectionsFromStorage = async () => {
      const storage = await getChromeStorage(STORAGE.COLLECTIONS)
      const savedCollection = storage[STORAGE.COLLECTIONS] || []
      dispatch(setCollections({ collections: savedCollection }))
    }

    if (isEmpty(collectionState.collections)) getCollectionsFromStorage()
  }, [])

  const collection = useMemo(() => {
    const collection = find(
      collectionState.collections,
      (collection) => collection.id == collectionId
    )

    if (collection) {
      return collection
    }
    return { title: '', totalViews: 0, totalReward: 0, description: '', collection: [] }
  }, [collectionState.collections])

  const history = useHistory()

  const handleGoBack = () => {
    history.push('/collections')
  }

  return (
    // <div className="collection-wrapper">
    <div className="min-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
      <NavBar />
      {/* <div className="collection-header-buttons">
        {editCollection && (
          <div className="edit-collection-buttons">
            <div
              className="edit-collection-button save-changes-button"
              onClick={() => {
                setNotification('Save Collection successfully!')
                setEditCollection(false)
              }}
            >
              Save Changes
            </div>
            <div
              className="edit-collection-button cancel-button"
              onClick={() => setEditCollection(false)}
            >
              Cancel
            </div>
          </div>
        )}
        <div
          className="share-collection-button"
          onClick={() => setNotification('Share Collection successfully!')}
        >
          Share
        </div>
      </div> */}
      <div className="collection-details-wrapper">
        <div onClick={handleGoBack} className="go-back-button">
          <GoBack />
        </div>
        {editCollection ? (
          <EditCollection
            collection={collection}
            showViews={showViews}
            showEarnedKoi={showEarnedKoi}
            publishCollection={publishCollection}
            setPublishCollection={setPublishCollection}
            setEditCollection={setEditCollection}
          />
        ) : (
          <CollectionInfo
            collection={collection}
            showViews={showViews}
            showEarnedKoi={showEarnedKoi}
            publishCollection={publishCollection}
            setPublishCollection={setPublishCollection}
            setEditCollection={setEditCollection}
          />
        )}
        <div className="collection-view-wrapper">
          <div className="collection-view-icons">
            <div className="grid-view-icon">
              <GridViewIcon />
            </div>
            <div className="list-view-icon">
              <ListViewIcon />
            </div>
            <div className="gallery-view-icon">
              <GalleryViewIcon />
            </div>
          </div>
          <div className="collection-view-message">coming soon</div>
        </div>
        <div className="cards">
          {collection?.collection?.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  )
}
