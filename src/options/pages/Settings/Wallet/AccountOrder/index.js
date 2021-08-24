import React, { useState, useContext } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import RearrangePadsIcon from 'img/rearrange-pads-icon.svg'
import { getDisplayAddress } from 'options/utils'
import storage from 'storage'

import './index.css'
import { GalleryContext } from 'options/galleryContext'
import { backgroundRequest } from 'popup/backgroundRequest'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 6,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? '#BEF0ED' : '#F5F5F5',
  ...draggableStyle,
})

const getListStyle = (isDraggingOver) => ({
  background: '#F5F5F5',
  paddingTop: 9,
  paddingBottom: 1,
  width: 376,
  position: 'relative',
})

const queryAttr = 'data-rbd-drag-handle-draggable-id'

export default ({ accounts, setAccounts }) => {
  const [placeholderProps, setPlaceholderProps] = useState({})
  const { setAccount, setNotification, setError } = useContext(GalleryContext)

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    setPlaceholderProps({})
    setAccounts((accounts) =>
      reorder(accounts, result.source.index, result.destination.index)
    )
  }

  const onDragUpdate = (update) => {
    if (!update.destination) {
      return
    }
    const draggableId = update.draggableId
    const destinationIndex = update.destination.index

    const domQuery = `[${queryAttr}='${draggableId}']`
    const draggedDOM = document.querySelector(domQuery)

    if (!draggedDOM) {
      return
    }
    const { clientHeight, clientWidth } = draggedDOM

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, destinationIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr)
          const marginBottom = parseFloat(style.marginBottom)
          return total + curr.clientHeight + marginBottom
        }, 0)

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      ),
    })
  }

  const reloadDefaultAccount = async () => {
    let activatedAccount = await storage.setting.get.activatedAccountAddress()
    activatedAccount = await popupAccount.getAccount({ address: activatedAccount })
    activatedAccount = await activatedAccount.get.metadata()

    setAccount(activatedAccount)
  }

  const handleSetDefaultAccount = async (address) => {
    try {
      await backgroundRequest.gallery.setDefaultAccount({ address })
      await reloadDefaultAccount()
      setNotification(`Set default account successfully.`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
  // <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
  //   <Droppable droppableId='droppable'>
  //     {(provided, snapshot) => (
  //       <div
  //         {...provided.droppableProps}
  //         ref={provided.innerRef}
  //         style={getListStyle(snapshot.isDraggingOver)}
  //         className='account-order'
  //       >
  //         {accounts.map((item, index) => (
  //           <Draggable key={item.id} draggableId={item.address} index={index}>
  //             {(provided, snapshot) => (
  //               <div
  //                 ref={provided.innerRef}
  //                 {...provided.draggableProps}
  //                 {...provided.dragHandleProps}
  //                 style={getItemStyle(
  //                   snapshot.isDragging,
  //                   provided.draggableProps.style
  //                 )}
  //               >
  //                 <div className='account'>
  //                   <div className='name-icon'>
  //                     <RearrangePadsIcon className='arrange-icon' />
  //                     <FinnieIcon className='finnie-icon' />
  //                     <div className='account-name'>{item.accountName}</div>
  //                   </div>
  //                   <div className='account-address'>
  //                     {getDisplayAddress(item.address)}
  //                   </div>
  //                 </div>
  //               </div>
  //             )}
  //           </Draggable>
  //         ))}

  //         {provided.placeholder}
  //         <div
  //           style={{
  //             position: 'absolute',
  //             top: placeholderProps.clientY,
  //             left: placeholderProps.clientX,
  //             height: placeholderProps.clientHeight,
  //             background: '#F5F5F5 ',
  //             width: placeholderProps.clientWidth,
  //           }}
  //         />
  //       </div>
  //     )}
  //   </Droppable>
  // </DragDropContext>

    <div className='account-order'>
      {accounts.map((item, index) => (
        <div className='account'>
          <div className='name-icon'>
            <RearrangePadsIcon className='arrange-icon' />
            <FinnieIcon className='finnie-icon' />
            <div className='account-name'>{item.accountName}</div>
          </div>
          <div className='account-address'>
            {getDisplayAddress(item.address)}
          </div>
        </div>
      ))}
    </div>
  )
}
