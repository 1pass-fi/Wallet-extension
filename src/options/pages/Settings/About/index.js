import React, { useContext } from 'react'
import { GalleryContext } from 'options/galleryContext'

import './index.css'

export default ({ version = '0.3.4' }) => {
  const { setShowWelcome } = useContext(GalleryContext)

  return (
    <div className="about-settings-wrapper">
      <div className="about-settings">
        <div className="header">About</div>

        <div className="items">
          <div className="item version-notes">
            <div>
              <div className="title">Version Notes</div>
              <div className="description">See the details about the latest release.</div>
            </div>
            <div className="version-note">
              <button onClick={() => setShowWelcome(true)}>
                Version &nbsp;{version}&nbsp; Notes
              </button>
            </div>
          </div>

          <div className="item">
            <div className="title">Privacy Policy</div>
            <div className="description">
              Find Koii’s &nbsp;
              <a href="https://koii.network/Privacy_Policy.html" target="_blank" className="link">
                Privacy Policy here.
              </a>
            </div>
          </div>

          <div className="item">
            <div className="title">Terms of Use</div>
            <div className="description">
              See Koii’s &nbsp;
              <a href="https://koii.network/TOU_June_22_2021.pdf" target="_blank" className="link">
                Terms of Use.
              </a>
            </div>
          </div>

          <div className="item">
            <div className="title">The KOII network</div>
            <div className="description">
              Check out &nbsp;
              <a href="https://koii.network/" target="_blank" className="link">
                Koii’s website
              </a>
              , and the &nbsp;
              <a href="https://koi.rocks/" target="_blank" className="link">
                NFT leaderboard
              </a>
              .
            </div>
          </div>

          <div className="item">
            <div className="title">Need help?</div>
            <div className="description">
              Reach out to Koii's &nbsp;
              <a href="https://koii.me/support/" target="_blank" className="link">
                support team
              </a>
              &nbsp; or &nbsp;{' '}
              <a href="https://koii.me/featurerequest/" className="link" target="_blank">
                request
              </a>
              &nbsp; a feature.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
