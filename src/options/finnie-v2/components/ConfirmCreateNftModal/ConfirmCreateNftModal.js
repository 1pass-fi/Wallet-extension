import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import { FRIEND_REFERRAL_ENDPOINTS, SOCIAL_NETWORKS } from 'constants/koiConstants'
import Button from 'finnie-v2/components/Button'
import NFTMedia from 'finnie-v2/components/NFTMedia'
import formatLongString, { formatLongStringTruncate } from 'finnie-v2/utils/formatLongString'
import formatNumber from 'finnie-v2/utils/formatNumber'
import shareSocialNetwork from 'finnie-v2/utils/shareSocialNetwork'
import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import CrossIcon from 'img/v2/cross-icon-white.svg'
import ModalBackground from 'img/v2/modal-background.svg'
import EmbedIcon from 'img/v2/share-modal-icons/embed-icon.svg'
import FacebookIcon from 'img/v2/share-modal-icons/facebook-icon.svg'
import LinkedIn from 'img/v2/share-modal-icons/linkedin-icon.svg'
import MailIcon from 'img/v2/share-modal-icons/mail-icon.svg'
import ShareIcon from 'img/v2/share-modal-icons/share-icon.svg'
import TwitterIcon from 'img/v2/share-modal-icons/twitter-icon.svg'
import isEmpty from 'lodash/isEmpty'
import { setError } from 'options/actions/error'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import { GalleryContext } from 'options/galleryContext'
import { popupAccount } from 'services/account'
import arweave from 'services/arweave'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'
import { v4 as uuid } from 'uuid'

import './ConfirmCreateNftModal.css'

