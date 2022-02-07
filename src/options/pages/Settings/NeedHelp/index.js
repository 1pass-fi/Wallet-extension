import { GalleryContext } from 'options/galleryContext'
import React, { useContext } from 'react'

import './index.css'

export default ({ version = '0.2.10' }) => {
  const { setShowWelcome } = useContext(GalleryContext)

  return (
    <div className="need-help-settings-wrapper">
      <div className="need-help-settings">
        <div className="header">Need Help?</div>

        <div className="items">
          <div className="item">
            <div className="title">HAVING AN ISSUE?</div>
            <div className="description">
              Reach out to Koii's &nbsp;
              <a href="https://koii.me/support/" target="_blank" className="link">
                support team
              </a>
              &nbsp; or &nbsp;
              <a href="https://koii.me/featurerequest/" target="_blank" className="link">
                request
              </a>
              &nbsp; a feature.
            </div>
          </div>

          <div className="item">
            <div className="title">HAVE QUESTIONS?</div>
            <div className="description">
              Check out the &nbsp;
              <a href="https://koii.network/faq" target="_blank" rel="noopener" className="link">
                FAQ page
              </a>
              &nbsp; for general questions.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
