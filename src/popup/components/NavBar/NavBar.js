import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { TYPE } from 'constants/accountConstants'
import { URL } from 'constants/koiConstants'
import AddIcon from 'img/popup/add-icon.svg'
import BrowserComponentIcon from 'img/popup/browser-component.svg'
import ExploreBlockIcon from 'img/popup/explore-block-icon.svg'
import GalleryIcon from 'img/popup/gallery-icon.svg'
import LeaderboardIcon from 'img/popup/leaderboard-icon.svg'
import LockIcon from 'img/popup/lock-icon.svg'
import GlobeIcon from 'img/wallet-connect/globe-icon.svg'
import get from 'lodash/get'
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'
import { getEthNetworkMetadata } from 'services/getNetworkMetadata'
import storage from 'services/storage'

const NavBar = ({ handleLockWallet }) => {
  const history = useHistory()
  const displayingAccount = useSelector(getDisplayingAccount)

  const goToGallery = () => {
    const url = chrome.runtime.getURL('options.html#/gallery')
    chrome.tabs.create({ url })
  }

  const goToWalletConnect = () => {
    history.push('/wallet-connect-proposal')
  }

  const goToKoiiNetwork = () => {
    const url = 'https://www.koii.network/'
    chrome.tabs.create({ url })
  }

  const goToExploreBlock = async () => {
    const getEthBlockUrl = async () => {
      const ethProvider = await storage.setting.get.ethereumProvider()
      const metadata = await getEthNetworkMetadata(ethProvider)
      const blockUrl = get(metadata, 'blockExplorerUrl')

      return `${blockUrl}address`
    }

    try {
      console.log('displayingAccount', displayingAccount)
      let baseUrl
      switch (displayingAccount.type) {
        case TYPE.K2:
          baseUrl = 'https://explorer.koii.live/address'
          break
        case TYPE.ARWEAVE:
          baseUrl = 'https://viewblock.io/arweave/address'
          break
        case TYPE.ETHEREUM:
          baseUrl = await getEthBlockUrl()
          break
      }

      if (displayingAccount.type !== TYPE.SOLANA) chrome.tabs.create({ url: `${baseUrl}/${displayingAccount.address}` })
      else {
        const solanaProvider = await storage.setting.get.solanaProvider()
        const solanaBlockUrl = `${URL.SOLANA_EXPLORE}/address/${displayingAccount.address}?cluster=${solanaProvider}`

        chrome.tabs.create({ url: solanaBlockUrl })
      }

    } catch (err) {
      console.error('goToExploreBlock', err)
    }
  }

  return (
    <div
      className="flex items-center justify-between fixed bottom-0 px-0.7 w-full px-0.5"
      style={{ height: '64px', backgroundColor: '#4e4e7e' }}
    >
      <div
        className="cursor-pointer rounded-bl-md"
        style={{ width: '139px', height: '58px', backgroundColor: '#353570' }}
        onClick={goToKoiiNetwork}
      >
        <BrowserComponentIcon className="mx-auto mt-1" style={{ width: '36px', height: '36px' }} />
        <div style={{lineHeight: '13px'}} className="text-center text-white text-2xs">KOII NETWORK</div>
      </div>
      <div
        className="bg-blue-800 cursor-pointer"
        style={{ width: '139px', height: '58px', backgroundColor: '#353570' }}
        onClick={goToExploreBlock}
      >
        <ExploreBlockIcon className="mx-auto mt-1" style={{ width: '36px', height: '36px'}}/>
        <div style={{lineHeight: '13px'}} className="text-center text-white text-2xs">EXPLORE BLOCK</div>
      </div>
      <div
        className="bg-blue-800 cursor-pointer rounded-br-md"
        style={{ width: '139px', height: '58px', backgroundColor: '#353570' }}
        onClick={handleLockWallet}
      >
        <LockIcon className="mx-auto mt-1" style={{ width: '18px', height: '36px' }} />
        <div style={{lineHeight: '13px'}} className="text-center text-white text-2xs">{chrome.i18n.getMessage('lockUc')}</div>
      </div>
    </div>
  )
}

export default NavBar
