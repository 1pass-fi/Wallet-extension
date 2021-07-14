import React, { useState } from 'react'

import ToggleButton from 'options/components/toggleButton'

import './index.css'

export default () => {
  const [discoverableNFTs, setDiscoverableNFTs] = useState(true)
  const [displayView, setDisplayView] = useState(true)
  const [displayKoiEnrned, setDisplayKoiEnrned] = useState(true)

  return (
    <div className='galery-settings-wrapper'>
      <div className='galery-settings'>
        <div className='header'>Gallery Settings</div>
        <div className='settings-row'>
          <div className='left'>
            <div className='title'>Discoverable NFTs</div>
            <div className='description'>
              When adding or creating NFTs, they will be added to&nbsp;
              <a href='#' className='leaderboard'>
                the koi.rocks leaderboard
              </a>
              &nbsp;to earn more attention.
            </div>
          </div>
          <div className='right'>
            <ToggleButton
              value={discoverableNFTs}
              setValue={setDiscoverableNFTs}
            />
          </div>
        </div>

        <div className='settings-row'>
          <div className='left'>
            <div className='title'>Display Views</div>
            <div className='description'>
              Show view counts on NFTs and Collections in my gallery.
            </div>
          </div>
          <div className='right'>
            <ToggleButton value={displayView} setValue={setDisplayView} />
          </div>
        </div>

        <div className='settings-row'>
          <div className='left'>
            <div className='title'>Display KOII Earned</div>
            <div className='description'>
              Show amount of KOII earned on NFTs and Collections in my gallery.
            </div>
          </div>
          <div className='right'>
            <ToggleButton
              value={displayKoiEnrned}
              setValue={setDisplayKoiEnrned}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
