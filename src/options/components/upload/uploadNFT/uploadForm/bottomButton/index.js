import React, { useContext, useState, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'

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

export default ({ description, setStage, stage, title, file, username }) => {
  const createNftButtonRef = useRef(null)
  const { setIsLoading, 
    address, 
    wallet, 
    setFile, 
    setNotification,
    setError,
    inviteSpent,
    totalAr,
    totalKoi,
    account,
    setShowSuccessUploadNFT
  } = useContext(GalleryContext)
  const {
    tags,
    price,
    setTransactionId,
    setCreatedAt,
    isFriendCodeValid,
    setIsFriendCodeValid,
    setContentType,
  } = useContext(UploadContext)
  const [friendCode, setFriendCode] = useState('')

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
      }

      // call the request function
      const { txId, time } = await backgroundRequest.gallery.uploadNFT({content, tags, fileType, address: account.address, price})
      // console.log('RESPONSE DATA', txId, time)

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

  if (stage == 1) {
    return (
      <button
        className='create-ntf-button'
        onClick={async () => {
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
              tags
            }
            await saveUploadFormData(file, metadata)

            setIsLoading(false)
            setStage(2)
          } catch(error) {
            setIsLoading(false)
            setError(error.message)
          } 
        }}
        disabled={isEmpty(title) | isEmpty(description)}
      >
        Create New NFT
      </button>
    )
  }

  if (stage == 2) {
    const handleUploadStage2 = async () => {
      console.log(price)
      // Costs validations
      if (isNumber(price)) {
        try {
          const koiPrice = isFriendCodeValid ? 0 : 1

          if (totalKoi < koiPrice) {
            setError(ERROR_MESSAGE.NOT_ENOUGH_KOI)
            return
          }

          if (totalAr <= price) {
            setError(ERROR_MESSAGE.NOT_ENOUGH_AR)
            return
          }

          createNftButtonRef.current.disabled = true
          const { txId, time } = await handleUploadNFT()
          // const { txId, time } = await mockUploadNFT()
          setTransactionId(txId)
          setCreatedAt(time)
          setStage(3)
          setShowSuccessUploadNFT(true)
        } catch (err) {
          setError(err.message)
        }
      } else {
        setError(ERROR_MESSAGE.CANNOT_GET_COSTS)
      }
    }

    const checkFriendCode = async () => {
      setIsLoading(true)
      try {
        if (wallet) {
          koi.wallet = wallet
          koi.address = address
  
          const { status, message } = await submitInviteCode(koi, friendCode)
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
          !inviteSpent &&
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
                  onClick={checkFriendCode}
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
          onClick={handleUploadStage2}
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
