import React, { useContext } from 'react'
import { GalleryContext } from 'options/galleryContext'

import './index.css'

export default ({ version = '0.4.0' }) => {
  const { setShowWelcome } = useContext(GalleryContext)

  return (
    <div className="need-help-settings-wrapper">
      <div className="need-help-settings">
        <div className="header">{chrome.i18n.getMessage('needHelp')}</div>

        <div className="items">
          <div className="item">
            <div className="title">{chrome.i18n.getMessage('havingAnIssueUc')}?</div>
            <div className="description">
              {chrome.i18n.getMessage('reactOutToKoii')} &nbsp;
              <a href="https://koii.me/support/" target="_blank" className="link">
                {chrome.i18n.getMessage('supportTeamLc')}
              </a>
              &nbsp; {chrome.i18n.getMessage('orLc')} &nbsp;
              <a href="https://koii.me/featurerequest/" target="_blank" className="link">
                {chrome.i18n.getMessage('requestLc')}
              </a>
              &nbsp; {chrome.i18n.getMessage('aFeatureLc')}.
            </div>
          </div>

          <div className="item">
            <div className="title">{chrome.i18n.getMessage('haveQuestionsUc')}?</div>
            <div className="description">
              {chrome.i18n.getMessage('checkOutThe')} &nbsp;
              <a href="https://koii.network/faq" target="_blank" rel="noopener" className="link">
                {chrome.i18n.getMessage('faqPage')}
              </a>
              &nbsp; {chrome.i18n.getMessage('forGeneralQuestionsLc')}.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
