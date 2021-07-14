import React, { useContext, useEffect, useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { isEmpty } from 'lodash'

import './index.css'
import Tag from '../Tag'

import EditIcon from 'img/edit-icon-collection.svg'
import DeleteIcon from 'img/delete-icon-collection.svg'
import { GalleryContext } from 'options/galleryContext'

export const NftThumbnails = ({
  removeFromCollection, 
  page,
  nfts, 
  onDragEnd, 
  className,
  prevPage,
  numRef
}) => {
  /* 
    Displays set of 5 nfts.
    We will use react-beautiful-dnd to do drag and drop.
    Docs: https://github.com/atlassian/react-beautiful-dnd/tree/master/docs/guides
    Code sandbox: https://codesandbox.io/s/mmrp44okvj?file=/index.js
  */

  // let numRef = useRef([])
  
  // useEffect(() => {
  //   console.log('running')
  //   let nftList
  //   if (!prevPage) prevPage = 0
  //   console.log('prevPage: ', prevPage)
  //   console.log('page', page)
  //   if (prevPage == page) {
  //     console.log('RUNNING')
  //     if (className  == 'middle') {
  //       nftList = nfts.slice(page*5, page*5 + 5)
  //     }
  //     if (className == 'left') {
  //       nftList = isEmpty(nfts.slice(page*5 - 5, page*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 - 5, page*5)
  //     }
  //     if (className == 'right') {
  //       nftList = isEmpty(nfts.slice(page*5 + 5, page*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 + 5, page*5 + 10)
  //     }
  //     setDisplayNfts(nftList)
  //   }

    
  // }, [nfts, page])

  // useEffect(() => {
  //   let nftList
  //   console.log('prevPage: ', prevPage)
  //   console.log('page', page)
  //   if (!prevPage) prevPage = 0

  //   if (prevPage == page) {
  //     if (className  == 'middle') {
  //       nftList = nfts.slice(page*5, page*5 + 5)
  //     }
  //     if (className == 'left') {
  //       nftList = isEmpty(nfts.slice(page*5 - 5, page*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 - 5, page*5)
  //     }
  //     if (className == 'right') {
  //       nftList = isEmpty(nfts.slice(page*5 + 5, page*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 + 5, page*5 + 10)
  //     }
  //     setDisplayNfts(nftList)
  //   }

  //   if (page > prevPage) {
  //     console.log('RUNNING SLIDE')
  //     if (className == 'right') {
  //       console.log(nfts)
  //       nftList = isEmpty(nfts.slice(page*5 + 5, page*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 + 5, page*5 + 10)
  //       setDisplayNfts(nftList)
  //     }

  //     numRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
  //     numRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
  //     setTimeout(() => {
  //       numRef.current.forEach(ref => ref.className = ref.className + ' slide-to-left')
  //     }, 1) 
  //   }

  //   if (page < prevPage) {
  //     console.log('RUNNING SLIDE')
  //     if (className == 'left') {
  //       console.log(nfts)
  //       nftList = isEmpty(nfts.slice(page*5 - 5, page*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 - 5, page*5)
  //       setDisplayNfts(nftList)
  //     }

  //     numRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
  //     numRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
  //     setTimeout(() => {
  //       numRef.current.forEach(ref => ref.className = ref.className + ' slide-to-right')
  //     }, 1) 
  //   }
  // }, [page, nfts])

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable' direction='horizontal'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='nft'
            >
              {nfts.map((nft, index) => (
                <Draggable key={index} draggableId={'draggable' + index} index={index + page*5}>
                  {(provided) => (
                    <div
                      key={index}
                      ref={
                        provided.innerRef
                      }
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div ref={ref => numRef.current[index] = ref} className={nft.url ? `nft-wrapper ${className}` : `nft-wrapper empty ${className}`}>
                        {nft.url && <img src={nft.url}></img>}
                        {nft.url && <div onClick={() => removeFromCollection(nft.id)} className='delete-icon'><DeleteIcon /></div>}
                      </div>
                    </div>
                  )
                  }
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>   
  )
}

export default ({nfts, tags, setNfts, collectionName, description, stage}) => {
  const { collectionNFT, setCollectionNFT, totalPage, setTotalPage, page, setPage} = useContext(GalleryContext)
  const [middleNfts, setMiddleNfts] = useState([{}, {}, {}, {}, {}])
  const [leftNfts, setLeftNfts] = useState([{}, {}, {}, {}, {}])
  const [rightNfts, setRightNfts] = useState([{}, {}, {}, {}, {}])

  const prevPageRef = useRef()

  const leftNftsRef = useRef([])
  const middleNftsRef = useRef([])
  const rightNftsRef = useRef([])

  useEffect(() => {
    prevPageRef.current = page
  })

  const prevPage = prevPageRef.current
  /* 
    Sets set of Nfts for left, middle, right.
    Run when nfts changed
  */
  useEffect(() => {
    console.log('running')
    let nftListLeft
    let nftListMiddle
    let nftListRight
    console.log('prevPage: ', prevPage)
    console.log('page', page)
    console.log('RUNNING')
    if (page == (prevPage || 0)) {
      nftListMiddle = nfts.slice(page*5, page*5 + 5)
      nftListLeft = isEmpty(nfts.slice(page*5 - 5, page*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 - 5, page*5)
      nftListRight = isEmpty(nfts.slice(page*5 + 5, page*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 + 5, page*5 + 10)
      setMiddleNfts(nftListMiddle)
      setLeftNfts(nftListLeft)
      setRightNfts(nftListRight)
    }
  }, [nfts])
  /* 
    Run when page changed.
    Do animation then update nfts
  */
  useEffect(() => {
    // Trigger the animation by changing className
    // Page increment => move to left
    console.log(nfts)
    if ((prevPage || 0) < page) {
      let thisPage = page -1
      
      let nftListMiddle = nfts.slice(thisPage*5, thisPage*5 + 5)
      let nftListLeft = isEmpty(nfts.slice(thisPage*5 - 5, thisPage*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(thisPage*5 - 5, thisPage*5)
      let nftListRight = isEmpty(nfts.slice(thisPage*5 + 5, thisPage*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(thisPage*5 + 5, thisPage*5 + 10)
      setMiddleNfts(nftListMiddle)
      setLeftNfts(nftListLeft)
      setRightNfts(nftListRight)
      // clear previous className
      leftNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
      leftNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
      middleNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
      middleNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
      rightNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
      rightNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
      setTimeout(() => {
        // set className and slide
        leftNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-left')
        rightNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-left')
        middleNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-left')
        setTimeout(() => {
          setMiddleNfts(nftListRight)
        }, 650)
        setTimeout(() => {
          let nftListMiddle = nfts.slice(page*5, page*5 + 5)
          let nftListLeft = isEmpty(nfts.slice(page*5 - 5, page*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 - 5, page*5)
          let nftListRight = isEmpty(nfts.slice(page*5 + 5, page*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 + 5, page*5 + 10)
          setMiddleNfts(nftListMiddle)
          setLeftNfts(nftListLeft)
          setRightNfts(nftListRight)
        }, 800)
      }, 1)
    }
    // page decrement => move to right
    if ((prevPage || 0) > page) {
      let thisPage = page + 1
      
      let nftListMiddle = nfts.slice(thisPage*5, thisPage*5 + 5)
      let nftListLeft = isEmpty(nfts.slice(thisPage*5 - 5, thisPage*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(thisPage*5 - 5, thisPage*5)
      let nftListRight = isEmpty(nfts.slice(thisPage*5 + 5, thisPage*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(thisPage*5 + 5, thisPage*5 + 10)
      setMiddleNfts(nftListMiddle)
      setLeftNfts(nftListLeft)
      setRightNfts(nftListRight)
      // clear previous className
      leftNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
      leftNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
      middleNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
      middleNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
      rightNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-left', ''))
      rightNftsRef.current.forEach(ref => ref.className = ref.className.replace('slide-to-right', ''))
      setTimeout(() => {
        // set className and slide
        leftNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-right')
        rightNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-right')
        middleNftsRef.current.forEach(ref => ref.className = ref.className + ' slide-to-right')
        setTimeout(() => {
          setMiddleNfts(nftListLeft)
        }, 650)
        setTimeout(() => {
          let nftListMiddle = nfts.slice(page*5, page*5 + 5)
          let nftListLeft = isEmpty(nfts.slice(page*5 - 5, page*5)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 - 5, page*5)
          let nftListRight = isEmpty(nfts.slice(page*5 + 5, page*5 + 10)) ? [{}, {}, {}, {}, {}] : nfts.slice(page*5 + 5, page*5 + 10)
          setMiddleNfts(nftListMiddle)
          setLeftNfts(nftListLeft)
          setRightNfts(nftListRight)
        }, 800)
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
    if (((totalPage - nfts.length / 5) === 1) && page === totalPage - 1) {
      setPage(page - 1)
    }
    setTotalPage(nfts.length / 5)
    setCollectionNFT([...nfts])
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
      {page == 0 && <div className='cover-image-tag'>cover image</div>}
      
      {/* INFO */}
      <div className='info'>
        <div className='nft-title'>
          <div className='edit-icon'><EditIcon /></div>
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
        Displays set of 5 nfts.
        We will use react-beautiful-dnd to do drag and drop.
        Docs: https://github.com/atlassian/react-beautiful-dnd/tree/master/docs/guides
        Code sandbox: https://codesandbox.io/s/mmrp44okvj?file=/index.js
      */


      /* 
        When Page receives an increment:
          - Set new set of nfts for the right
          - Change className for middle and right: + "  slideToLeft"
          - Set new nfts for the middle
      */
      <div className='thumbnails-animation'>
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          page={page}
          nfts={leftNfts}
          onDragEnd={onDragEnd}
          className='left'
          setNfts={setNfts}
          prevPage={prevPage}
          setPage={setPage}
          numRef={leftNftsRef}
        />
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          page={page}
          nfts={middleNfts}
          onDragEnd={onDragEnd}
          className='middle'
          setNfts={setNfts}
          prevPage={prevPage}
          setPage={setPage}
          numRef={middleNftsRef}
        />
        <NftThumbnails
          removeFromCollection={removeFromCollection}
          page={page}
          nfts={rightNfts}
          onDragEnd={onDragEnd}
          className='right'
          setNfts={setNfts}
          prevPage={prevPage}
          setPage={setPage}
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
              <img src={nft.url}></img>
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
          <div>0.0014 AR</div>
        </div>
      </div>
      }
    </div>
  )
}
