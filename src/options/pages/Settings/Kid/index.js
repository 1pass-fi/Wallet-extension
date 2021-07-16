import React, { useRef, useState, useMemo, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'

import { getDisplayAddress, saveImageDataToStorage } from 'options/utils'

// import SettingIcon from 'img/navbar/setting.svg'
// import BlockRewardIcon from 'img/block-reward-icon.svg'
import IDCardIcon from 'img/id-card-icon.svg'
import DefaultProfileImageIcon from 'img/default-profile-image-icon.svg'
import ChangeProfileImageIcon from 'img/change-profile-image-icon.svg'

import './index.css'
import { GalleryContext } from 'options/galleryContext'
import { backgroundRequest } from 'popup/backgroundRequest'
import { loadNFTCost } from 'utils'

import { ERROR_MESSAGE } from 'koiConstants'

import { koi } from 'background'

export default () => {
  const { address, totalAr, totalKoi, setIsLoading, setError } = useContext(GalleryContext)

  const fileRef = useRef()
  const [profileImage, setProfileImage] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [syncWallet, setSyncWallet] = useState(false)
  const [arweaveImage, setArweaveImage] = useState(null)

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
        Arweave: address
      }
  
      const kidInfo = {
        name,
        description,
        link,
        addresses
      }
  
      const hadKID = await hadKIDCheck()
      if (hadKID) {
        const txId = await backgroundRequest.gallery.updateKID({kidInfo, contractId: hadKID})
        console.log('KID transaction id: ', txId)
      } else {
        if (!get(profileImage, 'type')) {
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
          throw new Error('File too large. The maximum size for Profile Picture is 500KB')
        }
  
        await saveImageDataToStorage(profileImage)
    
        const txId = await backgroundRequest.gallery.createNewKID({ kidInfo, fileType })
        console.log('KID transaction id: ', txId)
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
    const data = await koi.getKIDByWalletAddress(address)
    if (get(data, 'data.transactions.edges[0].node.id')) {
      return get(data, 'data.transactions.edges[0].node.id')
    }
    return false
  }

  const getKIDFields = (data) => {
    console.log(data)
    if (get(data, 'data.transactions.edges[0].node.tags')) {
      let initState = (get(data, 'data.transactions.edges[0].node.tags')).filter(tag => tag.name == 'Init-State')
      const imageUrl = `https://arweave.net/${get(data,'data.transactions.edges[0].node.id')}`
      initState = JSON.parse(initState[0].value)
      const name = get(initState, 'name')
      const description = get(initState, 'description')
      const link = get(initState, 'link')
  
      return { imageUrl, name, description, link }
    }
  }

  useEffect(() => {
    const getKid = async () => {
      const data = await koi.getKIDByWalletAddress(address)
      console.log(data)
      if (get(data, 'data.transactions.edges[0].node.id') ) {
        const { imageUrl, name, description, link } = getKIDFields(data) 
        if (imageUrl) {
          setArweaveImage(imageUrl)
          setName(name)
          setDescription(description)
          setLink(link)
        }
      }
    }

    getKid()
  }, [address])

  return (
    <div className='kid-settings-page-wrapper'>
      <div className='kid-settings-page'>
        <div className='top-section'>
          <IDCardIcon className='id-card-icon' />
          <div className='title'>Decentralized Identity</div>
          <div className='description'>
            Connect to the decentralized internet with just your wallet. No more
            email log-ins or giving your personal data straight to Big Tech.
            This information will be public.
          </div>
          <div className='address'>KOII Wallet: {getDisplayAddress(address)} (Account 1)</div>
        </div>

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
                  checked
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
