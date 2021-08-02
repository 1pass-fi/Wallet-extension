import React, { useEffect, useMemo, useRef, useState } from 'react'
import get from 'lodash/get'

import CloseIcon from 'img/circle-close-icon-blue.svg'

import './index.css'

import { TYPE } from 'account/accountConstants'

const NETWORKS = {
  [TYPE.ETHEREUM]: {
    description: 'The default network for Ether transactions is Mainnet.',
    networks: [
      'Ethereum Mainnet',
      'Ropsten Test Network',
      'Kovan Test Network',
      'Rinkeby Test Network',
      'Goerli Test Network',
      'Localhost 8545',
      'Custom RPC',
    ],
  },
}

export default (networkType) => {
  const { networks = [], description = '' } = useMemo(
    () => get(NETWORKS, `${networkType}`, {}),
    [networkType]
  )
  const [selectedNetwork, setSelectedNetwork] = useState(get(networks, '0', ''))
  const [isShowModal, setIsShowModal] = useState(false)
  const ref = useRef()
  const toggleModal = () => {
    console.log(isShowModal)
    setIsShowModal(!isShowModal)
  }

  const onChangeNetwork = (network) => {
    setSelectedNetwork(network)
    toggleModal()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsShowModal(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  const modalTriggerComponent = (props) =>
    networks ? (
      <>
        <div
          {...props}
          onClick={toggleModal}
          className={`${get(props, 'className', '')}  network-modal-trigger`}
        >
          {selectedNetwork}
        </div>
        {modal()}
      </>
    ) : (
      <></>
    )

  const modal = () =>
    isShowModal ? (
      <div className='network-selection-wrapper'>
        <div className='network-selection-modal' ref={ref}>
          <div className='network-selection-title'>Networks</div>
          <div className='network-selection-description'>{description}</div>
          <div className='options'>
            {networks.map((network) => (
              <div
                onClick={() => onChangeNetwork(network)}
                key={network}
                className={`option ${
                  network === selectedNetwork ? 'active' : ''
                }`}
              >
                <div className='bubble'></div>
                {network}
              </div>
            ))}
          </div>

          <div className='close-button' onClick={toggleModal}>
            <CloseIcon />
          </div>
        </div>
      </div>
    ) : (
      <></>
    )

  return {
    NetworkSelection: modalTriggerComponent,
    selectedNetwork,
  }
}