const ConfirmCreateNftModal = ({ nftContent, tags, fileType, url, close, resetState }) => {
  const dispatch = useDispatch()

  const estimateCostKOII = 1
  const [step, setStep] = useState(1)
  const [estimateCostAr, setEstimateCostAr] = useState(0)
  const [disableCreateNFT, setDisableCreateNFT] = useState(false)
  const [nftId, setNftId] = useState(null)
  const [showShareLink, setShowShareLink] = useState(true)

  const [showReferralField, setShowReferralField] = useState(false)
  const [referralCodeError, setReferralCodeError] = useState(null)
  const [referralCode, setReferralCode] = useState(null)
  const [confirmedCode, setConfirmedCode] = useState(false)

  const modalRef = useRef(null)

  const defaultAccount = useSelector((state) => state.defaultAccount.AR)

  const handleUploadNFT = async () => {
    try {
      // set isLoading
      setDisableCreateNFT(true)
      dispatch(setIsLoading)

      const account = await popupAccount.getAccount({ address: defaultAccount.address })
      const arBalance = await account.get.balance()
      const koiBalance = await account.get.koiBalance()

      if (estimateCostKOII > koiBalance) throw new Error('Not enough KOII')
      if (estimateCostAr > arBalance) throw new Error('Not enough AR')

      const response = await fetch(url)
      const blob = await response.blob()
      const dataBuffer = await blob.arrayBuffer()

      let u8 = new Int8Array(dataBuffer)
      u8 = JSON.stringify(u8, null, 2)

      const imageId = uuid()

      await storage.generic.set.nftBitData({ bitObject: u8, imageId })

      const content = {
        title: nftContent.title,
        owner: nftContent.owner,
        description: nftContent.description,
        isNSFW: nftContent.isNSFW
      }

      const { txId } = await backgroundRequest.gallery.uploadNFT({
        content,
        tags,
        fileType,
        address: defaultAccount.address,
        price: estimateCostAr,
        imageId
      })

      if (txId) setStep(2)
      setNftId(txId)
      resetState()
      // set isLoading
      dispatch(setLoaded)
      setDisableCreateNFT(false)
    } catch (err) {
      console.error(err.message)
      // set Error
      dispatch(setError(err.message))
      dispatch(setLoaded)
      setDisableCreateNFT(false)
    }
  }

  const handleSubmitReferralCode = async () => {
    try {
      dispatch(setIsLoading)
      const result = await backgroundRequest.gallery.friendReferral({
        endpoints: FRIEND_REFERRAL_ENDPOINTS.SUBMIT_CODE,
        friendCode: referralCode
      })
      switch (result?.status) {
        case 201:
          setShowReferralField(false)
          setConfirmedCode(true)
          break
        case 200:
          setReferralCodeError('Affiliate Invite already exists')
          break
        case 422:
          setReferralCodeError('Incorrect Referral code')
          break
        default:
          setReferralCodeError('Network error')
      }
      dispatch(setLoaded)
    } catch (err) {
      console.error(err.message)
      dispatch(setLoaded)
    }
  }

  useEffect(() => {
    const getPrice = async () => {
      const response = await fetch(url)
      const blob = await response.blob()
      const length = await (await blob.arrayBuffer()).byteLength

      const arPrice = await arweave.transactions.getPrice(length)
      setEstimateCostAr(arweave.ar.winstonToAr(arPrice))
    }

    getPrice()
  }, [])

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

  const shareLink = useMemo(() => {
    return `https://koii.live/${nftId}.html`
  }, [nftId])

  const embedLink = useMemo(() => {
    return `https://koi.rocks/embed/${nftId}" title="Koii NFT image" frameborder="0" allowfullscreen></iframe>`
  }, [nftId])

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        className="w-146.5 min-h-103 rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          {step === 1 && (
            <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" />
          )}
          {step === 1 && <div className="m-auto">Create Your Atomic NFT</div>}
          {step === 2 && <div className="m-auto">You just made a new NFT!</div>}
          {step === 3 && <div className="m-auto">Share to earn Attention Rewards</div>}

          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>
        {step === 1 && (
          <>
            <div className="mt-4.25 w-115 text-sm tracking-finnieSpacing-tight text-center">
              Atomic NFTs are stored permanently on Arweave. With Koii, they earn attention rewards
              forever.
            </div>
            <div className="flex min-w-108 mt-4.25 justify-evenly">
              <div className="w-40 h-40 object-cover rounded">
                <NFTMedia contentType={fileType} source={url} />
              </div>

              <div className="flex flex-col pl-6 min-w-68 max-w-sm">
                <div className="font-semibold text-base tracking-finnieSpacing-wide leading-6">
                  {formatLongStringTruncate(nftContent.title, 25)}
                </div>
                <div className="text-sm tracking-finnieSpacing-tight leading-5">
                  {formatLongStringTruncate(nftContent.description, 32)}
                </div>
                <div className="max-h-9 w-full flex flex-wrap gap-1 overflow-y-scroll">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="max-h-3.75 flex justify-evenly items-center rounded-full bg-blue-800 text-white text-2xs py-0.5 px-1.5 cursor-pointer"
                    >
                      <CrossIcon className="mr-0.5 w-1.75 h-1.75" />
                      {formatLongString(tag, 25)}
                    </div>
                  ))}
                </div>
                <div className="font-semibold text-base tracking-finnieSpacing-wide leading-6 mt-3">
                  Estimated Costs:
                </div>
                <div className="tracking-finnieSpacing-wider text-sm leading-5">
                  {estimateCostKOII} KOII
                </div>
                <div className="tracking-finnieSpacing-wider text-sm leading-5">
                  {isEmpty(estimateCostAr)
                    ? 'Calculating fee...'
                    : `${formatNumber(estimateCostAr, 6)} AR`}{' '}
                  {!isEmpty(estimateCostAr) && (
                    <span className="text-2xs text-success-700">Storage Fee</span>
                  )}
                </div>
              </div>
            </div>
            {!showReferralField && (
              <Button
                onClick={handleUploadNFT}
                className="h-9 mt-8 text-sm rounded w-43.75 mb-4"
                variant="indigo"
                text="Create NFT"
                disabled={disableCreateNFT}
              />
            )}
            {showReferralField && (
              <div className="w-101 mt-4">
                <div className="w-46.75 text-sm text-success-700 m-auto mb-2">
                  FRIEND REFERRAL CODE
                </div>
                <div className="mb-2">
                  <input
                    onChange={(e) => setReferralCode(e.target.value)}
                    style={{
                      boxSizing: 'border-box',
                      background: '#D6D6D6',
                      borderBottom: '1.5px solid #373765',
                      paddingLeft: '4px',
                      fontSize: '14px'
                    }}
                    className="w-77 h-8 confirm-create-nft-modal-referral-input"
                    type="text"
                  ></input>
                  <button
                    onClick={handleSubmitReferralCode}
                    className="w-23 h-8 bg-blue-800 text-white"
                  >
                    Submit
                  </button>
                </div>
                {referralCodeError && (
                  <div style={{ color: '#DB1B1B', fontSize: '12px' }}>{referralCodeError}</div>
                )}
              </div>
            )}
            {/* {!confirmedCode && <div onClick={() => setShowReferralField(prev => !prev)} className='text-xs text-success-700 underline my-3.75 cursor-pointer'>{!showReferralField ? 'Skip the KOII cost with a referral code' : 'Continue without a referral code'}</div>} */}
            {confirmedCode && (
              <div className="text-xs text-success-700 my-3.75">
                Referral code has been sucessfully redeemed!
              </div>
            )}
          </>
        )}
        {step === 2 && (
          <div className="relative w-full h-full">
            <ModalBackground className="absolute top-0 left-0" />
            <div className="ml-56 mt-27">
              <div className="font-semibold text-xl tracking-finnieSpacing-wide">
                Your NFT is being created!
              </div>
              <div className="text-base mb-16">
                It will take a few minutes to reflect on your wallet.
              </div>
              {/* <div className="text-base">
                It will take a few minutes to reflect on your wallet. In the meantime...
              </div> */}
            </div>
            <div className="flex w-101 justify-between m-auto">
              {/* <Button
                onClick={() => {close(); handleShareNFT(nftId)}}
                className="h-10 mt-16 text-base rounded w-43.75 mx-auto"
                variant="indigo"
                text="Transfer"
              /> */}
              {/* <Button
                onClick={() => setStep(3)}
                className="h-10 mt-16 text-base rounded w-43.75 mx-auto"
                variant="inversedIndigo"
                text="Share"
              />               */}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="relative w-full h-full text-center">
            <div className="w-112 text-sm mt-6">
              Earn attention rewards forever through Koii. Copy this link and share on your favorite
              social platforms.
            </div>
            <div className="mt-6 text-base font-semibold">
              {showShareLink ? 'Share Link' : 'Embed Link'}
            </div>
            {showShareLink && (
              <input
                type="text"
                value={shareLink}
                disabled
                className="w-94.5 m-auto mt-2 rounded-1 text-sm leading-6 text-blue-800 border-1.5 border-solid border-blue-800 px-1"
              />
            )}
            {!showShareLink && (
              <textarea
                value={embedLink}
                disabled
                className="w-94.5 h-20 m-auto mt-2 rounded-1 text-sm leading-6 text-blue-800 border-1.5 border-solid border-blue-800 px-1"
              />
            )}
            <CopyToClipboard text={showShareLink ? shareLink : embedLink}>
              <Button
                className="h-10 mt-5 text-base rounded w-43.75 mx-auto"
                variant="indigo"
                text="Copy link"
              />
            </CopyToClipboard>
            <div className="flex w-77.25 m-auto mt-5 justify-between">
              <div
                className="cursor-pointer"
                onClick={() => shareSocialNetwork(SOCIAL_NETWORKS.TWITTER, nftId)}
              >
                <TwitterIcon />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => shareSocialNetwork(SOCIAL_NETWORKS.FACEBOOK, nftId)}
              >
                <FacebookIcon />
              </div>
              {/* <div className='cursor-pointer' onClick={() => shareSocialNetwork(SOCIAL_NETWORKS.LINKEDIN, nftId)}><LinkedIn /></div> */}
              <a
                href={`mailto:?subject=Check out my NFT, now stored on Koii— forever!&body=https://koii.live/content-detail/${nftId}`}
                title="Share by Email"
              >
                <div className="cursor-pointer">
                  <MailIcon />
                </div>
              </a>
              <div onClick={() => setShowShareLink((prev) => !prev)} className="cursor-pointer">
                {showShareLink ? <EmbedIcon /> : <ShareIcon />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfirmCreateNftModal
