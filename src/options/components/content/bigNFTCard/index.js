import React, {
  useState,
  useContext,
  useMemo,
} from 'react'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'

import ArweaveLogo from 'img/arweave-icon.svg'

import EthereumLogo from 'img/chain/ethereum-logo.svg'
import BinanceLogo from 'img/chain/binance-logo.svg'
import Avalanche from 'img/chain/avalanche-logo.svg'
import PolkadotLogo from 'img/chain/polkadot-logo.svg'
import TezosLogo from 'img/chain/tezos-logo.svg'
import DfinityLogo from 'img/chain/dfinity-logo.svg'

import EmailIcon from 'img/social-icons/email-icon.svg'
import FacebookIcon from 'img/social-icons/facebook-icon.svg'
import LinkedinIcon from 'img/social-icons/linkedin-icon.svg'
import TwitterIcon from 'img/social-icons/twitter-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import EmbedIcon from 'img/embed-btn.svg'

import { createShareWindow } from '../../../helpers'

import { GalleryContext } from 'options/galleryContext'

import './index.css'
import { formatNumber } from '../../../utils'
import { TYPE } from 'constants/accountConstants'

export default ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  koiRockUrl,
  contentType,
  totalViews,
  createdAt,
  description,
  pending,
  type,
  address,
  expired,
  locked,
  tokenAddress,
  tokenSchema,
  isBridging
}) => {
  const history = useHistory()
  const {
    setShowExportModal,
    setShowShareModal,
    showViews,
    showEarnedKoi,
    handleShareNFT
  } = useContext(GalleryContext)
  const [isCopied, setIsCopied] = useState(false)
  const [isShowChain, setIsShowChain] = useState(false)
  const [isShowExport, setIsShowExport] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const { registeredDate, tags } = {
    registeredDate: moment(createdAt * 1000).format('MMMM Do, YYYY'),
    tags: ['crypto', 'puppies', 'electropop', 'cubism'],
  }

  const embed = useMemo(
    () =>
      `<iframe width="100%" src="https://koi.rocks/embed/${txId}" title="Koii NFT image" frameborder="0" allowfullscreen></iframe>`,
    [txId]
  )
  
  const isDisableFeatures = isBridging || type !== TYPE.ARWEAVE

  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const handleToggleMessage = () => {
    if(type !== TYPE.ARWEAVE && !isBridging) {
      setShowMessage(prev => !prev)
    } else {
      setShowMessage(false)
    }
  }

  const handleGoBack = () => {
    if (history.length > 1) return history.goBack()
    history.push('/')
  }

  return (
    <div className='big-nft-card-wrapper'>
      <div className='big-nft-card'>
        <div data-tip='Back' onClick={handleGoBack} className='go-back-icon'>
          <GoBackIcon />
        </div>
        <div className='nft-preview'>
          {contentType.includes('image') && (
            <img src={imageUrl} className='nft-img' />
          )}
          {contentType.includes('video') && (
            <video
              width={320}
              height={240}
              src={imageUrl}
              className='nft-img'
              controls
              autoPlay
            />
          )}
          {contentType.includes('html') && (
            <div className='nft-img-iframe'>
              <div className='iframe-wrapper'>
                <iframe frameBorder="0" src={imageUrl} />
              </div>
            </div>
          )}
        </div>
        <div className='info'>
          <div className='nft-name'>{name}</div>
          {!pending && <div className='export-nft'>
            {(type === TYPE.ARWEAVE && !isBridging) && <div className='wallet-icon'
              onMouseOver={() => { setIsShowChain(true) }}
              onMouseLeave={() => { setIsShowChain(false) }}>
              <ArweaveLogo />
            </div>}
            {(type === TYPE.ETHEREUM && !isBridging) && <div className='wallet-icon'
              onMouseOver={() => { setIsShowChain(true) }}
              onMouseLeave={() => { setIsShowChain(false) }}>
              <EthereumLogo />
            </div>}


            {isBridging && <div className='transfer-nft-wrapper'>
              <span className='overlapped-icons'>
                <div className='overlapped-ar'>
                  <ArweaveLogo />
                </div>
                <div className='overlapped-eth'>
                  <EthereumLogo />
                </div>
              </span>
              This NFT is being transferred to {type === TYPE.ARWEAVE ? 'Ethereum' : 'Arweave'}.
            </div>}
            {!isBridging && (isShowChain || isShowExport ?
              <div className='transfer-nft' onMouseLeave={() => { setIsShowChain(false) }}>
                <div className='transfer-nft-wrapper'>
                  <div className='transfer-text'>Transfer to</div>
                  <div className='wallet-logo' onClick={() => setShowExportModal({ locked, earnedKoi, totalViews, name, imageUrl, type, txId, address, tokenAddress, tokenSchema })}>
                    {type === TYPE.ARWEAVE &&
                      <>
                        <EthereumLogo className='logo' />
                        <div className='text'>Ethereum</div>
                      </>}
                    {type === TYPE.ETHEREUM &&
                      <>
                        <ArweaveLogo className='logo' />
                        <div className='text'>Arweave</div>
                      </>}
                  </div>
                </div>

                <div className='other-chains'>
                  <div className='coming-soon'>Coming soon:</div>
                  <div className='chains-container'>
                    <TezosLogo data-tip='Tezos' className='logo' />
                    <Avalanche data-tip='Avalanche' className='logo' />
                    <BinanceLogo data-tip='Binance Smartchain' className='logo' />
                    <PolkadotLogo data-tip='Polkadot' className='logo' />
                    <DfinityLogo data-tip='Dfinity' className='logo' />
                  </div>
                  <ReactTooltip place='top' type="dark" effect="float" />
                </div>
              </div>
              :
              <>
                <div className='transfer-text' >
                  <div onMouseOver={() => { setIsShowChain(true) }} >
                    Transfer this NFT to a&nbsp;
                  </div>
                  <span
                    onClick={() => {
                      setIsShowChain(true)
                      setIsShowExport(true)
                    }}
                    className='different-chain'
                  >
                    different chain
                  </span>
                  .
                </div>
              </>)
            }
          </div>}
          <div className='registered-date'>Registered: {registeredDate}</div>
          <div className='external-links'>
            <a
              className={`external-link ${isDisableFeatures && 'disabled'}`}
              href={`https://viewblock.io/arweave/tx/${txId}`}
              target='_blank'
            >
              {pending ? 'pending transaction' : 'explore block'}
            </a>
            {!pending && <a className={`external-link koii ${isDisableFeatures && 'disabled'}`} href={koiRockUrl} target='_blank'>
              koi.rocks
            </a>}
          </div>
          <div className='description'>{description}</div>
          {!pending && <div className={`earned ${isDisableFeatures && 'disabled'}`}>
            {showViews && (
              <div className='views'>
                {totalViews} {totalViews > 1 ? 'views' : 'view'}
              </div>
            )}
            {showEarnedKoi && (
              <div className='koi '>{formatNumber(earnedKoi)} KOII earned</div>
            )}
          </div>}
          {!pending && <div className='share-transfer' onMouseEnter={handleToggleMessage} onMouseLeave={handleToggleMessage}>
            {showMessage && <div className='disabled-msg'>
              Some of Finnie’s features are still in development for other blockchains.
            </div>}
            <button
              className='share-button'
              onClick={() => {
                setShowShareModal({ show: true, txid: txId })
              }}
              disabled={isDisableFeatures}
            >
              Share
            </button>
            <button onClick={() => handleShareNFT(txId)} className='transfer-button' disabled={isDisableFeatures}>
              Send
            </button>
          </div>}
          {!pending && txId && <div className={`social-icons ${isDisableFeatures && 'disabled'}`}>
            <TwitterIcon
              onClick={() => {
                createShareWindow('twitter', txId)
              }}
              className='social-icon'
            />
            <FacebookIcon
              onClick={() => {
                createShareWindow('facebook', txId)
              }}
              className='social-icon'
            />
            <LinkedinIcon
              onClick={() => {
                createShareWindow('linkedin', txId)
              }}
              className='social-icon'
            />
            <a
              className={isDisableFeatures && 'disabled'}
              href={`mailto:?subject=Check out my NFT, now stored on Koii— forever!&body=https://koii.live/${txId}.html`}
              title='Share by Email'
            >
              <EmailIcon className='social-icon' />
            </a>
            <CopyToClipboard text={embed}>
              <EmbedIcon onClick={onCopy} className='social-icon' disabled={!txId} />
            </CopyToClipboard>
            {isCopied && <div className='copy-noti'>Link copied!</div>}
          </div>}
        </div>
      </div>
      <ReactTooltip place='top' type="dark" effect="float" />
    </div>
  )
}
