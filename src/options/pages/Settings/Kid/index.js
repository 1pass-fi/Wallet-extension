import React, { useRef, useState, useMemo, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'

import get from 'lodash/get'
import { isEmpty } from 'lodash'

import { getDisplayAddress, saveImageDataToStorage } from 'options/utils'

// import SettingIcon from 'img/navbar/setting.svg'
// import BlockRewardIcon from 'img/block-reward-icon.svg'
import IDCardIcon from 'img/id-card-icon.svg'
import DefaultProfileImageIcon from 'img/default-profile-image-icon.svg'
import ChangeProfileImageIcon from 'img/change-profile-image-icon.svg'

import './index.css'
import { GalleryContext } from 'options/galleryContext'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { loadNFTCost } from 'utils'

import { ERROR_MESSAGE, NOTIFICATION } from 'constants/koiConstants'

import { Web } from '@_koi/sdk/web'
export const koi = new Web()

import { STORAGE } from 'constants/koiConstants'
import { setChromeStorage, getChromeStorage } from 'utils'
import { popupAccount } from 'services/account'

export default () => {
  const { totalAr, totalKoi, setIsLoading, setError, setNotification } = useContext(GalleryContext)

  const fileRef = useRef()
  const [profileImage, setProfileImage] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [syncWallet, setSyncWallet] = useState(false)
  const [arweaveImage, setArweaveImage] = useState(null)

  const defaultAccount = useSelector(state => state.defaultAccount)

  const onSelectClick = () => {
    fileRef.current.click()
  }

  const onProfileImageChange = (e) => {
    const file = get(e, 'target.files.0', '')
    if (file) {
      setProfileImage(file)
    }
  }

  /* 
    Create new KID or update KID
  */
  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const addresses = {
        Arweave: defaultAccount.address
      }
  
      const kidInfo = {
        name,
        description,
        link,
        addresses,
        syncWallet
      }
  
      const hadKID = await hadKIDCheck()

      /* 
        For now we don't have a way to update KID with an image, therefore selecting image will be disabled
        on KID updating. 
      */
      if (hadKID) {
        if (totalAr < 0.000002) {
          throw new Error(ERROR_MESSAGE.NOT_ENOUGH_AR)
        }
  
        if (totalKoi < 1) {
          throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
        }
        const payload = { contractId: hadKID }
        await backgroundRequest.gallery.createOrUpdateKID({ kidInfo, address: defaultAccount.address, payload})
        setNotification(NOTIFICATION.UPDATE_KID_SUCCESS)
      } else {
        if (!get(profileImage, 'type') && !arweaveImage) {
          throw new Error('Please select an image.')
        }
        const fileType = profileImage.type
  
        const arCost = await loadNFTCost(profileImage.size)
  
        // Validations
        if (totalAr < arCost) {
          throw new Error(ERROR_MESSAGE.NOT_ENOUGH_AR)
        }
  
        if (totalKoi < 1) {
          throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
        }
  
        if (profileImage.size > 0.5 * 1024**2) {
          throw new Error(ERROR_MESSAGE.KID_FILE_TOO_LARGE)
        }
  
        await saveImageDataToStorage(profileImage)
        const payload = { fileType }
        await backgroundRequest.gallery.createOrUpdateKID({ kidInfo, address: defaultAccount.address, payload })
        setNotification(NOTIFICATION.CREATE_KID_SUCCESS)
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError(err.message)
    }
  }

  const profileImageUrl = useMemo (
    () => {
      if (arweaveImage) {
        return arweaveImage
      }
      if (profileImage) {
        return URL.createObjectURL(profileImage)
      }
    },[profileImage, arweaveImage]
  )

  const hadKIDCheck = async () => {
    const data = await koi.getKIDByWalletAddress(defaultAccount.address)
    if (get(data[0], 'node.id')) {
      return get(data[0], 'node.id')
    }
    return false
  }

  useEffect(() => {
    const getKid = async () => {
      try {
        setIsLoading(true)
        const _account = await popupAccount.getAccount({ address: defaultAccount.address })
        let kid = await _account.get.kid()
        if (kid) {
          const { imageUrl, description, link, name } = kid
          setArweaveImage(imageUrl)
          setName(name)
          setDescription(description)
          setLink(link)
        }

        kid = await backgroundRequest.gallery.loadKID({ address: defaultAccount.address })
        if (kid) {
          const { imageUrl, description, link, name } = kid
          setArweaveImage(imageUrl)
          setName(name)
          setDescription(description)
          setLink(link)
        } else {
          setArweaveImage(null)
          setName('')
          setDescription('')
          setLink('')
        }

        setIsLoading(false)
      } catch(err) {
        setIsLoading(false)
        console.log(err)
      }
    }

    if (!isEmpty(defaultAccount)) getKid()
  }, [defaultAccount])

  return (
    <div className='kid-settings-page-wrapper'>
      <div className='kid-settings-page'>

        {/* TITLE */}
        <div className='top-section'>
          <IDCardIcon className='id-card-icon' />
          <div className='title'>Decentralized Identity</div>
          <div className='description'>
            Connect to the decentralized internet with just your wallet. No more
            email log-ins or giving your personal data straight to Big Tech.
            This information will be public.
          </div>
          <div className='address'>KOII Wallet: {getDisplayAddress(defaultAccount.address)} ({defaultAccount.accountName})</div>
        </div>

        {/* PROFILE PICTURE */}
        <div className='info-section'>
          <div className='left'>
            {arweaveImage || profileImage ? (
              <img className='profile-image' src={profileImageUrl} />
            ) : (
              <div className='profile-image'>
                <DefaultProfileImageIcon />
              </div>
            )}
            <input
              type='file'
              className='profile-image-input'
              ref={fileRef}
              accept='image/*'
              onChange={onProfileImageChange}
            />
            {!arweaveImage && <div className='select-image-button' onClick={onSelectClick}>
              {profileImage ? (
                <>
                  <ChangeProfileImageIcon className='change-profile-image-icon' />{' '}
                  Change image
                </>
              ) : (
                'Select an image'
              )}
            </div>}
            {/* <div className='create-nft-text'>
              Or&nbsp;
              <Link to='/create' className='create-nft-link' target='_blank'>
                {' create an NFT '}
              </Link>{' '}
              to add to your gallery
            </div> */}
          </div>

          {/* FORM */}
          <div className='right'>
            <div className='field'>
              <label className='label'>
                Name
                <br /> <span className='extra'>or pseudonym</span>
              </label>
              <input
                className='input'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='field'>
              <label className='label'>Description</label>
              <textarea
                className='text-area'
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className='field'>
              <label className='label'>
                Add a link
                <br />
                <span className='extra'>
                  e.g. Twitter profile or portfolio website
                </span>
              </label>
              <input
                className='input'
                type='text'
                value={link}
                onChange={(e) => setLink(e.target.value)}
              ></input>
            </div>

            <div className='field'>
              <label className='label'>Sync across wallets</label>
              <div className='check-zone'>
                <input
                  name='save-info'
                  type='checkbox'
                  value={syncWallet}
                  defaultChecked={true}
                  onChange={(e) => setSyncWallet(e.target.value)}
                ></input>
                <label htmlFor='save-info' className='checkbox-label'>
                  Save this info for each wallet stored in Finnie.
                </label>
              </div>
            </div>

            <div className='save-button' onClick={onSubmit}>
              Save & Update
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
