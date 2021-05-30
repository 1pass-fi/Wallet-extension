import { LOAD_KOI_BY, PATH, STORAGE, ERROR_MESSAGE } from 'koiConstants'
import passworder from 'browser-passworder'

import Arweave from 'arweave'
const arweave = Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443, })

const key = {'kty':'RSA','e':'AQAB','n':'yUluur99hdvq-mtTrmr-dvoPuElPz0H2A4-u35tSF8Y0pQ4sIJumFWtVRobjv0rTs3pzib7wnoewwe5iqxbbFrkWDfyi9vK_4Wkf_m46ejd6Lzz5xQfi5vEOf2LSg2UdtaxJN4z9ZGwvYQOH2AWXsa9m1ALMlI_kB_UIMTGc4h_flRCJaJF9tps-3FVuhpD6dhc59nR6eRo5jfDW44YgGBjtgmGVXgQzrW197enci4cdpPK2JoYGZA1c7I42n45BJO74qgiE4ommRC-aVT38pQLBunnJ9w3SHhHorpjVrhpxwwl40fwh7LR-BrP9sAe2fj9P2Xmc10z4yRvM4CQ4MMyJwa-RxD96cV71UMLMPd7207C2AS72WYD6L2iIoi6g-z8V9mBl6QOMLWqnfT4fR27Yl49W8bqu_rg1VhdCNec5j9NxcOtm9bomAhgXVmK7Qnbvy0Bh1iatWaEg7HVuY5IfBO9RJPsqD97bg1mAsjwmAyt-aN02PCZDUsZ_7qT11PMA8KBdraKEoe4wjO2wfytAsmW9jAuCHX5FEQK_QHDqInm0iho8KpHamB1qfqO81IC67PL4W9otMyrZAHHWMzGykwREUAjQ7kOaR2OurC8GSxpjQl8GXXwGvM3j5K-SP69WHEjTLrZiYj1n6Kfz90ntFFIRhbAQmQbti1UpRw0','d':'Go7UzFENt8avd0EH9oBpeLs_rboGjLsQQaIImbo9l6NwOMLo8Zh3zmWuB7Mug4PU8N5cNjV6PAB9Quk4HYjTeWkMTuYhfmHDDXO4Y_KZRpzhQzBRaDzFJGFz3zzjt7B0vg6wTmMM394iVjOIDemW_Tu-XoTMB2IA3UfoP81i_Lbl4h4fcyuXIavUHHAtOBYS5dfkru7pZece5up6_-QngeZwF_7WHWSCiQRkVCrCDarTL3tSqzyNxU-6DgAplt3HHJ9nMdAT8GvnAyIgw9R87Cyz8O22xyEMsyj7wWWq8-DLV8d9KH-S3k9mPW4sL7ikzH2ABJq2JfYi8S341y4QN6wf5VtNHt-FODdmueSTzEMzc7n0x4DNL2TiH6ijjrZy5qTukuZBGEbVbtUgHizX5mUUn9r6jNwuhvjsl0Oco9HhWHwlkC90QQHVG1HrCBtwPHoUThrvS2gFBJgLeJ8yXUDTr8ff-GUYi4pLjmChHctdxkql06faRjMWgLZKiiHHj4AnPvgn87hJynfBjUkoMq7Ht7tgyqDedVEjXjkJfd6NIOJPM1NY0GqCRc0wHlcHqwiuqDwug2eLeMQiYjIoycO-Nj1pBp_mNTZ48X1GjBZjs8FXsixBv2q6rTgUNCkLtrMrgNJ6LY_h4TLY3tYIBHvu-m5gWIK26PBz7YmwGqU','p':'7PwmYvTXC05fNyI2IOJ5EVSaJ3spRt8g4e8NIAgT-eK4S5lOUh0zkPNU4jOC9yIpgY-ns9lZiAQAQbfNl6MeXoiJ1odQ9ebqF95l5Mr7QRdndmBhyJ3aj24RAwduu-0I8xGQsHh-e44el_VNrLeTRK7s5mgXXsfvMsumdEtkvjlfBv2Ls_SbMC35nYdRi3CjxBmeJ2xklfLYV60x1wzikU9cxLXDiCAxhHRQf-aYW7srpZeCEKJg_is3-2XNq6UpGnx3c6wAmHaTK6ini_k8Ig-mOTQNN6U538bna-JtnKieIhycDrob1sIbSqmsW_VZdwVFvRFYRcCAbrQXumld6w','q':'2XAEL6yVMmSgIDe5k4EeGAqHD6dz8NVm7CafG43tRQIV1koQvxbOu6SMyQZADxdPk32MTiu9XGaC9t-U3iAhUWmxTR1kWPZOa_MzMD0Mkt8ZUA7MsufiYxleylQXLjYNsz7RfJTYcPTFK1VjeClqYzZ_YxL-V1Lp8GW1W2AioJwIvqo36TchidSMQykJzY46WVChV1F6x5CRODfKb0t9ZvYuf37NIIIejZnnHerSnmVAR0wCYYd2lGU1yV2EaRUQeEJk_31l0q2iGOqMvZDdLc1mLG24MJbS5CifzcmQBigEhtp3jZX6kMXu4SfCac_TBtHye7HI9ihQ-44nUnaY5w','dp':'D-G2ENunrbJK3z8DsaB7zJWG3y55za4WXg3PK15fOFfhUe-sOASM-CHWhnI9TKKVdYFTE9J1FZBvE_hlZswftOYhlqbq3g_jkEXvPi38OJiA7oX3B6LMiuAtc66D1URFXUTIFYt9rnoPws9FrVWAIRI3_hjruAZeGWFcfl6vGbBuleFYA29ZFxl9qPjwlg-uae3tk2bINuRXa0jIFklexa4z4VrtB6pgpyfEXU3u1_brLeXBaav4JBBxZ_-ikOY4ovXEa5QTViRcKIjc8Zx6Uy4JTbwXRqtj_YMu7yP1hJIoRtD0BGikhPftLEvCqUb__-HykoEfEU2dTc3z6SI2kQ','dq':'G0WtgL1IyVVNsDzNDe838xP-9LuwExjxG9WMR0x54hns2z_W8eDOdUKiVeRuzHXECV_J5VQfICPLcWOBrIqjIy76ig2RtIbQN0H9vaMqnJFW_2-bxSTIhF1-Qiph7e3hsgXDCLkynJhW0qSXIU8whNklCSwsso83wGtBYACi1zo67o8zDBFaJ4t9PD89d4bLUsCGPAmAON-tFzwILAVv6SYfluY0nEs1wdT35Ay79hoFAexKsCjpeptnL6aHIRb_RdYuDM2Ro-cbWbyxgmVVGJWWpyPr4kxIj015HbqWUe9bAf8M17lkAByTZbIy9EqY0VYr78_QwO81mRevXux5KQ','qi':'TsPOnSHSRaj3mEZPt4dxAlB8-Jhig9qVJRv_SOPMZY8nqhSN09ltiVFEdBdcPEYwoCcPl8on9vKayfadMDzCZQ4t5qcnC9a38Y8Mdu3p2LXThhaZwLzWvtKXh9gZr9tOG-WBwN9Va2IPqR-lCINEnRpQ5c9PRZPchVwms1oWqvPzp_FiUSdGt6ZjwrsC9lgIl9GKaMtw6PIouX42sUmShUkHBcrhx4AuhENQyCmP29dztFqCdFVq1dWkb04KgEFYSSrK9y00ymIr7iBFzBOvqOx5wt2RRYawQKwflsq2X3XwseW8kVQyP85zXFBkPASatDHJYcQ2W0-gBn1i-N1wbg'}

