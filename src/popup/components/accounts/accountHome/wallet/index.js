import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import './index.css'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import Card from 'shared/card'
import CopyIcon from 'img/copy-icon.svg'
import EditIcon from 'img/edit-icon.svg'
import Fish from 'img/fish.svg'
import ShareIconOne from 'img/wallet/share-icon.svg'
import ShareIconTwo from 'img/wallet/share2-icon.svg'
import KeyIcon from 'img/wallet/key-icon.svg'
import DeleteIcon from 'img/wallet/delete-icon.svg'
import RemoveAccountModal from 'shared/modal/removeAccountModal'
import RemoveConnectedSite from 'popup/components/modals/removeConnectedSites'

import { removeWallet, lockWallet, getKeyFile } from 'actions/koi'
import { setNotification } from 'actions/notification'
import { getChromeStorage, deleteOriginFromChrome } from 'utils'
import { STORAGE, NOTIFICATION, RATE, PATH } from 'koiConstants'
import ExportPrivateKeyModal from './exportPrivateKeyModal'

const WalletInfo = ({
  accountName,
  accountAddress,
  koiBalance,
  arBalance,
  setNotification,
}) => {
  const numberFormat = (num) => {
    return num === null ? '---' : new Intl.NumberFormat('en-US').format(num)
  }
  return (
    <div className='wallet-info'>
      <div className='wallet-info-row'>
        <div>
          <div className='name'>
            <div>{accountName}</div>
            <EditIcon />
          </div>
          <div className='addr'>
            <div>{`${accountAddress.slice(0, 6)}...${accountAddress.slice(
              accountAddress.length - 4
            )}`}</div>
            <div onClick={() => setNotification(NOTIFICATION.COPIED)}>
              <CopyToClipboard text={accountAddress}>
                <CopyIcon />
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div>
      <div className='wallet-info-row wallet-balance'>
        <div className='koi-balance'>
          <div className='balance'>{numberFormat(koiBalance)} KOI</div>
          {
            <div className='usd-exchange'>
              ~${numberFormat(koiBalance * RATE.KOI)}USD
            </div>
          }
        </div>
        <div className='ar-balance'>
          <div className='balance'>{numberFormat(arBalance)} AR</div>
          {
            <div className='usd-exchange'>
              ~${numberFormat(arBalance * RATE.AR)}USD
            </div>
          }
        </div>
      </div>
    </div>
  )
}

const WalletConfItem = ({ icon, title, onClick, className }) => {
  return (
    <div className={'wallet-conf-item ' + className} onClick={onClick}>
      {icon}
      <p>{title}</p>
    </div>
  )
}

const WalletConf = ({
  handleRemoveWallet,
  handleGetKeyFile,
  accountAddress,
  sites,
  handleDeleteSite,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [showModalConnectedSite, setShowModalConnectedSite] = useState(false)
  const [showExportKeyModal, setShowExportKeyModel] = useState(false)

  const onExportClick = () => {
    handleGetKeyFile()
  }

  return (
    <div className='wallet-conf'>
      <WalletConfItem
        icon={<ShareIconOne />}
        title={'View Block Explorer'}
        onClick={() => {
          const url = `${PATH.VIEW_BLOCK}/${accountAddress}`
          chrome.tabs.create({ url })
        }}
      />
      <WalletConfItem
        icon={<KeyIcon />}
        title={'Export Private Key'}
        onClick={() => setShowExportKeyModel(true)}
      />
      <WalletConfItem
        className=''
        icon={<ShareIconTwo />}
        title='See Connected Sites'
        onClick={() => setShowModalConnectedSite(true)}
      />
      <WalletConfItem
        className='delete-wallet'
        icon={<DeleteIcon />}
        title='Remove Account'
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <RemoveAccountModal
          accountName='Account 1'
          accountAddress={accountAddress}
          onClose={() => setShowModal(false)}
          onSubmit={handleRemoveWallet}
        />
      )}
      {showModalConnectedSite && (
        <RemoveConnectedSite
          sites={sites}
          accountName='Account 1'
          handleDeleteSite={handleDeleteSite}
          onClose={() => setShowModalConnectedSite(false)}
        />
      )}
      {showExportKeyModal && <ExportPrivateKeyModal setShowExportKeyModel={setShowExportKeyModel}/>}
    </div>
  )
}

export const Wallet = ({
  accountAddress,
  koiBalance,
  arBalance,
  removeWallet,
  getKeyFile,
  setNotification,
}) => {
  const history = useHistory()
  const [connectedSite, setConnectedSite] = useState([])
  const handleRemoveWallet = () => removeWallet({ history })

  const handleDeleteSite = async (site) => {
    await deleteOriginFromChrome(site)
    const connectedSite = (await getChromeStorage(STORAGE.SITE_PERMISSION))[
      STORAGE.SITE_PERMISSION
    ]
    setConnectedSite(connectedSite)
  }

  useEffect(() => {
    const getConnectedSite = async () => {
      let connectedSite = (await getChromeStorage(STORAGE.SITE_PERMISSION))[
        STORAGE.SITE_PERMISSION
      ]
      if (!connectedSite) connectedSite = []
      setConnectedSite(connectedSite)
    }

    getConnectedSite()
  })

  return (
    <div className='wallet'>
      <div className='wallet fish'>
        <Fish />
      </div>
      <div className='wallet-wrapper'>
        <WalletInfo
          accountName={'Account #1'}
          accountAddress={accountAddress}
          koiBalance={koiBalance}
          arBalance={arBalance}
          setNotification={setNotification}
        />
        <Card className='address'>{accountAddress}</Card>
        <WalletConf
          accountAddress={accountAddress}
          sites={connectedSite}
          handleDeleteSite={handleDeleteSite}
          handleRemoveWallet={handleRemoveWallet}
        />
      </div>
    </div>
  )
}

export default connect(null, {
  removeWallet,
  lockWallet,
  getKeyFile,
  setNotification,
})(Wallet)
