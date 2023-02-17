import React, { useContext } from 'react'
import { GalleryContext } from 'options/galleryContext'

import './index.css'

export default ({ version = '0.4.0' }) => {
  const { setShowWelcome } = useContext(GalleryContext)

  return (
    <div className="need-help-settings-wrapper">
      <div className="need-help-settings">
        <div className="header">{chrome.i18n.getMessage('NeedHelp')}</div>

        <div className="items">
          <div className="item">
            <div className="title">{chrome.i18n.getMessage('HavingAnIssue')}?</div>
            <div className="description">
              {chrome.i18n.getMessage('ReactOutToKoii')} &nbsp;
              <a href="https://koii.me/support/" target="_blank" className="link">
                {chrome.i18n.getMessage('supportTeam')}
              </a>
              &nbsp; {chrome.i18n.getMessage('or')} &nbsp;
              <a href="https://koii.me/featurerequest/" target="_blank" className="link">
                {chrome.i18n.getMessage('request')}
              </a>
              &nbsp; {chrome.i18n.getMessage('aFeature')}.
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('HAVEQUESTIONS')}?</div>
            <div className="description">
              {chrome.i18n.getMessage('CheckOutThe')} &nbsp;
              <a href="https://koii.network/faq" target="_blank" rel="noopener" className="link">
                {chrome.i18n.getMessage('FAQPage')}
              </a>
              &nbsp; {chrome.i18n.getMessage('ForGeneralQuestions')}.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
