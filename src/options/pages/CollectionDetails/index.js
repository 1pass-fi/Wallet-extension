import React, { useContext, useMemo, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { find, isEmpty } from 'lodash'
import ReactTooltip from 'react-tooltip'


import { formatNumber } from 'options/utils'
import { useDispatch, useSelector } from 'react-redux'

import NFTCard from './nftCard'
import './index.css'

import { GalleryContext } from 'options/galleryContext'

import GoBack from 'img/goback-icon.svg'
import EditIcon from 'img/edit-icon-collection.svg'
import AddIcon from 'img/add-icon-green.svg'
import ToggleButton from 'options/components/toggleButton'

import { getChromeStorage } from 'utils'
import { STORAGE } from 'constants/koiConstants'

import { setCollections } from 'options/actions/collections'

export default () => {
  const history = useHistory()

  const { showViews, showEarnedKoi } = useContext(GalleryContext)
  const { collectionId } = useParams()

  const collectionState = useSelector(state => state.collections)
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
    try {
      console.log(collectionState.collections)
      const collection = find(collectionState.collections, collection => collection.id == collectionId)
      console.log(collection)
      if (collection) {
        return collection
      }
      return { title: '', totalViews: 0, totalReward: 0, description: '', nfts: [] }
    } catch (err) {
      return { title: '', totalViews: 0, totalReward: 0, description: '', nfts: [] }
    }
  }, [collectionState.collections])

  const handleGoBack = () => {
    history.push('/collections')
  }

  const editCollection= () => {
    console.log('Edit Collection')
  }

  const handlePublish= () => {
    console.log('Publish Collection')
  }

  return (
    <div className="collection-details-wrapper">
      <div className="collection-header-buttons">
        <div className="edit-collection-buttons">
          <div className="edit-collection-button save-changes-button">Save Changes</div>
          <div className="edit-collection-button cancel-button">Cancel</div>
        </div>
        <div className="share-collection-button">Share</div>
      </div>
      <div className="collection-details">
        <div onClick={handleGoBack} className="go-back-button">
          <GoBack />
        </div>
        <div className="collection-details-abc">
          <div className="collection-detail-header">
            <div className="title">
              <div>{collection.name}</div>
              <div className="collection-icon edit-icon" data-tip="Edit Collection" onClick={editCollection}>
                <EditIcon />
              </div>
              <div className="collection-icon" data-tip="Add NFT">
                <AddIcon />
              </div>
            </div>

            <div className="toggle-wrapper">
              <div className="toggle-label">published</div>
              <div className="toggle-button" onClick={handlePublish}><ToggleButton /></div>
            </div>

          </div>
          <div className="collection-details__views-count">
            {showViews && (
              <div className="views">
                <div className="collection-details__views-count__number">
                  {collection.totalViews}
                </div>
                <span className="collection-details__views-count__text">Views</span>
              </div>
            )}
            {showEarnedKoi && (
              <div className="earned-koi">
                <div className="collection-details__views-count__number">
                  {formatNumber(collection.totalReward, 2)}
                </div>
                <span className="collection-details__views-count__text">KOII earned</span>
              </div>
            )}
          </div>
          <div className="description">{collection.description}</div>
        </div>
        <div className="cards">
          {collection.nfts.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      </div>
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}
