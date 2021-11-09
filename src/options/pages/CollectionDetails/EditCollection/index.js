import React, { useState } from 'react'

import ReactTooltip from 'react-tooltip'

import { formatNumber } from 'options/utils'

import EditIcon from 'img/edit-icon-collection.svg'
import AddIcon from 'img/add-icon-green.svg'
import ToggleButton from 'options/components/toggleButton'

import './index.css'

const EditCollection = ({
  collection,
  showViews,
  showEarnedKoi,
  publishCollection,
  setPublishCollection,
  setEditCollection,
}) => {
  const [editCollectionObject, setEditCollectionObject] = useState(collection)

  console.log('Edit Collection', collection)

  const handlePublish = () => {
    console.log('Publish Collection')
  }

  const handleCollectionInfoChange = (e) => {
    setEditCollectionObject({ ...editCollectionObject, [e.target.name]: e.target.value })
  }

  return (
    <>
      <div className='collection-details'>
        <div className='collection-detail-header'>
          <div className='title'>
            <input
              className='collection-details__name'
              name='name'
              onChange={handleCollectionInfoChange}
              value={editCollectionObject.name}
            />
            <div
              className='collection-icon edit-icon'
              data-tip='Edit Collection'
              data-for='remove'
              onClick={() => setEditCollection(true)}
            >
              <EditIcon />
            </div>
            <div
              className='collection-icon'
              data-tip='Add NFT'
              onClick={() => setEditCollection(true)}
            >
              <AddIcon />
            </div>
          </div>

          <div className='toggle-wrapper'>
            <div className='toggle-label'>published</div>
            <div className='toggle-button' onClick={handlePublish}>
              <ToggleButton value={publishCollection} setValue={setPublishCollection} />
            </div>
          </div>
        </div>
        <div className='collection-details__views-count'>
          {showViews && (
            <div className='views'>
              <div className='collection-details__views-count__number'>
                {editCollectionObject.totalViews}
              </div>
              <span className='collection-details__views-count__text'>Views</span>
            </div>
          )}
          {showEarnedKoi && (
            <div className='earned-koi'>
              <div className='collection-details__views-count__number'>
                {formatNumber(editCollectionObject.totalReward, 2)}
              </div>
              <span className='collection-details__views-count__text'>KOII earned</span>
            </div>
          )}
        </div>
        <textarea
          className='collection-details__description'
          name='description'
          onChange={handleCollectionInfoChange}
          value={editCollectionObject.description}
        />
        <div className='tags'>
          {editCollectionObject.tags?.map((tag, index) => (
            <div key={index} className='tag-item'>
              {tag}
            </div>
          ))}
        </div>
        <div className='add-nfts'>
          <div className='add-nfts-add-icon'>
            <AddIcon />
          </div>
          Add NFTs to this Collection
        </div>
        <ReactTooltip place='top' type='dark' effect='float' />
        <ReactTooltip id='remove' place='left' effect='float' />
      </div>
    </>
  )
}

export default EditCollection
