import { GalleryContext } from 'options/galleryContext'
import React, { useContext } from 'react'

import './index.css'

export default ({ version = '0.2.5' }) => {
  const { setShowWelcome } = useContext(GalleryContext)

  return (
    <div className='about-settings-wrapper'>
      <div className='about-settings'>
        <div className='header'>About Finnie</div>

        <div className='items'>
          <div className='item'>
            <div className='title'>Version Notes</div>
            <div className='description'>
              See the details about the latest release.
            </div>
            <div className='version-note'>
              <button onClick={() => setShowWelcome(true)}>Version &nbsp;{version}&nbsp; Notes</button>
            </div>
          </div>

          <div className='item'>
            <div className='title'>Privacy Policy</div>
            <div className='description'>
              Find Koii’s &nbsp;
              <a
                href='https://koii.network/Privacy_Policy.html'
                target='_blank'
                className='link'
              >
                Privacy Policy here.
              </a>
            </div>
          </div>

          <div className='item'>
            <div className='title'>Terms of Use</div>
            <div className='description'>
              See Koii’s &nbsp;
              <a
                href='https://koii.network/TOU_June_22_2021.pdf'
                target='_blank'
                className='link'
              >
                Terms of Use.
              </a>
            </div>
          </div>

          <div className='item'>
            <div className='title'>Privacy Policy</div>
            <div className='description'>
              Check out &nbsp;
              <a href='https://koii.network/' target='_blank' className='link'>
                Koii’s website
              </a>
              , and the &nbsp;
              <a href='https://koi.rocks/' target='_blank' className='link'>
                NFT leaderboard
              </a>
              .
            </div>
          </div>

          <div className='item'>
            <div className='title'>Need support?</div>
            <div className='description'>
              Email us at &nbsp;
              <a
                href='mailto:support@koii.network'
                target='_blank'
                className='link'
              >
                support@koii.network
              </a>
              .
            </div>
            <div className='report-request'>
              <a
                href='https://koii.me/support/'
                className='link'
                target='_blank'
              >
                Report
              </a>
              &nbsp;a bug or &nbsp;
              <a
                href='https://koii.me/featurerequest/'
                className='link'
                target='_blank'
              >
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
