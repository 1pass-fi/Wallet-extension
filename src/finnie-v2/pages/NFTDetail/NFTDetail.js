import React from 'react'

import Button from 'finnie-v2/components/Button'
import NavBar from 'finnie-v2/components/NavBar'
import NFTMedia from 'finnie-v2/components/NFTMedia'

import BlockIcon from 'img/v2/block-icon.svg'
import LeaderboardIcon from 'img/v2/leaderboard-icon.svg'
import ShareIcon from 'img/v2/share-icon.svg'
import LinkIcon from 'img/v2/link-icon.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

import { TYPE } from 'constants/accountConstants'
import formatDatetime from 'finnie-v2/utils/formatDatetime'

const nft = {
  address: 'ou-OUmrWuT0hnSiUMoyhGEbd3s5b_ce8QK0vhNwmno4',
  contentType: 'image/jpeg',
  createdAt: '1621305832',
  description:
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet ficia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet ',
  earnedKoi: 14.380183885084467,
  galleryUrl:
    'chrome-extension://bpkclbbpogepoipfcejgjiphflmhommf/options.html#/details/DnHnRPRKisbxfvnd7EbBpJvUvzlM_mypqRRR3xazHag',
  imageUrl: 'https://arweave.net/DnHnRPRKisbxfvnd7EbBpJvUvzlM_mypqRRR3xazHag',
  isKoiWallet: true,
  isRegistered: true,
  koiRockUrl: 'https://koii.live/DnHnRPRKisbxfvnd7EbBpJvUvzlM_mypqRRR3xazHag',
  name: 'Watch a picture of a watch',
  totalViews: 15,
  txId: 'DnHnRPRKisbxfvnd7EbBpJvUvzlM_mypqRRR3xazHag',
  type: 'TYPE_ARWEAVE'
}

const NFTDetail = () => {
  const isArweaveNft = nft.type === TYPE.ARWEAVE

  return (
    <div className="min-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
      <NavBar />
      <div className="flex h-full w-full text-white">
        <div className="mx-auto mt-28 flex flex-col md:flex-row">
          <div className="w-100.25 h-101 mr-7 relative">
            <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
            {!isArweaveNft ? (
              <EthLogo className="absolute bottom-2 right-2 w-9 shadow rounded-full" />
            ) : (
              <ArweaveLogo className="absolute bottom-2 right-2 w-9 shadow rounded-full" />
            )}
          </div>
          <div className="w-115 h-101 relative">
            <div className="finnieSpacing-tighter font-semibold text-5xl mb-2 truncate">
              {nft.name}
            </div>
            <div className="text-sm mb-2">{`Registered: ${formatDatetime(nft.createdAt)}`}</div>
            <div className="flex w-68 gap-4 mb-5">
              <Button
                icon={BlockIcon}
                text="Explore Block"
                variant="inversed"
                className="border-opacity-20"
              />
              <Button icon={LeaderboardIcon} text="Leaderboard" variant="warning" />
            </div>
            <p className="w-full h-18 overflow-y-scroll text-sm leading-6 pr-4">
              {nft.description}
            </p>
            <div className="flex items-center justify-between h-11.5 mt-18.75 gap-5">
              <Button
                size="lg"
                icon={ShareIcon}
                className="h-full w-7/12"
                text="Share for Rewards"
              />
              <Button
                size="lg"
                icon={LinkIcon}
                variant="inversed"
                className="h-full w-5/12"
                text="Transfer NFT"
              />
            </div>
            <Button
              size="lg"
              icon={isArweaveNft ? EthLogo : ArweaveLogo}
              variant="lightBlue"
              text="Bridge your NFT to a different Blockchain"
              className="h-11.5 absolute bottom-0 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTDetail
