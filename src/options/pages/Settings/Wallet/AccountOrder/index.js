import React, { useState, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import get from 'lodash/get'

import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import EthereumIcon from 'img/ethereum-logo-18.svg'
import RearrangePadsIcon from 'img/rearrange-pads-icon.svg'
import { getDisplayAddress } from 'options/utils'
import storage from 'services/storage'

import './index.css'
import { GalleryContext } from 'options/galleryContext'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { popupAccount } from 'services/account'
import { TYPE } from 'constants/accountConstants'
import { setDefaultAccountByAddress } from 'options/actions/defaultAccount'

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
  const { setNotification, setError, getDID } = useContext(GalleryContext)
  const [selectedAddress, setSelectedAddress] = useState()

  const dispatch = useDispatch()
  const defaultAccount = useSelector(state => state.defaultAccount)

  useEffect(() => {
    setSelectedAddress(get(defaultAccount, 'address', ''))
  }, [defaultAccount])

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
    const activatedArweaveAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
    dispatch(setDefaultAccountByAddress(activatedArweaveAccountAddress))

    const activatedEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
    dispatch(setDefaultAccountByAddress(activatedEthereumAccountAddress))
  }

  const handleSetDefaultAccount = async (address) => {
    try {
      await backgroundRequest.gallery.setDefaultAccount({ address })
      await reloadDefaultAccount()
      getDID()
      setSelectedAddress(address)
      setNotification(`Set default account successfully.`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='account-order'>
      <div className='account-header'>DEFAULT</div>
      {accounts.map((item, index) => (
        <div className='account' key={item.address}>
          <div className='name-icon'>
            {/* <RearrangePadsIcon className='arrange-icon' /> */}
            <div
              onClick={() => handleSetDefaultAccount(item.address)}
              className={`set-default-checkbox ${
                selectedAddress === item.address ? 'active' : ''
              }`}
            ></div>
            {item.type == TYPE.ARWEAVE && <FinnieIcon className='finnie-icon' />}
            {item.type == TYPE.ETHEREUM && <EthereumIcon className='finnie-icon' />}
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
