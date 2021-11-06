import React, { useContext, useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import trim from 'lodash/trim'
import union from 'lodash/union'
import get from 'lodash/get'

import { FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'
import { getBalance } from 'options/selectors/defaultAccount'

import { exportNFT, getChromeStorage, saveUploadFormData, setChromeStorage } from 'utils'
const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443,
})

import { loadNFTCost } from 'utils'
import { GalleryContext } from '../../../../../galleryContext'
import { UploadContext } from '../../../index'
import { submitInviteCode } from 'utils'

import { Web } from '@_koi/sdk/web'
export const koi = new Web()

import './index.css'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import { ERROR_MESSAGE, NFT_BIT_DATA } from 'constants/koiConstants'
import storage from 'services/storage'

export default ({ description, setStage, stage, title, file, username, isNSFW, tagInput, setTagInput,
  setClicked, clicked
}) => {
  const createNftButtonRef = useRef(null)
  const {
    wallet,
    setFile,
    setNotification,
    setError,
    account,
    setIsLoading,
    setShowUploadingModal,
    setPendingNFTTitle
  } = useContext(GalleryContext)
  const {
    tags,
    setTags,
    price,
    setTransactionId,
    setCreatedAt,
    isFriendCodeValid,
    setIsFriendCodeValid,
    setContentType,
  } = useContext(UploadContext)
  const [friendCode, setFriendCode] = useState('')
  const [isClickEnable, setIsClickEnable] = useState(true)

  const defaultAccount = useSelector(state => state.defaultAccount)
  const [balance, koiBalance] = useSelector(getBalance)


  const handleUploadNFT = async () => {
    // file size checking
    if (file.size > 15 * 1024 ** 2) throw new Error(ERROR_MESSAGE.FILE_TOO_LARGE)
    setIsLoading(true)
    try {
      const url = URL.createObjectURL(file)
      // console.log('bottomButton- file', file)

      // get the file type
      const fileType = file.type
      setContentType(file.type)

      // get arrayBuffer
      const response = await fetch(url)
      const blob = await response.blob()
      const dataBuffer = await blob.arrayBuffer()
      // console.log('bottomButton- dataBuffer', dataBuffer)

      // create a 8bit array and save to local storage
      let u8 = new Int8Array(dataBuffer)
      // console.log('bottomButton- u8', u8)

      // save u8 to local storage
      u8 = JSON.stringify(u8, null, 2)
      // console.log('bottomButton- u8', u8)

      await setChromeStorage({ NFT_BIT_DATA: u8 })
      // console.log(await getChromeStorage(NFT_BIT_DATA))
      // prepare metadata
      const content = {
        title,
        owner: username,
        description,
        isNSFW
      }


      // call the request function
      const { txId, time } = await backgroundRequest.gallery.uploadNFT({ content, tags, fileType, address: account.address, price, isNSFW })
      // console.log('RESPONSE DATA', txId, time)

      setPendingNFTTitle(title)
      await storage.generic.set.savedNFTForm({})
      setIsLoading(false)

      return {
        txId,
        time
      }

    } catch (err) {
      setIsLoading(false)
      throw new Error(err.message)
    }
  }

  const mockUploadNFT = async () => {
    return {
      txId: 'ABCD1234',
      time: Date.now()
    }
  }

  const addTagOnSubmit = async (tagInput) => {
    let newTags = tagInput.split(',')
    newTags = newTags.map((tag) => trim(tag)).filter((tag) => tag.replace(/\s/g, '').length)
    setTags(union(tags, newTags))
    setTagInput('')
  }

  useEffect(() => {
    const cacheData = async () => {
      try {
        if (file.size > 15 * 1024 ** 2) throw new Error(ERROR_MESSAGE.FILE_TOO_LARGE)
        /* 
          Save the current form data to chrome storage
          delete when transaction is successful
        */
        setIsLoading(true)
        const metadata = {
          title,
          username,
          description,
          tags,
          isNSFW
        }

        await saveUploadFormData(file, metadata)

        setIsLoading(false)
        setIsClickEnable(true)
        setStage(2)
      } catch (error) {
        setIsLoading(false)
        setIsClickEnable(true)
        setError(error.message)
      }
    }

    if (clicked) cacheData()
  }, [clicked])

  if (stage == 1) {
    return (
      <button
        className='create-ntf-button'
        onClick={() => {
          setIsClickEnable(false)
          addTagOnSubmit(tagInput)
          setClicked(true)
        }}
        disabled={isEmpty(title) || isEmpty(description) || !isClickEnable}
      >
        Create New NFT
      </button>
    )
  }

  if (stage == 2) {
    const handleUploadStage2 = async () => {
      // Costs validations
      if (isNumber(price)) {
        try {
          const koiPrice = isFriendCodeValid ? 0 : 1
          if (koiBalance < koiPrice) {
            setError(ERROR_MESSAGE.NOT_ENOUGH_KOI)
            setIsClickEnable(true)
            return
          }

          if (balance <= price) {
            setError(ERROR_MESSAGE.NOT_ENOUGH_AR)
            setIsClickEnable(true)
            return
          }

          createNftButtonRef.current.disabled = true
          setShowUploadingModal(true)
          setIsLoading(true)
          const { txId, time } = handleUploadNFT()
          // const { txId, time } = await mockUploadNFT()
          setTransactionId(txId)
          setCreatedAt(time)
          setStage(3)
          setIsClickEnable(true)
        } catch (err) {
          setIsClickEnable(true)
          setError(err.message)
        }
      } else {
        setIsClickEnable(true)
        setError(ERROR_MESSAGE.CANNOT_GET_COSTS)
      }
    }

    const submitFriendCode = async () => {
      setIsLoading(true)
      try {
        if (account) {
          const { status, message } = await backgroundRequest.gallery.friendReferral({ 
            endpoints: FRIEND_REFERRAL_ENDPOINTS.SUBMIT_CODE,
            friendCode 
          })
          // const { status, message } = { status: 201, message: 'mock message' }
          if (status === 201) {
            setIsFriendCodeValid(true)
            setNotification(message)
          } else {
            switch (message) {
              case 'affiliateCode is not valid':
                setError(ERROR_MESSAGE.INVALID_FRIEND_CODE)
                break
              default:
                setError(message)
            }
          }

        }
      } catch (err) {
        setError(err.message)
      }
      setIsLoading(false)
    }

    return (
      <div className='confirmation-bottom-button'>
        {
          !defaultAccount.inviteSpent &&
          <div className='friends-referal'>
            <div className='referal-title'>Friend Referral Code</div>
            <div className='referal-description'>
              Skip the KOII cost with a referral code
            </div>
            {isFriendCodeValid ? (
              <div className='success-noti'>Success!</div>
            ) : (
              <div className='fill-code'>
                <input
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value)}
                  className='friend-code-input'
                />
                <div
                  className='submit-friend-code-button'
                  onClick={submitFriendCode}
                >
                  Submit
                </div>
              </div>
            )}
          </div>
        }
        <button
          ref={createNftButtonRef}
          className='create-ntf-button stage2'
          onClick={() => {
            setIsClickEnable(false)
            handleUploadStage2()
          }
          }
          disabled={!isClickEnable}
        >
          Confirm Registration
        </button>
      </div>
    )
  }

  return (
    <CopyToClipboard text='https://koi.registerlink.example'>

      <button className={'create-ntf-button'}>Copy Link to Share</button>
    </CopyToClipboard>
  )
}
