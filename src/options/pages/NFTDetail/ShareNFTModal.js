import React, { useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { PATH } from 'constants/koiConstants'
import Button from 'finnie-v2/components/Button'
import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import CopyIcon from 'img/v2/copy-icon-white.svg'
import EmbedIcon from 'img/v2/share-modal-icons/embed-icon.svg'
import FacebookIcon from 'img/v2/share-modal-icons/facebook-icon.svg'
import LinkedIn from 'img/v2/share-modal-icons/linkedin-icon.svg'
import MailIcon from 'img/v2/share-modal-icons/mail-icon.svg'
import TwitterIcon from 'img/v2/share-modal-icons/twitter-icon.svg'
import ShareIcon from 'img/v2/share-nft-icon.svg'
import { createShareWindow } from 'options/helpers'

const ShareNFTModal = ({ txId, close }) => {
  const [isCopied, setIsCopied] = useState(false)
  const modalRef = useRef(null)
  const [showEmbedLink, setShowEmbedLink] = useState(false)

  const shareUrl = `${PATH.KOII_LIVE}/${txId}.html`
  const embedUrl = `<iframe width="100%" src="https://koi.rocks/embed/${txId}" title="Koii NFT image" frameborder="0" allowfullscreen></iframe>`

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    const handlePressingEsc = (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handlePressingEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
    }
  }, [modalRef])

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '586px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" />
          <div className="m-auto">Share to earn Attention Rewards</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        <div className="mt-7 w-115 text-sm tracking-finnieSpacing-tight text-center">
          Earn attention rewards forever through Koii. Copy this link and share on your favorite
          social platforms.
        </div>
        <div className="mt-4 text-base font-bold leading-7">
          {showEmbedLink ? 'Embed Link' : 'Share Link'}
        </div>
        {showEmbedLink ? (
          <textarea
            style={{ height: '92px', width: '386px' }}
            className="flex items-center justify-center px-2 mt-1.5 mb-5 border-2 border-indigo text-sm tracking-finnieSpacing-tight"
            disabled
          >
            {embedUrl}
          </textarea>
        ) : (
          <div
            style={{ height: '32px' }}
            className="truncate hover:text-clip flex items-center justify-center px-2 mt-1.5 mb-5 border-2 border-indigo text-sm tracking-finnieSpacing-tight"
          >
            {shareUrl}
          </div>
        )}

        <CopyToClipboard text={showEmbedLink ? embedUrl : shareUrl}>
          <Button
            style={{ width: '200px', height: '40px' }}
            className="text-base"
            text={isCopied ? 'Copied' : 'Copy Link'}
            variant="indigo"
            icon={CopyIcon}
            size={'md'}
            onClick={() => setIsCopied(true)}
          />
        </CopyToClipboard>

        <div className="flex w-77.25 m-auto mt-7.5 justify-between pb-8">
          <div className="cursor-pointer" onClick={() => createShareWindow('twitter', txId)}>
            <TwitterIcon />
          </div>
          <div className="cursor-pointer" onClick={() => createShareWindow('facebook', txId)}>
            <FacebookIcon />
          </div>
          {/* <div className="cursor-pointer" onClick={() => createShareWindow('linkedin', txId)}>
            <LinkedIn />
          </div> */}
          <a
            href={`mailto:?subject=Check out my NFT, now stored on Koii— forever!&body=https://koii.live/content-detail/${txId}`}
            title="Share by Email"
          >
            <MailIcon />
          </a>
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowEmbedLink((prev) => !prev)
              setIsCopied(false)
            }}
          >
            {showEmbedLink ? <ShareIcon /> : <EmbedIcon />}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ShareNFTModal
