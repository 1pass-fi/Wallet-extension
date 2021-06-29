import React, { useContext, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import isEmpty from 'lodash/isEmpty'

import { exportNFT } from 'utils'
const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443,
})
import { loadNFTCost } from 'utils'
import { GalleryContext } from '../../../../../galleryContext'
import { UploadContext } from '../../../index'
import './index.css'

export default ({ description, setStage, stage, title, file, username }) => {
  const { setIsLoading, address, wallet, setFile } = useContext(GalleryContext)
  const {
    tags,
    setTransactionId,
    setCreatedAt,
    isFriendCodeValid,
    setIsFriendCodeValid,
  } = useContext(UploadContext)
  const [friendCode, setFriendCode] = useState('')

  const handleUploadNFT = async () => {
    setIsLoading(true)
    try {
      if (file.size > 15 * 1024 ** 2) throw new Error('File too large')
      const url = URL.createObjectURL(file)
      const content = {
        title,
        owner: username,
        description,
      }
      const result = await exportNFT(
        arweave,
        address,
        content,
        url,
        null,
        wallet,
        file,
        tags
      )
      console.log({ result })
      setIsLoading(false)
      return result
    } catch (err) {
      console.log(err.message)
      setIsLoading(false)
    }
  }

  const mockUploadNFT = async () => {
    return {
      txid: 'txid',
      time: 1624524443,
    }
  }

  if (stage == 1) {
    return (
      <button
        className='create-ntf-button'
        onClick={() => setStage(2)}
        disabled={isEmpty(title) | isEmpty(description)}
      >
        Create New NFT
      </button>
    )
  }

  if (stage == 2) {
    const handleUploadStage2 = async () => {
      const { txid, time } = await handleUploadNFT()
      // const { txid, time } = await mockUploadNFT()
      setTransactionId(txid)
      setCreatedAt(time)
      setStage(3)
    }

    const checkFriendCode = () => {
      // Check friend code
      setIsFriendCodeValid(true)
    }

    return (
      <div className='confirmation-bottom-button'>
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
        <button
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
