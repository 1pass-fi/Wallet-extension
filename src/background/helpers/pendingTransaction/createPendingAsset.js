import axios from 'axios'
import axiosAdapter from '@vespaiach/axios-fetch-adapter'

import { TYPE } from 'constants/accountConstants'
// constants
import { PATH } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'

export default async ({
  file,
  nftContent,
  nftTags,
  nftId,
  fileType,
  ownerAddress,
  createdAt,
  address,
  isPrivate
}) => {
  const credentials = await backgroundAccount.getCredentialByAddress(ownerAddress)
  const account = await backgroundAccount.getAccount(credentials)

  const url = URL.createObjectURL(file)

  const base64String = Buffer.from((await axios.request({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
    adapter: axiosAdapter
  })).data, 'binary').toString('base64')
  let imageUrl = `data:image/jpeg;base64,${base64String}`
  if (fileType.includes('video')) imageUrl = `data:video/mp4;base64,${base64String}`

  const pendingNFT = {
    name: nftContent.title,
    owner: nftContent.owner,
    description: nftContent.description,
    isNSFW: nftContent.isNSFW,
    tags: nftTags,
    isKoiWallet: true,
    earnedKoi: 0,
    txId: nftId,
    imageUrl,
    galleryUrl: `${PATH.GALLERY}#/details/${nftId}`,
    koiRockUrl: `${PATH.KOI_ROCK}/${nftId}`,
    isRegistered: true,
    contentType: fileType,
    totalViews: 0,
    createdAt,
    pending: true,
    type: TYPE.ARWEAVE,
    expired: false,
    retried: 1,
    address,
    isPrivate
  }

  const allPendingAssets = await account.get.pendingAssets() || []
  allPendingAssets.push(pendingNFT)
  await account.set.pendingAssets(allPendingAssets)
}
