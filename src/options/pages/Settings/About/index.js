import React, { useContext } from 'react'
import { GalleryContext } from 'options/galleryContext'

import './index.css'

export default ({ version = '0.4.2' }) => {
  const { setShowWelcome } = useContext(GalleryContext)

  return (
    <div className="about-settings-wrapper">
      <div className="about-settings">
        <div className="header">{chrome.i18n.getMessage('about')}</div>

        <div className="items">
          <div className="item version-notes">
            <div>
              <div className="title">{chrome.i18n.getMessage('versionNotes')}</div>
              <div className="description">{chrome.i18n.getMessage('versionNotesMsg')}</div>
            </div>
            <div className="version-note">
              <button onClick={() => setShowWelcome(true)}>
                {chrome.i18n.getMessage('version')} &nbsp;{version}&nbsp;{' '}
                {chrome.i18n.getMessage('notes')}
              </button>
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('privacyPolicy')}{'.'}</div>
            <div className="description">
              {chrome.i18n.getMessage('find')} Koii{chrome.i18n.getMessage('possessive')} &nbsp;
              <a
                href="https://www.koii.network/Privacy_Policy.pdf"
                target="_blank"
                className="link"
              >
                {chrome.i18n.getMessage('privacyPolicyHere')}{'.'}
              </a>
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('termsOfUse')}</div>
            <div className="description">
              {chrome.i18n.getMessage('see')} Koii{chrome.i18n.getMessage('possessive')} &nbsp;
              <a href="https://koii.network/TOU_June_22_2021.pdf" target="_blank" className="link">
                {chrome.i18n.getMessage('termsOfUse')}.
              </a>
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('theKOIINetwork')}</div>
            <div className="description">
              {chrome.i18n.getMessage('checkOut')} &nbsp;
              <a href="https://koii.network/" target="_blank" className="link">
                Koii{chrome.i18n.getMessage('possessive')} {chrome.i18n.getMessage('websiteLc')}
              </a>
              , {chrome.i18n.getMessage('andTheLc')} &nbsp;
              <a href="https://koi.rocks/" target="_blank" className="link">
                {chrome.i18n.getMessage('nftLeaderBoard')}
              </a>
              .
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('needHelp')}</div>
            <div className="description">
              {chrome.i18n.getMessage('reactOutToKoii')} &nbsp;
              <a href="https://koii.me/support/" target="_blank" className="link">
                {chrome.i18n.getMessage('supportTeamLc')}
              </a>
              &nbsp; {chrome.i18n.getMessage('orLc')} &nbsp;{' '}
              <a href="https://koii.me/featurerequest/" className="link" target="_blank">
                {chrome.i18n.getMessage('requestLc')}
              </a>
              &nbsp; {chrome.i18n.getMessage('aFeatureLc')}.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
