import React, { useContext, useEffect, useState, useRef } from 'react'
import { isEmpty } from 'lodash'

import './index.css'
import Tag from '../Tag'
import { NftThumbnails } from './NftThumbnails'

import EditIcon from 'img/edit-icon-collection.svg'
import { GalleryContext } from 'options/galleryContext'


export default ({nfts, tags, collectionName, description, stage}) => {
  const { collectionNFT, setCollectionNFT, totalPage, setTotalPage, page, setPage} = useContext(GalleryContext)

  const [middleNfts, setMiddleNfts] = useState([{}, {}, {}, {}, {}])
  const [leftNfts, setLeftNfts] = useState([{}, {}, {}, {}, {}])
  const [rightNfts, setRightNfts] = useState([{}, {}, {}, {}, {}])

  const prevPageRef = useRef()


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
    prevPageRef.current = page
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

    if (page == (prevPage || 0)) {
      nftListMiddle = checkEmptySlice(nfts.slice(page*5, page*5 + 5))
      nftListLeft = checkEmptySlice(nfts.slice(page*5 - 5, page*5))
      nftListRight = checkEmptySlice(nfts.slice(page*5 + 5, page*5 + 10))
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
    if ((prevPage || 0) < page) {
      // Delay updating nfts until the animation finished.
      let thisPage = page -1
 
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
          let nftListMiddle = checkEmptySlice(nfts.slice(page*5, page*5 + 5))
          let nftListLeft = checkEmptySlice(nfts.slice(page*5 - 5, page*5))
          let nftListRight = checkEmptySlice(nfts.slice(page*5 + 5, page*5 + 10))
          setMiddleNfts(nftListMiddle)
          setLeftNfts(nftListLeft)
          setRightNfts(nftListRight)
        }, 700)
      }, 1)
    }

    /* Page decrement: Move to right */
    if ((prevPage || 0) > page) {
      // apply the same logic with Move to left.
      let thisPage = page + 1
      
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
          let nftListMiddle = checkEmptySlice(nfts.slice(page*5, page*5 + 5))
          let nftListLeft = checkEmptySlice(nfts.slice(page*5 - 5, page*5))
          let nftListRight = checkEmptySlice(nfts.slice(page*5 + 5, page*5 + 10))
          setMiddleNfts(nftListMiddle)
          setLeftNfts(nftListLeft)
          setRightNfts(nftListRight)
        }, 700)
      }, 1)
    }
  }, [page])

  /* 
    Handles removing an NFT from the list.
    The code for selecting new NFT is in: options/components/content/nftCard
  */
  const removeFromCollection = (id) => {
    let nfts = [...collectionNFT]
    nfts = nfts.filter((nft) => nft.id !== id)
    nfts.push({})
    const notEmptySlots = nfts.filter((nft) => nft.id)
    if ((notEmptySlots.length % 5 === 0 && notEmptySlots.length > 0)) {
      nfts = notEmptySlots
    }
    setCollectionNFT([...nfts])
    if (((totalPage - nfts.length / 5) === 1) && page === totalPage - 1) {
      setPage(page - 1)
    }
    setTotalPage(nfts.length / 5)

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
    console.log(result)
    const destId = result.destination.index
    const sourceId = result.source.index

    if (collectionNFT[destId].url && collectionNFT[sourceId].url) {
      const newArray = reorder(collectionNFT, sourceId, destId)
      setCollectionNFT([...newArray])
      setMiddleNfts(newArray.slice(page*5, page*5 + 5))
    }
  }

  return (
    <div className='select-nft'>
      {page == 0 && stage == 2 && <div className='cover-image-tag'>cover image</div>}
      
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
      {stage === 2 && <div className='hint'>Click on each NFT from your gallery to include</div>}

      {/* NFTs */}
      {stage === 2 &&

      /* 
        To perform the scrolling animation we will create 3 NftThumbnails components arranged respectively from the left to right.
          Left NFTs - Middle NFTs - Right NFTs
        What will be shown to the screen is only Middle NFTs, others will be hidden using "overflow-x: hidden"
      */

      <div className='thumbnails-animation'>
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          page={page}
          nfts={leftNfts}
          onDragEnd={onDragEnd}
          className='left'
          numRef={leftNftsRef}
        />
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          page={page}
          nfts={middleNfts}
          onDragEnd={onDragEnd}
          className='middle'
          numRef={middleNftsRef}
        />
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          page={page}
          nfts={rightNfts}
          onDragEnd={onDragEnd}
          className='right'
          numRef={rightNftsRef}
        />
      </div>

      }

      {stage === 3 &&
      /* 
        Shows all selected NFTs
      */
      <div className='selected-nft'>
        {(collectionNFT.map((nft, index) => {
          if (nft.url) return (
            <div className='nft-wrapper' key={index}>
              {(nft.contentType.includes('image')) ? <img src={nft.url}></img> :
                <video
                  width={88}
                  height={88}
                  src={nft.url}
                  className='nft-img'
                  controls
                  muted
                />
              }
            </div>
          )
        }))}
      </div>
      }

      {/* PAGES */}
      {stage === 2 && <div className='page'>
        {[...Array(totalPage)].map((a, index) => 
          <div 
            key={index} 
            className={page === index ? 'pageNum active': 'pageNum'}
            onClick={() => setPage(index)}
          ></div>)}
      </div>}

      {/* PRICE */}
      {stage === 3 && 
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
