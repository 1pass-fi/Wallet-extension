import React, { useContext, useEffect, useState, useRef } from 'react'
import { isEmpty } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'


import './index.css'
import Tag from '../Tag'
import { NftThumbnails } from './NftThumbnails'

import EditIcon from 'img/edit-icon-collection.svg'
import { GalleryContext } from 'options/galleryContext'

import { setCreateCollection } from 'options/actions/createCollection'


export default ({nfts, tags, collectionName, description}) => {
  const [middleNfts, setMiddleNfts] = useState([{}, {}, {}, {}, {}])
  const [leftNfts, setLeftNfts] = useState([{}, {}, {}, {}, {}])
  const [rightNfts, setRightNfts] = useState([{}, {}, {}, {}, {}])

  const prevPageRef = useRef()
  const createCollection = useSelector(state => state.createCollection)

  const dispatch = useDispatch()


  /* 
    Ref to nft DOM element. Change className of this element to trigger the animation using css
  */
  const leftNftsRef = useRef([])
  const middleNftsRef = useRef([])
  const rightNftsRef = useRef([])

  const clearSlideClassName = () => {
    leftNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
    leftNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
    middleNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
    middleNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
    rightNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
    rightNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
  }

  const checkEmptySlice = (slice) => {
    if (isEmpty(slice)) {
      return [{}, {}, {}, {}, {}]
    }
    return slice
  }

  useEffect(() => {
    prevPageRef.current = createCollection.currentPage
  })
  

  /* 
    Ref to the previous page, to determind if the page changing was an increment or decrement
  */
  const prevPage = prevPageRef.current


  /* 
    Sets set of 5 nfts to left, middle, right.
    Run when nfts state changed (by selecting or unselecting an nft).
  */
  useEffect(() => {
    let nftListLeft
    let nftListMiddle
    let nftListRight

    if (createCollection.currentPage == (prevPage || 0)) {
      nftListMiddle = checkEmptySlice(nfts.slice(createCollection.currentPage*5, createCollection.currentPage*5 + 5))
      nftListLeft = checkEmptySlice(nfts.slice(createCollection.currentPage*5 - 5, createCollection.currentPage*5))
      nftListRight = checkEmptySlice(nfts.slice(createCollection.currentPage*5 + 5, createCollection.currentPage*5 + 10))
      setMiddleNfts(nftListMiddle)
      setLeftNfts(nftListLeft)
      setRightNfts(nftListRight)
    }
  }, [nfts])


  
  /* 
    Run when the page state changed.
    Do animation then update nfts
  */
  useEffect(() => {
    let nftListMiddle, nftListLeft, nftListRight

    /* Page increment: Move to left */
    if ((prevPage || 0) < createCollection.currentPage) {
      // Delay updating nfts until the animation finished.
      let thisPage = createCollection.currentPage -1
 
      nftListMiddle = checkEmptySlice(nfts.slice(thisPage*5, thisPage*5 + 5))
      nftListLeft = checkEmptySlice(nfts.slice(thisPage*5 - 5, thisPage*5))
      nftListRight = checkEmptySlice(nfts.slice(thisPage*5 + 5, thisPage*5 + 10))

      setMiddleNfts(nftListMiddle)
      setLeftNfts(nftListLeft)
      setRightNfts(nftListRight)

      // clear previous className to make sure next className mutation will trigger the animation
      clearSlideClassName()

      setTimeout(() => {
        // set className to trigger the slide animation
        leftNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-left')
        rightNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-left')
        middleNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-left')

        /* 
          After the animation finished executing, there will be a chance that the MiddleNfts be reverted to the previous set
          causing by the state updating will take a little bit of time to finished.
          Therefore we will manually update the MiddleNfts a little bit sooner to make sure there will be 
          no shuttering from the animation.
        */
        setTimeout(() => {
          setMiddleNfts(nftListRight)
        }, 690)

        // 700ms is the duration of the animation
        setTimeout(() => {
          let nftListMiddle = checkEmptySlice(nfts.slice(createCollection.currentPage*5, createCollection.currentPage*5 + 5))
          let nftListLeft = checkEmptySlice(nfts.slice(createCollection.currentPage*5 - 5, createCollection.currentPage*5))
          let nftListRight = checkEmptySlice(nfts.slice(createCollection.currentPage*5 + 5, createCollection.currentPage*5 + 10))
          setMiddleNfts(nftListMiddle)
          setLeftNfts(nftListLeft)
          setRightNfts(nftListRight)
        }, 700)
      }, 1)
    }

    /* Page decrement: Move to right */
    if ((prevPage || 0) > createCollection.currentPage) {
      // apply the same logic with Move to left.
      let thisPage = createCollection.currentPage + 1
      
      nftListMiddle = checkEmptySlice(nfts.slice(thisPage*5, thisPage*5 + 5))
      nftListLeft = checkEmptySlice(nfts.slice(thisPage*5 - 5, thisPage*5))
      nftListRight = checkEmptySlice(nfts.slice(thisPage*5 + 5, thisPage*5 + 10))

      setMiddleNfts(nftListMiddle)
      setLeftNfts(nftListLeft)
      setRightNfts(nftListRight)

      clearSlideClassName()

      setTimeout(() => {

        leftNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-right')
        rightNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-right')
        middleNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-right')

        setTimeout(() => {
          setMiddleNfts(nftListLeft)
        }, 690)
        setTimeout(() => {
          let nftListMiddle = checkEmptySlice(nfts.slice(createCollection.currentPage*5, createCollection.currentPage*5 + 5))
          let nftListLeft = checkEmptySlice(nfts.slice(createCollection.currentPage*5 - 5, createCollection.currentPage*5))
          let nftListRight = checkEmptySlice(nfts.slice(createCollection.currentPage*5 + 5, createCollection.currentPage*5 + 10))
          setMiddleNfts(nftListMiddle)
          setLeftNfts(nftListLeft)
          setRightNfts(nftListRight)
        }, 700)
      }, 1)
    }
  }, [createCollection.currentPage])

  /* 
    Handles removing an NFT from the list.
    The code for selecting new NFT is in: options/components/content/nftCard
  */
  const removeFromCollection = (id) => {
    let nfts = [...createCollection.selectedNfts]
    nfts = nfts.filter((nft) => nft.id !== id)
    nfts.push({})
    const notEmptySlots = nfts.filter((nft) => nft.id)
    if ((notEmptySlots.length % 5 === 0 && notEmptySlots.length > 0)) {
      nfts = notEmptySlots
    }
    dispatch(setCreateCollection({ selectedNfts: [...nfts]}))
    if (((createCollection.totalPage - nfts.length / 5) === 1) && createCollection.currentPage === createCollection.totalPage - 1) {
      dispatch(setCreateCollection({ currentPage: createCollection.currentPage - 1 }))
    }
    dispatch(setCreateCollection({ totalPage: (nfts.length / 5) }))

  }

  const reorder = (list, startIndex, endIndex) => {
    const result = [...list]
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
  
    return result
  }

  // Runs when drop
  const onDragEnd = (result) => {
    /* Reoder nfts */
    const destId = result.destination.index
    const sourceId = result.source.index

    if (createCollection.selectedNfts[destId].url && createCollection.selectedNfts[sourceId].url) {
      const newArray = reorder(createCollection.selectedNfts, sourceId, destId)
      dispatch(setCreateCollection({selectedNfts: [...newArray]}))
      setMiddleNfts(newArray.slice(createCollection.currentPage*5, createCollection.currentPage*5 + 5))
    }
  }

  return (
    <div className='select-nft'>
      {createCollection.currentPage == 0 && createCollection.stage == 2 && <div className='cover-image-tag'>cover image</div>}
      
      {/* INFO */}
      <div className='info'>
        <div className='nft-title'>
          {/* <div className='edit-icon'><EditIcon /></div> */}
          <>{collectionName}</>
        </div>
        <div className='description'>{description}</div>
      </div>

      {/* TAGS */}
      <div className='tags' tags={tags}>
        {tags.map((tag, index) => <Tag key={index} tag={tag}/>)}
      </div>

      {/* HINT */}
      {createCollection.stage === 2 && <div className='hint'>Click on each NFT from your gallery to include</div>}

      {/* NFTs */}
      {createCollection.stage === 2 &&

      /* 
        To perform the scrolling animation we will create 3 NftThumbnails components arranged respectively from the left to right.
          Left NFTs - Middle NFTs - Right NFTs
        What will be shown to the screen is only Middle NFTs, others will be hidden using "overflow-x: hidden"
      */

      <div className='thumbnails-animation'>
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          nfts={leftNfts}
          onDragEnd={onDragEnd}
          className='left'
          numRef={leftNftsRef}
        />
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          nfts={middleNfts}
          onDragEnd={onDragEnd}
          className='middle'
          numRef={middleNftsRef}
        />
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          nfts={rightNfts}
          onDragEnd={onDragEnd}
          className='right'
          numRef={rightNftsRef}
        />
      </div>

      }

      {createCollection.stage === 3 &&
      /* 
        Shows all selected NFTs
      */
      <div className='selected-nft'>
        {(createCollection.selectedNfts.map((nft, index) => {
          if (nft.url) return (
            <div className='nft-wrapper' key={index}>
              {nft?.contentType?.includes('image') && 
                <img src={nft.url}></img>
              }
              {nft?.contentType.includes('video') && 
                <video
                  width={88}
                  height={88}
                  src={nft.url}
                  className='nft-img'
                  controls
                  muted
                />
              }
              {nft?.contentType?.includes('html') &&
                <div className='iframe-wrapper'>
                  <iframe frameBorder="0" src={nft.url}/>
                </div>
              }
            </div>
          )
        }))}
      </div>
      }

      {/* PAGES */}
      {createCollection.stage === 2 && <div className='page'>
        {[...Array(createCollection.totalPage)].map((a, index) => 
          <div 
            key={index} 
            className={createCollection.currentPage === index ? 'pageNum active': 'pageNum'}
            onClick={() => dispatch(setCreateCollection({ currentPage: index }))}
          ></div>)}
      </div>}

      {/* PRICE */}
      {createCollection.stage === 3 && 
      <div className='price'>
        <div>Estimated costs:</div>
        <div className='price-amount'>
          <div>1 KOII</div>
          <div>0.000004 AR</div>
        </div>
      </div>
      }
    </div>
  )
}
