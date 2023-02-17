import React, { useContext, useEffect,useState } from 'react'
import { DragDropContext, Draggable,Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { TYPE } from 'constants/accountConstants'
import EthereumIcon from 'img/ethereum-logo-18.svg'
import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import RearrangePadsIcon from 'img/rearrange-pads-icon.svg'
import SolanaIcon from 'img/v2/solana-logo.svg'
import get from 'lodash/get'
import { setDefaultAccountByAddress } from 'options/actions/defaultAccount'
import { setError } from 'options/actions/error'
import { setQuickNotification } from 'options/actions/quickNotification'
import { GalleryContext } from 'options/galleryContext'
import { getDisplayAddress } from 'options/utils'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'

import './index.css'

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
  ...draggableStyle
})

const getListStyle = (isDraggingOver) => ({
  background: '#F5F5F5',
  paddingTop: 9,
  paddingBottom: 1,
  width: 376,
  position: 'relative'
})

const queryAttr = 'data-rbd-drag-handle-draggable-id'

export default ({ accounts, setAccounts }) => {
  const dispatch = useDispatch()

  const [placeholderProps, setPlaceholderProps] = useState({})
  const { getDID } = useContext(GalleryContext)
  const [selectedAddress, setSelectedAddress] = useState()
  const [selectedEthAddress, setSelectedEthAddress] = useState()

  const defaultAccount = useSelector((state) => state.defaultAccount.AR)
  const defaultEthAccount = useSelector((state) => state.defaultAccount.AR)

  useEffect(() => {
    setSelectedAddress(get(defaultAccount, 'address', ''))
  }, [defaultAccount])

  useEffect(() => {
    setSelectedEthAddress(get(defaultEthAccount, 'address', ''))
  }, [defaultEthAccount])

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    setPlaceholderProps({})
    setAccounts((accounts) => reorder(accounts, result.source.index, result.destination.index))
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
      [...draggedDOM.parentNode.children].slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr)
        const marginBottom = parseFloat(style.marginBottom)
        return total + curr.clientHeight + marginBottom
      }, 0)

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft)
    })
  }

  const reloadDefaultAccount = async () => {
    const activatedArweaveAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
    dispatch(setDefaultAccountByAddress(activatedArweaveAccountAddress))

    const defaultK2AccountAddress = await storage.setting.get.activatedK2AccountAddress()
    dispatch(setDefaultAccountByAddress(defaultK2AccountAddress))

    const activatedEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
    dispatch(setDefaultAccountByAddress(activatedEthereumAccountAddress))

    const defaultSolanaAccountAddress = await storage.setting.get.activatedSolanaAccountAddress()
    dispatch(setDefaultAccountByAddress(defaultSolanaAccountAddress))
  }

  const handleSetDefaultAccount = async (address) => {
    try {
      await backgroundRequest.gallery.setDefaultAccount({ address })
      await reloadDefaultAccount()
      getDID()
      setSelectedAddress(address)
      dispatch(setQuickNotification(chrome.i18n.getMessage('setDefaultAccount')))
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  return (
    <div className="account-order">
      <div className="account-header">{chrome.i18n.getMessage('DEFAULT')}</div>
      {accounts.map((item, index) => (
        <div className="account" key={item.address}>
          <div className="name-icon">
            {/* <RearrangePadsIcon className='arrange-icon' /> */}
            <div
              onClick={() => handleSetDefaultAccount(item.address)}
              className={`set-default-checkbox ${
                selectedAddress === item.address || selectedEthAddress === item.address
                  ? 'active'
                  : ''
              }`}
            ></div>
            {item.type == TYPE.ARWEAVE && <FinnieIcon className="finnie-icon" />}
            {item.type == TYPE.K2 && <FinnieIcon className="finnie-icon" />}
            {item.type == TYPE.ETHEREUM && <EthereumIcon className="finnie-icon" />}
            {item.type == TYPE.SOLANA && <SolanaIcon className="finnie-icon" />}
            <div className="account-name">{item.accountName}</div>
          </div>
          <div className="account-address">{getDisplayAddress(item.address)}</div>
        </div>
      ))}
    </div>
  )
}
