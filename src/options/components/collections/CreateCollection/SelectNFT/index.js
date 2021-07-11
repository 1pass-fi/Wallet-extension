import React, { useContext, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import './index.css'
import Tag from '../Tag'

import EditIcon from 'img/edit-icon-collection.svg'
import DeleteIcon from 'img/delete-icon-collection.svg'
import { GalleryContext } from 'options/galleryContext'
 
export default ({nfts, tags, setNfts, collectionName, description, stage}) => {
  const { collectionNFT, setCollectionNFT, totalPage, setTotalPage} = useContext(GalleryContext)
  const [page, setPage] = useState(0)

  const handleOnClick = (id) => {
    let nfts = [...collectionNFT]
    nfts = nfts.filter((nft) => nft.id !== id)
    nfts.push({})
    const notEmpty = nfts.filter((nft) => nft.id)
    if ((notEmpty.length % 5 === 0 && notEmpty.length > 0)) {
      nfts = notEmpty
    }
    if ((totalPage - nfts.length / 5 === 1) && page === totalPage - 1) {
      setPage(page - 1)
    }
    setTotalPage(nfts.length / 5)
    setCollectionNFT([...nfts])
  }

  const onDragEnd = () => {
    /* Reoder nfts */
  }

  const grid = 8;

  const getItemStyle = isDraggingOver => ({
    boxShadow: isDraggingOver && '1px 1px 1px 1px #000000' 
  });

  return (
    <div className='select-nft'>
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
        Render each 5 nfts.
        We will use react-beautiful-dnd to do the drag and drop.
        Docs: https://github.com/atlassian/react-beautiful-dnd/tree/master/docs/guides
        Code sandbox: https://codesandbox.io/s/mmrp44okvj?file=/index.js
      */
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable' direction='horizontal'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='nft'
              >
                {(nfts.slice(page*5, page*5 + 5)).map((nft, index) => (
                  <Draggable key={index} draggableId={'draggable' + index} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        key={index} 
                        className={nft.url ? 'nft-wrapper' : 'nft-wrapper empty'}
                        ref={provided.innerRef}
                        style={getItemStyle(snapshot.isDragging)}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {nft.url && <img src={nft.url}></img>}
                        {nft.url && <div onClick={() => handleOnClick(nft.id)} className='delete-icon'><DeleteIcon /></div>}
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
      }
      {stage === 3 &&
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
        {[...Array(totalPage)].map((a, index) => <div 
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
