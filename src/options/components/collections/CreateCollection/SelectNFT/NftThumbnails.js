import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'

import './index.css'
import DeleteIcon from 'img/delete-icon-collection.svg'

/* 
  Displays set of 5 nfts.
  We will use react-beautiful-dnd to do drag and drop.
  Docs: https://github.com/atlassian/react-beautiful-dnd/tree/master/docs/guides
  Code sandbox: https://codesandbox.io/s/mmrp44okvj?file=/index.js
*/

export const NftThumbnails = ({
  removeFromCollection, 
  nfts, 
  onDragEnd, 
  className,
  numRef
}) => {
  const createCollection = useSelector(state => state.createCollection)

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
                <Draggable key={index} draggableId={'draggable' + index} index={index + createCollection.currentPage*5}>
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
                        {nft?.url && nft?.contentType?.includes('image') && 
                          <img src={nft.url}></img>
                        }
                        {nft?.url && nft?.contentType?.includes('video') &&                           
                          <div>
                            <video
                              width={140}
                              height={140}
                              src={nft.url}
                              className='nft-img'
                              controls
                              muted
                            />
                            <div className='video-layer'></div>
                          </div>
                        }
                        {nft?.url && nft?.contentType?.includes('html') &&
                          <div className='iframe-wrapper'>
                            <iframe frameBorder="0" src={nft.url}/>
                            <div className='iframe-layer'></div>
                          </div>
                        }
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
