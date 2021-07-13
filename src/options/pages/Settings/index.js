import React, { useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'

// import SettingIcon from 'img/navbar/setting.svg'
// import BlockRewardIcon from 'img/block-reward-icon.svg'
import IDCardIcon from 'img/id-card-icon.svg'
import DefaultProfileImageIcon from 'img/default-profile-image-icon.svg'
import ChangeProfileImageIcon from 'img/change-profile-image-icon.svg'

import './index.css'

export default () => {
  const fileRef = useRef()
  const [profileImage, setProfileImage] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [syncWallet, setSyncWallet] = useState(false)

  const onSelectClick = () => {
    fileRef.current.click()
  }

  const onProfileImageChange = (e) => {
    const file = get(e, 'target.files.0', '')
    if (file) {
      setProfileImage(file)
    }
  }

  const onSubmit = () => {
    console.log({ profileImage })
    console.log({ name })
    console.log({ description })
    console.log({ link })
    console.log({ setSyncWallet })
  }

  const profileImageUrl = useMemo(
    () => (profileImage ? URL.createObjectURL(profileImage) : ''),
    [profileImage]
  )

  return (
    <div className='settings-page-wrapper'>
      <div className='settings-page'>
        <div className='top-section'>
          <IDCardIcon className='id-card-icon' />
          <div className='title'>Decentralized Identity</div>
          <div className='description'>
            Connect to the decentralized internet with just your wallet. No more
            email log-ins or giving your personal data straight to Big Tech.
            This information will be public.
          </div>
          <div className='address'>KOII Wallet: 12345...12345 (Account 1)</div>
        </div>

        <div className='info-section'>
          <div className='left'>
            {profileImage ? (
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
            <div className='select-image-button' onClick={onSelectClick}>
              {profileImage ? (
                <>
                  <ChangeProfileImageIcon className='change-profile-image-icon' />{' '}
                  Change image
                </>
              ) : (
                'Select from Gallery'
              )}
            </div>
            <div className='create-nft-text'>
              Or&nbsp;
              <Link to='/create' className='create-nft-link' target='_blank'>
                {' create an NFT '}
              </Link>{' '}
              to add to your gallery
            </div>
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

// export default () => {
//   return (
//     <div className='settings-page-wrapper'>
//       <div className='settings-page'>
//         <div className='top-section'>
//           <SettingIcon className='settings-icon' />
//           <div className='title'>Customization Settings</div>
//           <div className='description'>Coming soon!</div>
//         </div>
//         <div className='content-section'>
//           <div className='description'>
//             With customization settings, you’ll be able to change the
//             presentation of your Gallery and your Collections. A few of the
//             coming features include:
//           </div>
//           <div className='specs'>
//             <div className='spec-item'>
//               <div className='number'>1</div>
//               <div className='text'>
//                 Edit the theme of your gallery, including background color,
//                 fonts, and decorations
//               </div>
//             </div>
//             <div className='spec-item'>
//               <div className='number'>2</div>
//               <div className='text'> Create themes for others to use</div>
//             </div>
//             <div className='spec-item'>
//               <div className='number'>3</div>
//               <div className='text'>Edit default exchange currencies</div>
//             </div>
//             <div className='spec-item'>
//               <div className='number'>4</div>
//               <div className='text'>
//                 Filter views (alphabetical, most views, most KOII earned, etc.)
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='bottom-section'>
//           <div className='reward-box'>
//             <BlockRewardIcon className='reward-icon' />
//             <div className='reward-text'>
//               Have a feature you’d like to see? We want to hear!
//               <br /> Fill out &nbsp;
//               <a
//                 href='https://docs.google.com/forms/d/1NwBLA406LlwwEIE0Fw_HG_iQC3VGDpw5H3v4It4iZX0/'
//                 className='form-link'
//               >
//                 this form.
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
