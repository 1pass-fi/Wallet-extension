import React, { useContext } from 'react'
import { GalleryContext } from 'options/galleryContext'

import './index.css'

export default ({ version = '0.4.0' }) => {
  const { setShowWelcome } = useContext(GalleryContext)

  return (
    <div className="about-settings-wrapper">
      <div className="about-settings">
        <div className="header">{chrome.i18n.getMessage('About')}</div>

        <div className="items">
          <div className="item version-notes">
            <div>
              <div className="title">{chrome.i18n.getMessage('VersionNotes')}</div>
              <div className="description">{chrome.i18n.getMessage('VersionNotesMsg')}</div>
            </div>
            <div className="version-note">
              <button onClick={() => setShowWelcome(true)}>
                {chrome.i18n.getMessage('Version')} &nbsp;{version}&nbsp;{' '}
                {chrome.i18n.getMessage('Notes')}
              </button>
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('PrivacyPolicy')}</div>
            <div className="description">
              {chrome.i18n.getMessage('Find')} Koii{chrome.i18n.getMessage('Possessive')} &nbsp;
              <a
                href="https://www.koii.network/Privacy_Policy.pdf"
                target="_blank"
                className="link"
              >
                {chrome.i18n.getMessage('PrivacyPolicyHere')}
              </a>
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('TermsOfUse')}</div>
            <div className="description">
              {chrome.i18n.getMessage('See')} Koii{chrome.i18n.getMessage('Possessive')} &nbsp;
              <a href="https://koii.network/TOU_June_22_2021.pdf" target="_blank" className="link">
                {chrome.i18n.getMessage('TermsOfUse')}.
              </a>
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('TheKOIINetwork')}</div>
            <div className="description">
              {chrome.i18n.getMessage('CheckOut')} &nbsp;
              <a href="https://koii.network/" target="_blank" className="link">
                Koii{chrome.i18n.getMessage('Possessive')} {chrome.i18n.getMessage('website')}
              </a>
              , {chrome.i18n.getMessage('AndThe')} &nbsp;
              <a href="https://koi.rocks/" target="_blank" className="link">
                {chrome.i18n.getMessage('NFTLeaderBoard')}
              </a>
              .
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('NeedHelp')}</div>
            <div className="description">
              {chrome.i18n.getMessage('ReactOutToKoii')} &nbsp;
              <a href="https://koii.me/support/" target="_blank" className="link">
                {chrome.i18n.getMessage('supportTeam')}
              </a>
              &nbsp; {chrome.i18n.getMessage('or')} &nbsp;{' '}
              <a href="https://koii.me/featurerequest/" className="link" target="_blank">
                {chrome.i18n.getMessage('request')}
              </a>
              &nbsp; {chrome.i18n.getMessage('aFeature')}.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
