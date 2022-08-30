import React, { useContext,useEffect, useMemo, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import { useSelector } from 'react-redux'
import { Link, Prompt } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { checkAvailable } from 'background/helpers/did/koiiMe'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import { NOTIFICATION, PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import DropDown from 'finnie-v2/components/DropDown'
import Hint from 'finnie-v2/components/Hint'
import CloseIcon from 'img/ab-close-icon.svg'
import CheckIcon from 'img/check-icon-circle.svg'
import CloseIconBlue from 'img/close-icon-blue.svg'
import DefaultAvt from 'img/default-avt-green.png'
import EditIcon from 'img/edit-icon-collection.svg'
import GoBackIcon from 'img/goback-icon-26px.svg'
import IDCardIcon from 'img/id-card-icon.svg'
import AddIcon from 'img/navbar/create-nft.svg'
import ProfileCover from 'img/profile-cover-placeholder.png'
import RemoveLinkAccount from 'img/remove-account-links.svg'
import ExpandIcon from 'img/share-icon.svg'
import MagnifierIcon from 'img/v2/magnifier-icon.svg'
import ModalBackground from 'img/v2/modal-background.svg'
import { includes, isEmpty } from 'lodash'
import { DidContext } from 'options/context'
import ToggleButton from 'options/finnie-v1/components/toggleButton'
import { GalleryContext } from 'options/galleryContext'
import { getBalance } from 'options/selectors/defaultAccount'
import { getDisplayAddress } from 'options/utils'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'
import parseCss from 'utils/parseCss'

import 'ace-builds/src-noconflict/theme-monokai'

import Button from '../../../shared/Button'

import countriesList from './countries.json'
import KidInputField from './kidInputField'
import SelectDIDAccount from './SelectDIDAccount'

import 'ace-builds/src-noconflict/mode-css'
import './index.css'

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

  const defaultAccount = useSelector((state) => state.defaultAccount.AR)
  const assets = useSelector((state) => state.assets.nfts)

  const [disableUpdateKID, setDisableUpdateKID] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [nftSearchText, setNftSearchText] = useState('')
  const [filteredAssets, setFilteredAssets] = useState([])

  const [isPending, setIsPending] = useState(false)
  const [balance, koiBalance] = useSelector(getBalance)

  const [fieldError, setFieldError] = useState({
    kid: '',
    name: '',
    country: '',
    description: ''
  })

  const [showSelectDIDAccount, setShowSelectDIDAccount] = useState(true)

  const kidLinkPrefix = 'https://koii.id/'

  const urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i
  const urlRegex = new RegExp(urlExpression)

  const [linkAccountErrors, setLinkAccountErrors] = useState([])

  const kidInput = useRef(null)
  const descriptionInput = useRef(null)

  const onSearchNft = (e) => {
    const text = e.target.value
    setNftSearchText(text)

    const matchedAssets = assets.filter((asset) =>
      includes(asset.name?.toLowerCase(), text.toLowerCase())
    )

    setFilteredAssets(matchedAssets)
  }

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
    setFilteredAssets(assets)
  }, [assets])

  useEffect(() => {
    const getPendingStatus = async () => {
      const defaultAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
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

    const handlePressingEsc = (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handlePressingEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
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
    if (name === 'did link') {
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

  const validateLinkAccounts = () => {
    let validLinkAccounts = true
    let linkErrors = []
    linkAccounts.forEach((linkAccount, idx) => {
      linkErrors[idx] = ''
      if (
        !linkAccount['link'].toLowerCase().startsWith('http://') &&
        !linkAccount['link'].toLowerCase().startsWith('https://')
      ) {
        linkErrors[idx] = 'Links must begin with https:// or http://'
        validLinkAccounts = false
      } else if (!urlRegex.test(linkAccount['link'])) {
        linkErrors[idx] = 'That doesn\'t seem like a valid website. Please try again.'
        validLinkAccounts = false
      }
    })

    setLinkAccountErrors(linkErrors)
    return validLinkAccounts
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
      kidInput.current.scrollIntoView()
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
      kidInput.current.scrollIntoView()
      return
    }

    if (!userKID.name) {
      setFieldError((prev) => ({ ...prev, name: 'Name field must be filled in' }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      kidInput.current.scrollIntoView()
      return
    }

    // DID country should not be required
    // https://app.clickup.com/t/208adfx
    // if (!userKID.country) {
    //   setFieldError((prev) => ({ ...prev, country: 'Country field must be filled in' }))
    //   setIsLoading((prev) => --prev)
    //   setDisableUpdateKID(false)
    //   kidInput.current.scrollIntoView()
    //   return
    // }

    if (!userKID.description) {
      setFieldError((prev) => ({ ...prev, description: 'Description field must be filled in' }))
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      descriptionInput.current.scrollIntoView()
      return
    }

    if (!validateLinkAccounts()) {
      setIsLoading((prev) => --prev)
      setDisableUpdateKID(false)
      descriptionInput.current.scrollIntoView()
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
      <Prompt when={!disableUpdateKID} message="Are you sure you want to leave this page?"></Prompt>
      <div ref={kidInput} className="title-section">
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
            <Link to="/create-nft">Or create a new NFT</Link>
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
          <div className="cover-desc">
            Or create <Link to="/create-nft">an NFT</Link> to make it{' '}
            <Hint
              variant="white"
              className="inline ml-0.5"
              place="bottom"
              text="For best results, your cover<br>image should be 1400x400px"
            />{' '}
            <br></br>
            your cover image
          </div>
        </div>

        <div className="form-text">
          <div data-tip={isPending ? 'DID transactions pending' : ''}>
            <KidInputField
              label="DID Link"
              isRequired={true}
              value={kID}
              setValue={onChangeUserInfo}
              error={fieldError.kid}
              disabled={isPending}
            />
          </div>
          <div data-tip={isPending ? 'DID transactions pending' : ''}>
            <KidInputField
              label="Name"
              isRequired={true}
              description="or pseudonym"
              value={userKID.name}
              setValue={onChangeUserInfo}
              error={fieldError.name}
              disabled={isPending}
            />
          </div>
          <div className="kid-input__country">
            <div className="kid-input__country__label">Country</div>
            <DropDown
              options={countriesList}
              value={userKID.country}
              variant="light"
              onChange={(value) => {
                setDisableUpdateKID(false)
                setuserKID({ ...userKID, country: value })
              }}
              emptyOption={true}
            />
          </div>
          <div data-tip={isPending ? 'DID transactions pending' : ''}>
            <KidInputField
              label="Pronouns"
              isRequired={false}
              example="For example: 'she/her' or 'they/them'"
              value={userKID.pronouns}
              setValue={onChangeUserInfo}
              disabled={isPending}
            />
          </div>
          <div className="kid-input">
            <div className="kid-input-label-section">
              <label className="kid-input-label">Description*</label>
            </div>
            <div
              ref={descriptionInput}
              className="kid-input-input-section"
              data-tip={isPending ? 'DID transactions pending' : ''}
            >
              <textarea
                value={userKID.description}
                onChange={(e) => onChangeUserInfo(e)}
                name="description"
                className="kid-input-area-field"
                type="text"
                disabled={isPending}
              />
              <span className="error">{fieldError.description}</span>
            </div>
          </div>

          <div className="section-name">Link Accounts</div>
          <p className="link-account-desc">
            These links will appear on your DID profile. For best practice, each link should begin
            with https://
          </p>
          {linkAccounts.map((linkAccounts, idx) => (
            <div className="link-accounts-wrapper" key={idx}>
              <div className="link-accounts-input-line">
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
              <span className="link-accounts-error" style={{ color: 'red', marginTop: '5px' }}>
                {linkAccountErrors[idx]}
              </span>
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
            <div data-tip={isPending ? 'DID transactions pending' : ''}>
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
            <div className="title">
              SELECT {modalType === 'AVATAR' ? 'PROFILE' : 'COVER'} PICTURE
            </div>
            <div className="select-nft-modal-search">
              <input placeholder="Search NFTs" value={nftSearchText} onChange={onSearchNft} />
              <MagnifierIcon className="magnifier-icon" />
            </div>
            <div className="nfts">
              {filteredAssets.map((nft) => {
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
          <div className="confirm-did-modal w-full h-full">
            {<ModalBackground className="absolute top-16.75 left-0" />}
            <div className="title">
              {!confirmed ? 'Confirm your DID' : 'Decentralized ID Confirmed'}
              <CloseIconBlue onClick={() => setShowConfirmModal(false)} className="close-icon" />
            </div>
            <div className={clsx('content ml-56', !hadData ? 'mt-10' : 'mt-16')}>
              {!confirmed && (
                <div className="flex flex-col pl-8">
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
            </div>
            {!confirmed && (
              <button
                className="confirm-button flex items-center justify-center w-101 mx-auto mt-2 text-base leading-6"
                disabled={disableUpdateKID}
                onClick={handleSubmit}
              >
                {hadData ? 'Update DID' : 'Create DID'}
              </button>
            )}
            {confirmed && (
              <button
                className="confirm-button flex items-center justify-center w-101 mx-auto mt-8 text-base leading-6"
                onClick={() => setShowConfirmModal(false)}
              >
                OK
              </button>
            )}
          </div>
        )}
      </div>

      {showSelectDIDAccount && (
        <SelectDIDAccount close={() => setShowSelectDIDAccount(false)} />
      )}

      <ReactTooltip place="top" type="dark" effect="float" />
    </div>
  )
}

export default KidPage
