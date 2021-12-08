import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/theme-monokai'

import IDCardIcon from 'img/id-card-icon.svg'
import AddIcon from 'img/navbar/create-nft.svg'
import EditIcon from 'img/edit-icon-collection.svg'
import DefaultAvt from 'img/default-avt-green.svg'
import KidInputField from './kidInputField'
import ProfileCover from 'img/profile-cover-placeholder.png'
import RemoveLinkAccount from 'img/remove-account-links.svg'
import Button from '../../../shared/Button'
import ToggleButton from 'options/components/toggleButton'
import ExpandIcon from 'img/share-icon.svg'
import CloseIcon from 'img/ab-close-icon.svg'

import parseCss from 'utils/parseCss'

import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import './index.css'

const KidPage = () => {
  const kidLinkPrefix = 'https://koii.me/u/'

  const [userKID, setuserKID] = useState({
    kidLink: kidLinkPrefix,
    name: '',
    country: '',
    pronouns: '',
    description: '',
  })

  const [profilePictureId, setProfilePictureId] = useState(null)
  const [bannerId, setBannerId] = useState(null) 

  const [linkAccounts, setLinkAccounts] = useState([{ title: '', link: '' }])
  const [customCss, setCustomCss] = useState('')

  const [usingCustomCss, setUsingCustomCss] = useState(false)
  const [expandedCssEditor, setExpandedCssEditor] = useState(false)

  const toggleExpandedCssEditor = () => setExpandedCssEditor((prev) => !prev)

  const profileSrc = useMemo(() => {
    if (profilePictureId) return `https://arweave.net/${profilePictureId}`
    return ProfileCover
  }, [profilePictureId])

  const bannerSrc = useMemo(() => {
    if (bannerId) return `https://arweave.net/${bannerId}/`
    return ProfileCover
  }, [bannerId])

  const onChangeUserInfo = (e) => {
    const { name, value } = e.target
    if (name === 'kid') {
      setuserKID({
        ...userKID,
        kidLink: `${kidLinkPrefix}${value.slice(kidLinkPrefix.length)}`.replaceAll(' ', ''),
      })
    } else {
      setuserKID({ ...userKID, [name]: value })
    }
  }

  const handleChangeLinkAccountName = (idx, e) => {
    const prevLinkAccounts = [...linkAccounts]
    prevLinkAccounts[idx]['title'] = e.target.value

    setLinkAccounts(prevLinkAccounts)
  }

  const handleChangeLinkAccountValue = (idx, e) => {
    const prevLinkAccounts = [...linkAccounts]
    prevLinkAccounts[idx]['link'] = e.target.value

    setLinkAccounts(prevLinkAccounts)
  }

  const addLinkAccount = () => {
    setLinkAccounts([...linkAccounts, { name: '', value: '' }])
  }

  const removeLinkAccount = (idx) => {
    const newLinkAccount = [...linkAccounts]
    newLinkAccount.splice(idx, 1)
    setLinkAccounts(newLinkAccount)
  }

  const handleSubmit = async () => {
    console.log('===== STATE =====')
    const state = {
      name: userKID.name,
      description: userKID.description,
      links: linkAccounts,
      picture: 'Rmz-ZNlaKBSAg30DR6-2Xyx4JFKvfkwn9j_YVFl0HVM',
      banner: 'xmGWfLSUNJ5LPNbTUKVWJhXsSf-tkmA5cEAl0UsNjQg',
      addresses: [],
      styles: parseCss(customCss),
      code: customCss
    }

    const result = await backgroundRequest.gallery.createDID({ didData: state })
    console.log('result', result)
  } 

  return (
    <div className="kid-page-wrapper">
      <div className="title-section">
        <IDCardIcon />
        <h2>Decentralized Identity</h2>
        <p className="leading">
          Connect to the decentralized internet with just your wallet. No more email log-ins or
          giving your personal data straight to Big Tech. This information will be public.
        </p>
        <div className="wallet-address">KOII Wallet: 12345...12345 (Account 1)</div>
      </div>
      <div className="form-section">
        <div className="form-img">
          <div className="img">
            <img className="profile-picture" src={profileSrc}></img>
          </div>
          <Button startIcon={EditIcon} text="Change Avatar" />
          <div className="avt-desc">
            Or <Link to="/create">create an NFT</Link> to add a new image to your gallery
          </div>
          <img className="profile-cover" src={bannerSrc} alt="profile-cover"></img>
          <Button startIcon={EditIcon} text="Change Background" />
          <div className="avt-desc">This is yout cover image</div>
        </div>

        <div className="form-text">
          <KidInputField
            label="kID"
            isRequired={true}
            value={userKID.kidLink}
            setValue={onChangeUserInfo}
          />
          <KidInputField
            label="Name"
            isRequired={true}
            description="or pseudonym"
            value={userKID.name}
            setValue={onChangeUserInfo}
          />
          <KidInputField
            label="Country"
            isRequired={true}
            value={userKID.country}
            setValue={onChangeUserInfo}
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
                value={linkAccounts.name}
                placeholder="Label (e.g. “Website”)"
                onChange={(e) => handleChangeLinkAccountName(idx, e)}
              />
              <input
                className="link-accounts-input-value"
                value={linkAccounts.value}
                placeholder="https://koii.network/"
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
          {usingCustomCss &&
            (!expandedCssEditor ? (
              <div className="small-editor-wrapper">
                <AceEditor
                  mode="css"
                  theme="monokai"
                  onChange={(val) => {
                    setCustomCss(val)
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
            <Button onClick={handleSubmit} variant="filled" text="Save & Update" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default KidPage
