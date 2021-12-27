import React from 'react'

import ReactTooltip from 'react-tooltip'

import { formatNumber } from 'options/utils'

import EditIcon from 'img/edit-icon-collection.svg'
import AddIcon from 'img/add-icon-green.svg'
import ToggleButton from 'options/components/toggleButton'

const CollectionInfo = ({
  collection,
  showViews,
  showEarnedKoi,
  publishCollection,
  setPublishCollection,
  setEditCollection,
}) => {

  const handlePublish = () => {
    // TODO - implement publish collection feature
    console.log('Publish Collection')
  }

  return (
    <>
      <div className='collection-details'>
        <div className='collection-detail-header'>
          <div className='title'>
            <div>{collection.name}</div>
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
              <div className='collection-details__views-count__number'>{collection.totalViews}</div>
              <span className='collection-details__views-count__text'>Views</span>
            </div>
          )}
          {showEarnedKoi && (
            <div className='earned-koi'>
              <div className='collection-details__views-count__number'>
                {formatNumber(collection.totalReward, 2)}
              </div>
              <span className='collection-details__views-count__text'>KOII earned</span>
            </div>
          )}
        </div>
        <div className='description'>{collection.description}</div>
        <div className='tags'>
          {collection.tags?.map((tag, index) => (
            <div key={index} className='tag-item'>
              {tag}
            </div>
          ))}
        </div>
        <ReactTooltip place='top' type='dark' effect='float' />
        <ReactTooltip id='remove' place='left' effect='float' />
      </div>
    </>
  )
}

export default CollectionInfo