/* istanbul ignore next */
export const setChromeStorage = (obj) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(obj, () => {
      resolve()
    })
  })
}

/* istanbul ignore next */
export const getChromeStorage = (key) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(key, (result) => {
      resolve(result)
    })
  })
}

/* istanbul ignore next */
export const removeChromeStorage = (key) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.remove(key, () => {
      resolve()
    })
  })
}

export const loadWallet = async (koiObj, data, loadBy) => {
  try {
    switch (loadBy) {
      case LOAD_KOI_BY.ADDRESS:
        koiObj.address = data
        break
      case LOAD_KOI_BY.KEY:
        await koiObj.loadWallet(data)
        break
    }

    koiObj.balance = await koiObj.getWalletBalance()
    console.log('AR BALANCE', koiObj.balance)
    const koiBalance = await koiObj.getKoiBalance()

    await setChromeStorage({ 'koiBalance': koiBalance, 'arBalance': koiObj['balance'] })

    return {
      arBalance: koiObj.balance,
      koiBalance: koiBalance,
      address: koiObj.address
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

export const generateWallet = async (koiObj) => {
  try {
    await koiObj.generateWallet(true)
    return koiObj.mnemonic
  } catch (err) {
    throw new Error(err.message)
  }
}

export const loadMyContent = async (koiObj) => {
  try {
    const contentList = await koiObj.myContent()
    const resultList = contentList.map((content) => {
      return {
        name: content.title,
        isKoiWallet: content.ticker === 'KOINFT',
        earnedKoi: content.totalReward,
        txId: content.txIdContent,
        imageUrl: `${PATH.NFT_IMAGE}/${content.txIdContent}`,
        galleryUrl: `${PATH.GALLERY}?id=${content.txIdContent}`,
        koiRockUrl: `${PATH.KOI_ROCK}/${content.txIdContent}`,
        isRegistered: true
      }
    })
    return resultList

  } catch (err) {
    throw new Error(err.message)
  }
}

export const loadMyActivities = async (koiObj) => {
  return [
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    }
  ]
}

export const transfer = async (koiObj, qty, address) => {
  try {
    const koiBalance = await koiObj.getKoiBalance()
    if (qty > koiBalance) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
    return await koiObj.transfer(qty, address)
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const saveWalletToChrome = async (koiObj, password) => {
  try {
    const encryptedWalletKey = await passworder.encrypt(password, koiObj.wallet)
    console.log('ENCRYPTED KEY', encryptedWalletKey)
    await setChromeStorage({ 'koiAddress': koiObj.address, 'koiKey': encryptedWalletKey })
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const decryptWalletKeyFromChrome = async (password) => {
  try {
    const result = await getChromeStorage(STORAGE.KOI_KEY)
    const key = await passworder.decrypt(password, result[STORAGE.KOI_KEY])
    return key
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const decryptSeedPhraseFromChrome = async (password) => {
  try {
    const result = await getChromeStorage(STORAGE.KOI_PHRASE)
    if (!result[STORAGE.KOI_PHRASE]) return
    const phrase = await passworder.decrypt(password, result[STORAGE.KOI_PHRASE])
    return phrase
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const removeWalletFromChrome = async () => {
  try {
    await removeChromeStorage(STORAGE.KOI_ADDRESS)
    await removeChromeStorage(STORAGE.KOI_KEY)
    await removeChromeStorage(STORAGE.KOI_PHRASE)
    await removeChromeStorage(STORAGE.CONTENT_LIST)
    await removeChromeStorage(STORAGE.PENDING_REQUEST)
    await removeChromeStorage(STORAGE.SITE_PERMISSION)
  } catch (err) {
    throw new Error(err.message)
  }
}

export const JSONFileToObject = async (file) => {
  try {
    const fileText = await file.text()
    return JSON.parse(fileText)
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const checkSitePermission = async (origin) => {
  try {
    let approvedOrigin = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
    if (!approvedOrigin) approvedOrigin = []
    return approvedOrigin.includes(origin)
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const saveOriginToChrome = async (origin) => {
  try {
    let approvedOrigin = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
    if (!approvedOrigin) approvedOrigin = []
    approvedOrigin.push(origin)
    await setChromeStorage({ 'sitePermission': approvedOrigin })
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const deleteOriginFromChrome = async (aOrigin) => {
  try {
    let approvedOrigin = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
    if (!approvedOrigin) approvedOrigin = []
    approvedOrigin = approvedOrigin.filter(origin => origin !== aOrigin)
    await setChromeStorage({ 'sitePermission': approvedOrigin })
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

export const signTransaction = async (transaction) => {
  try {
    const tx = await arweave.createTransaction({ target: transaction.target, quantity: transaction.quantity })
    await arweave.transactions.sign(tx, key)
    await arweave.transactions.post(tx)
    return tx
  } catch (err) {
    console.log(err.message)
  }
}

export const utils = {
  loadWallet
}
