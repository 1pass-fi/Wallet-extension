import React, { useState, useEffect, useMemo, useRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/theme-monokai'
import { includes, isEmpty } from 'lodash'
import ReactTooltip from 'react-tooltip'

import IDCardIcon from 'img/id-card-icon.svg'
import AddIcon from 'img/navbar/create-nft.svg'
import CheckIcon from 'img/check-icon-circle.svg'
import EditIcon from 'img/edit-icon-collection.svg'
import DefaultAvt from 'img/default-avt-green.png'
import KidInputField from './kidInputField'
import ProfileCover from 'img/profile-cover-placeholder.png'
import RemoveLinkAccount from 'img/remove-account-links.svg'
import Button from '../../../shared/Button'
import ToggleButton from 'options/components/toggleButton'
import ExpandIcon from 'img/share-icon.svg'
import CloseIcon from 'img/ab-close-icon.svg'
import GoBackIcon from 'img/goback-icon-26px.svg'
import CloseIconBlue from 'img/close-icon-blue.svg'

import parseCss from 'utils/parseCss'
import { GalleryContext } from 'options/galleryContext'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import { checkAvailable } from 'background/helpers/did/koiiMe'

import { getBalance } from 'options/selectors/defaultAccount'

import storage from 'services/storage'
import { getDisplayAddress } from 'options/utils'

import './index.css'
import { NOTIFICATION, PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'
import { popupAccount } from 'services/account'
import { DidContext } from 'options/context'

const KidPage = () => {
  const { setIsLoading, setError, setNotification } = useContext(GalleryContext)

  const {
    userKID,
    setuserKID,
    hadData,
    didID,
    profilePictureId,
    setProfilePictureId,
    bannerId,
    setBannerId,
    linkAccounts,
    setLinkAccounts,
    customCss,
    setCustomCss,
    usingCustomCss,
    setUsingCustomCss,
    expandedCssEditor,
    setExpandedCssEditor,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    kID,
    setkID,
    oldkID,
    getDID,
    setCssTemplate
  } = useContext(DidContext)

  const [disableUpdateKID, setDisableUpdateKID] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [isPending, setIsPending] = useState(false)
  const [balance, koiBalance] = useSelector(getBalance)

  const [fieldError, setFieldError] = useState({
    kid: '',
    name: '',
    country: '',
    description: ''
  })

  const kidLinkPrefix = 'https://koii.id/'

  const assets = useSelector((state) => state.assets)
  const defaultAccount = useSelector((state) => state.defaultAccount)

  const modalRef = useRef(null)

  const close = () => setShowModal(false)
  const handleSelectNFTProfileImg = (nft) => {
    setDisableUpdateKID(false)
    if (modalType === 'AVATAR') {
      setProfilePictureId(nft.txId)
      setShowModal(false)
    }
    if (modalType === 'BACKGROUND') {
      setBannerId(nft.txId)
      setShowModal(false)
    }
  }

  useEffect(() => {
    const getPendingStatus = async () => {
      const defaultAccountAddress = await storage.setting.get.activatedAccountAddress()
      const account = await popupAccount.getAccount({ address: defaultAccountAddress })
      const pendingTransactions = await account.get.pendingTransactions()

      for (const transaction of pendingTransactions) {
        const didTransactionTypes = [
          PENDING_TRANSACTION_TYPE.UPDATE_DID,
          PENDING_TRANSACTION_TYPE.CREATE_DID_DATA,
          PENDING_TRANSACTION_TYPE.CREATE_DID,
          PENDING_TRANSACTION_TYPE.REGISTER_KID
        ]

        if (didTransactionTypes.includes(transaction.transactionType)) setIsPending(true)
        break
      }
    }

    getDID()
    getPendingStatus()
  }, [])

  useEffect(() => {
    if (!usingCustomCss)
      setCssTemplate({
        children: {
          '.description': {
            children: {},
            attributes: {}
          },
          '.name': {
            children: {},
            attributes: {}
          },
          '.links': {
            children: {},
            attributes: {}
          },
          '.background': {
            children: {},
            attributes: {}
          },
          '.content-area': {
            children: {},
            attributes: {}
          },
          '.wallet-address': {
            children: {},
            attributes: {}
          },
          '.did-label': {
            children: {},
            attributes: {}
          },
          '.address-name': {
            children: {},
            attributes: {}
          },
          '.address-value': {
            children: {},
            attributes: {}
          },
          '.show-address-button': {
            children: {},
            attributes: {}
          }
        }
      })
  }, [usingCustomCss])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  const toggleExpandedCssEditor = () => setExpandedCssEditor((prev) => !prev)

  const profileSrc = useMemo(() => {
    if (profilePictureId) return `https://arweave.net/${profilePictureId}`
    return DefaultAvt
  }, [profilePictureId])

  const bannerSrc = useMemo(() => {
    if (bannerId) return `https://arweave.net/${bannerId}/`
    return ProfileCover
  }, [bannerId])

  const onChangeUserInfo = (e) => {
    setFieldError({
      kid: '',
      name: '',
      country: '',
      description: ''
    })
    setDisableUpdateKID(false)
    const { name, value } = e.target
    if (name === 'kid') {
      setuserKID({
        ...userKID,
        kidLink: `${kidLinkPrefix}${value}`
      })
      setkID(value)
    } else {
      setuserKID({ ...userKID, [name]: value })
    }
  }

  const handleChangeLinkAccountName = (idx, e) => {
    setDisableUpdateKID(false)
    const prevLinkAccounts = [...linkAccounts]
    prevLinkAccounts[idx]['title'] = e.target.value

    setLinkAccounts(prevLinkAccounts)
  }

  const handleChangeLinkAccountValue = (idx, e) => {
    setDisableUpdateKID(false)
    const prevLinkAccounts = [...linkAccounts]
    prevLinkAccounts[idx]['link'] = e.target.value

    setLinkAccounts(prevLinkAccounts)
  }

  const addLinkAccount = () => {
    setLinkAccounts([...linkAccounts, { title: '', link: '' }])
  }

  const removeLinkAccount = (idx) => {
    const newLinkAccount = [...linkAccounts]
    newLinkAccount.splice(idx, 1)
    setLinkAccounts(newLinkAccount)
  }

  const validateFields = async () => {
    setIsLoading((prev) => ++prev)
    // Validation
    const pattern = /^[A-Za-z0-9]+$/
    const available = await checkAvailable(kID)
    if (!kID) {
      setFieldError((prev) => ({ ...prev, kid: 'kID field must be filled in' }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (!pattern.test(kID)) {
      setFieldError((prev) => ({ ...prev, kid: 'Please try a kID without special characters' }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (kID.length < 5) {
      setFieldError((prev) => ({
        ...prev,
        kid: 'This username is unavailable, please try a different one'
      }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (!available && oldkID !== kID) {
      setFieldError((prev) => ({
        ...prev,
        kid: 'This username is unavailable, please try a different one'
      }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (!userKID.name) {
      setFieldError((prev) => ({ ...prev, name: 'Name field must be filled in' }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (!userKID.country) {
      setFieldError((prev) => ({ ...prev, country: 'Country field must be filled in' }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (!userKID.description) {
      setFieldError((prev) => ({ ...prev, description: 'Description field must be filled in' }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (!profilePictureId) {
      setError('Please select an avatar')
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (!bannerId) {
      setError('Please select a cover image')
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      return
    }

    if (hadData) {
      // balance validate update
      if (balance < 0.00007) {
        setError(`You don't have enough AR`)
        setIsLoading((prev) => --prev)
        setDisableUpdateKID(false)
        return
      }
    } else {
      // balance validate create
      if (balance < 0.0005) {
        setError(`You don't have enough AR`)
        setIsLoading((prev) => --prev)
        setDisableUpdateKID(false)
        return
      }

      if (koiBalance < 1) {
        setError(`You don't have enough KOII`)
        setIsLoading((prev) => --prev)
        setDisableUpdateKID(false)
        return
      }
    }

    setIsLoading((prev) => --prev)
    return true
  }

  const handleSubmit = async () => {
    try {
      setIsLoading((prev) => ++prev)
      setDisableUpdateKID(true)

      const ethAccounts = await popupAccount.getAllAccounts(TYPE.ETHEREUM)
      const ethAddress = await ethAccounts[0]?.get?.address()

      const addresses = userKID['addresses'] || { arweave: defaultAccount.address }

      if (ethAddress) {
        addresses['ether'] = ethAddress
      }

      const state = {
        name: userKID.name,
        description: userKID.description,
        links: linkAccounts,
        picture: profilePictureId,
        banner: bannerId,
        addresses,
        styles: parseCss(customCss),
        code: customCss,
        country: userKID.country,
        pronouns: userKID.pronouns,
        kID
      }

      state.links = state.links.filter((link) => !isEmpty(link.title) && !isEmpty(link.link))

      let result
      if (hadData) {
        /* Update */
        result = await backgroundRequest.gallery.updateDID({
          didData: state,
          txId: didID,
          newkID: oldkID !== kID
        })
        setNotification(NOTIFICATION.UPDATE_KID_SUCCESS)
        setShowConfirmModal(false)
      } else {
        /* Create */
        result = await backgroundRequest.gallery.createDID({ didData: state })
        setNotification(NOTIFICATION.CREATE_KID_SUCCESS)
        setConfirmed(true)
      }

      console.log('result', result)
      setIsLoading((prev) => --prev)
      setIsPending(true)
    } catch (err) {
      console.error(err.message)
      setShowConfirmModal(false)
      setError(err.message)
      setIsLoading((prev) => --prev)
    }
  }

  return (
    <div className="kid-page-wrapper">
      <div className="title-section">
        <div className="title-section__header-group">
          <IDCardIcon />
          <h2>Decentralized Identity</h2>
        </div>
        <p className="leading">
          Create a personalized profile for your web3 identity. Link it to your Twitter bio to
          receive airdrops from Koii partners and other surprises.
        </p>
      </div>
      <div className="form-section">
        <div className="form-img">
          <div className="form-img__img-name">PROFILE IMAGE</div>
          <div className="avatar">
            <div
              className="edit-avatar-layer"
              onClick={() => {
                setShowModal(true)
                setModalType('AVATAR')
              }}
            >
              <EditIcon className="edit-avatar-layer__icon" />
            </div>
            <img className="profile-picture" src={profileSrc}></img>
          </div>
          <div className="avt-desc">
            <Link to="/gallery/create-nft">Or create a new NFT</Link>
          </div>
          <div className="form-img__img-name">COVER IMAGE</div>
          <div className="cover">
            <div
              className="edit-cover-layer"
              onClick={() => {
                setShowModal(true)
                setModalType('BACKGROUND')
              }}
            >
              <EditIcon className="edit-cover-layer__icon" />
            </div>
            <img className="profile-cover" src={bannerSrc} alt="profile-cover" />
          </div>
          <div className="avt-desc">
            Or select <Link to="/gallery/create-nft">an NFT</Link> to make it your profile picture
          </div>
        </div>

        <div className="form-text">
          <KidInputField
            label="kID"
            isRequired={true}
            value={kID}
            setValue={onChangeUserInfo}
            error={fieldError.kid}
          />
          <KidInputField
            label="Name"
            isRequired={true}
            description="or pseudonym"
            value={userKID.name}
            setValue={onChangeUserInfo}
            error={fieldError.name}
          />
          <KidInputField
            label="Country"
            isRequired={true}
            value={userKID.country}
            setValue={onChangeUserInfo}
            error={fieldError.country}
          />
          <KidInputField
            label="Pronouns"
            isRequired={false}
            example="For example: 'she/her' or 'they/them'"
            value={userKID.pronouns}
            setValue={onChangeUserInfo}
          />
          <div className="kid-input">
            <div className="kid-input-label-section">
              <label className="kid-input-label">Description*</label>
            </div>
            <div className="kid-input-input-section">
              <textarea
                value={userKID.description}
                onChange={(e) => onChangeUserInfo(e)}
                name="description"
                className="kid-input-area-field"
                type="text"
              />
              <span className="error">{fieldError.description}</span>
            </div>
          </div>

          <div className="section-name">Link Accounts</div>
          <p className="link-account-desc">
            These links will appear on your kID link and your leaderboard profile
          </p>
          {linkAccounts.map((linkAccounts, idx) => (
            <div className="link-accounts-input-line" key={idx}>
              <input
                className="link-accounts-input-name"
                value={linkAccounts.title}
                placeholder="Label e.g. “Website”"
                onChange={(e) => handleChangeLinkAccountName(idx, e)}
              />
              <input
                className="link-accounts-input-value"
                value={linkAccounts.link}
                placeholder="URL e.g. https://koii.network/"
                onChange={(e) => handleChangeLinkAccountValue(idx, e)}
              />
              <div className="remove-logo" onClick={() => removeLinkAccount(idx)}>
                <RemoveLinkAccount />
              </div>
            </div>
          ))}
          <div className="add-more" onClick={addLinkAccount}>
            <AddIcon className="add-more-icon" />
            Add more
          </div>

          <div className="section-name">Add Custom CSS</div>
          <div className="custom-css-settings">
            <div>Custom CSS</div>
            <ToggleButton value={usingCustomCss} setValue={setUsingCustomCss} />
          </div>
          {usingCustomCss && (
            <div>
              <div className="hint">Hint: use one of these classes</div>
              <ul
                style={{
                  listStyleType: 'circle',
                  paddingLeft: '40px',
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                <li>description</li>
                <li>name</li>
                <li>links</li>
                <li>background</li>
                <li>content-area</li>
                <li>wallet-address</li>
                <li>did-label</li>
                <li>address-name</li>
                <li>address-value</li>
                <li>show-address-button</li>
              </ul>
            </div>
          )}
          {usingCustomCss &&
            (!expandedCssEditor ? (
              <div className="small-editor-wrapper">
                <AceEditor
                  mode="css"
                  theme="monokai"
                  onChange={(val) => {
                    setCustomCss(val)
                    setDisableUpdateKID(false)
                  }}
                  value={customCss}
                  showGutter={false}
                  name="small-editor-id"
                  editorProps={{ $blockScrolling: true }}
                  highlightActiveLine={false}
                  showPrintMargin={false}
                  fontSize={14}
                  onLoad={function (editor) {
                    editor.renderer.setPadding(10)
                    editor.renderer.setScrollMargin(10)
                  }}
                />
                <div className="editor-expand-icon" onClick={toggleExpandedCssEditor}>
                  <ExpandIcon />
                </div>
              </div>
            ) : (
              <div className="expanded-editor-wrapper">
                <div className="expanded-editor-absolute-wrapper">
                  <AceEditor
                    mode="css"
                    theme="monokai"
                    onChange={(val) => {
                      setCustomCss(val)
                      setDisableUpdateKID(false)
                    }}
                    value={customCss}
                    showGutter={false}
                    name="expanded-editor-id"
                    editorProps={{ $blockScrolling: true }}
                    highlightActiveLine={false}
                    showPrintMargin={false}
                    fontSize={14}
                    onLoad={function (editor) {
                      editor.renderer.setPadding(10)
                      editor.renderer.setScrollMargin(10)
                    }}
                  />
                  <div className="editor-close-icon" onClick={toggleExpandedCssEditor}>
                    <CloseIcon />
                  </div>
                </div>
              </div>
            ))}

          <div className="save-kid-btn">
            <div data-tip={isPending ? 'Transaction pending' : ''}>
              <Button
                disabled={disableUpdateKID || isPending}
                onClick={async () => {
                  const validated = await validateFields()
                  if (validated) setShowConfirmModal(true)
                }}
                variant="filled"
                text={hadData ? 'Save Changes' : 'Create My DID'}
                startIcon={CheckIcon}
              />
            </div>
            <ReactTooltip place="top" effect="float" />
          </div>
        </div>
        {showModal && (
          <div ref={modalRef} className="select-nft-profile-modal">
            <GoBackIcon onClick={close} className="go-back-icon" />
            <CloseIcon onClick={close} className="close-icon" />
            <div className="nfts">
              {assets.nfts.map((nft) => {
                if (includes(nft.contentType, 'image') && nft.type === TYPE.ARWEAVE)
                  return (
                    <div
                      className="nft"
                      onClick={() => handleSelectNFTProfileImg(nft)}
                      key={nft.txId}
                    >
                      <div className="nft-image">
                        <img src={nft.imageUrl} />
                      </div>
                      <div className="nft-name">{nft.name}</div>
                    </div>
                  )
              })}
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="confirm-did-modal">
            <div className="title">
              {!confirm ? 'Confirm your DID' : 'Decentralized ID Confirmed'}
              <CloseIconBlue onClick={() => setShowConfirmModal(false)} className="close-icon" />
            </div>
            <div className="content">
              {!confirmed && (
                <div>
                  <div className="content-title">
                    Confirm your personalized Decentralized ID profile.
                  </div>
                  <div className="cost">
                    <div className="cost-title">Estimated Costs:</div>
                    {!hadData && <div className="cost-koii-fee">1 KOII</div>}
                    <div className="cost-ar-fee">{hadData ? '0.00007' : '0.0005'} AR</div>
                    <div className="cost-storage-fee"> Storage Fee</div>
                  </div>
                </div>
              )}
              {confirmed && (
                <div className="success">
                  <div className="success-title">Your DID is finalizing!</div>
                  <div className="success-message">
                    Your Decentralized ID is your<br></br>
                    passport entry to DeFi. Your<br></br>
                    <a className="profile-link" href={`https://koii.id/${kID}`}>
                      profile link
                    </a>{' '}
                    should be ready soon.
                  </div>
                </div>
              )}
              {!confirmed && (
                <button
                  className="confirm-button"
                  disabled={disableUpdateKID}
                  onClick={handleSubmit}
                >
                  {hadData ? 'Update DID' : 'Create DID'}
                </button>
              )}
              {confirmed && (
                <button className="confirm-button" onClick={() => setShowConfirmModal(false)}>
                  OK
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KidPage
