import React, {
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import moment from 'moment'

import ArweaveIcon from 'img/arweave-icon.svg'
import EmailIcon from 'img/social-icons/email-icon.svg'
import FacebookIcon from 'img/social-icons/facebook-icon.svg'
import LinkedinIcon from 'img/social-icons/linkedin-icon.svg'
import TwitterIcon from 'img/social-icons/twitter-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'

import { createShareWindow } from '../../../helpers'

import { GalleryContext } from 'options/galleryContext'

import './index.css'
import { formatNumber } from '../../../utils'

export default ({
  txId,
  name,
  imageUrl,
  earnedKoi,
  isRegistered,
  koiRockUrl,
  setChoosen,
  contentType,
  totalViews,
  createdAt,
  description,
  pending,
  type,
  address
}) => {
  const history = useHistory()
  const {
    setShowExportModal,
    setShowShareModal,
    showViews,
    showEarnedKoi,
  } = useContext(GalleryContext)
  const [isCopied, setIsCopied] = useState(false)
  const { registeredDate, tags } = {
    registeredDate: moment(createdAt * 1000).format('MMMM Do, YYYY'),
    tags: ['crypto', 'puppies', 'electropop', 'cubism'],
  }

  const embed = useMemo(
    () =>
      `<iframe width="100%" src="https://koi.rocks/embed/${txId}" title="Koi NFT image" frameborder="0" allowfullscreen></iframe>`,
    [txId]
  )

  const onCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const handleGoBack = () => {
    history.goBack()
  }

  return (
    <div className='big-nft-card-wrapper'>
      <div className='big-nft-card'>
        <div className='nft-preview'>
          {contentType.includes('image') ? (
            <img src={imageUrl} className='nft-img' />
          ) : (
            <video
              width={320}
              height={240}
              src={imageUrl}
              className='nft-img'
              controls
              autoPlay
            />
          )}
          <div onClick={handleGoBack} className='go-back-icon'>
            <GoBackIcon />
          </div>
        </div>
        <div className='info'>
          <div className='nft-name'>{name}</div>
          {!pending && <div className='export-nft'>
            <ArweaveIcon className='arweave-icon' />
            Export this NFT to a&nbsp;
            <span
              onClick={() => {
                setShowExportModal({ earnedKoi, totalViews, name, imageUrl, type, txId, address })
              }}
              className='different-chain'
            >
              different chain
            </span>
            .
          </div>}
          <div className='registered-date'>Registered: {registeredDate}</div>
          <div className='external-links'>
            <a
              className='external-link'
              href={`https://viewblock.io/arweave/tx/${txId}`}
              target='_blank'
            >
              {pending ? 'pending transaction' : 'explore block'}
            </a>
            {!pending && <a className='external-link' href={koiRockUrl} target='_blank'>
              koi.rocks
            </a>}
          </div>
          <div className='description'>{description}</div>
          {/* <div className='tags'>
            {tags.map((tag, index) => (
              <div key={index} className='tag-item'>
                {tag}
              </div>
            ))}
          </div> */}
          {!pending && <div className='earned'>
            {showViews && (
              <div className='views'>
                {totalViews} {totalViews > 1 ? 'views' : 'view'}
              </div>
            )}
            {showEarnedKoi && (
              <div className='koi '>{formatNumber(earnedKoi)} KOII earned</div>
            )}
          </div>}
          {!pending && <div className='share-embed'>
            <button
              className='share-button'
              onClick={() => {
                setShowShareModal({ show: true, txid: txId })
              }}
            >
              Share
            </button>
            {isCopied && <div className='copy-noti'>Link copied!</div>}
            <CopyToClipboard text={embed}>
              <button onClick={onCopy} className='embed-button'>
                Embed
              </button>
            </CopyToClipboard>
          </div>}
          {!pending && <div className='social-icons'>
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
              href={`mailto:?subject=Check out my NFT, now stored on Koi— forever!&body=https://koi.rocks/content-detail/${txId}`}
              title='Share by Email'
            >
              <EmailIcon className='social-icon' />
            </a>
          </div>}
        </div>
      </div>
    </div>
  )
}
