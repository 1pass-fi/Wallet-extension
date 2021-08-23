import React, { useState } from 'react'
import get from 'lodash/get'

import QuestionIcon from 'img/startup/question-mark.svg'

import './index.css'

export default ({ title: Title, description: Description }) => {
  const networks = [
    'Ethereum Mainnet',
    'Ropsten Test Network',
    'Kovan Test Network',
    'Rinkeby Test Network',
    'Goerli Test Network',
    'Localhost 8545',
    'Custom RPC',
  ]

  const [selectedNetwork, setSelectedNetwork] = useState(get(networks, '0', ''))

  const component = ({ onSubmit }) => (
    <>
      <Title />
      <Description />
      <div className='default-network'>
        <QuestionIcon className='question-icon' /> The default network for Ether
        transactions is&nbsp;
        <span>Mainnet.</span>
      </div>
      <div className='network-options'>
        {networks.map((network) => (
          <div
            onClick={() => setSelectedNetwork(network)}
            key={network}
            className={`option ${network === selectedNetwork ? 'active' : ''}`}
          >
            <div className='bubble'></div>
            {network}
          </div>
        ))}
      </div>
      <div onClick={onSubmit} className='submit-network-button'>Select Network</div>
    </>
  )

  return {
    EthereumNetworks: component,
    selectedNetwork,
  }
}
