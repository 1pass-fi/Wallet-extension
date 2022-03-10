import React, { useState, useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'

import NavBar from 'finnie-v2/components/NavBar'

import FriendReferralBg from 'img/v2/friend-referral-bg.svg'
import ShuttleIcon from 'img/v2/shuttle-icon.svg'
import ShareCodeIcon from 'img/v2/share-code-icon.svg'
import CopyIcon from 'img/v2/copy-icon.svg'
import CheckMarkIcon from 'img/v2/check-mark-icon-blue.svg'
import ShareIcon from 'img/v2/share-icon.svg'

import Button from 'finnie-v2/components/Button'
import GetRewardsModal from './GetRewardsModal'
import ShareCodeModal from './ShareCodeModal'
import { FRIEND_REFERRAL_ENDPOINTS, STATEMENT } from 'constants/koiConstants'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import { GalleryContext } from 'options/galleryContext'

const FriendReferral = () => {
  const { setIsLoading, setError, setNotification } = useContext(GalleryContext)
  const [isCopied, setIsCopied] = useState(false)
  const [showGetRewardsModal, setShowGetRewardsModal] = useState(false)
  const [showShareCodeModal, setShowShareCodeModal] = useState(false)

  const defaultAccount = useSelector((state) => state.defaultAccount.AR)
  const code = defaultAccount.affiliateCode

  const redeemRewards = async () => {
    try {
      setIsLoading((prev) => ++prev)
      if (defaultAccount) {
        const { message, status } = await backgroundRequest.gallery.friendReferral({
          endpoints: FRIEND_REFERRAL_ENDPOINTS.CLAIM_REWARD
        })

        if (status != 200) {
          switch (message) {
            case `Affiliate Invites doesn't exists or already claimed`:
              setNotification(STATEMENT.NO_REWARD)
              break
            default:
              setNotification(message)
          }
        } else {
          console.log('RECEIVED KOII')
        }
      }
    } catch (err) {
      setError(err.message)
    }
    setIsLoading((prev) => --prev)
  }

  return (
    <div className="w-full min-h-screen h-full bg-blue-600">
      <NavBar />
      <div className="absolute w-full mx-auto">
        <FriendReferralBg className="ml-9" />
      </div>
      <div className="mt-16.75 mx-auto transform -translate-x-83 w-max text-white">
        <div className="font-semibold text-3xl leading-10 capitalize">
          Give a Little, Get a Little
        </div>
        <div className="w-80 mt-5 leading-7 text-base">
          Invite friends to use the Koii browser extension. You’ll get 1 KOII free for each friend
          who registers an NFT with your code and they’ll get 1 KOII free, too.
        </div>
        <div className="w-80 mt-18 leading-7 text-base">
          You’ve earned <span className="text-success">{defaultAccount.totalReward} KOII</span> with
          your referral code. <span className="font-semibold">Keep sharing for free KOII.</span>
        </div>
      </div>
      <div className="m-auto absolute top-48 left-0 right-0 bottom-0">
        <ShuttleIcon
          style={{ width: '182px', height: '293px', animation: 'spin 8s linear infinite' }}
          className="mx-auto"
        />
        <div className="mt-8 text-success text-lg leading-7 font-semibold text-center">
          YOUR CODE IS
        </div>
        <div className="mt-2 text-base text-center leading-7 text-white">{code}</div>
        <div style={{ width: '768px' }} className="mt-8 flex justify-evenly items-center mx-auto">
          <Button
            style={{ width: '216px', height: '46px' }}
            text="Share Code"
            variant="lightBlue"
            icon={ShareCodeIcon}
            size="lg"
            onClick={() => {
              setShowShareCodeModal(true)
            }}
          />
          <CopyToClipboard text={code}>
            <Button
              style={{ width: '216px', height: '46px' }}
              text={isCopied ? 'Copied' : 'Click to Copy'}
              variant="primary"
              icon={isCopied ? CheckMarkIcon : CopyIcon}
              size={isCopied ? 'lg' : 'md'}
              onClick={() => setIsCopied(true)}
            />
          </CopyToClipboard>
          <Button
            style={{ width: '216px', height: '46px' }}
            text="Get My Rewards"
            variant="warning300"
            icon={ShareIcon}
            size="lg"
            onClick={() => {
              setShowGetRewardsModal(true)
            }}
          />
        </div>
      </div>
      {showGetRewardsModal && (
        <GetRewardsModal
          redeemRewards={redeemRewards}
          rewards={defaultAccount.totalReward}
          close={() => setShowGetRewardsModal(false)}
        />
      )}
      {showShareCodeModal && (
        <ShareCodeModal code={code} close={() => setShowShareCodeModal(false)} />
      )}
    </div>
  )
}

export default FriendReferral
