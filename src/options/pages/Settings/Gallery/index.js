import React, { useContext,useEffect } from 'react'
import ToggleButton from 'options/finnie-v1/components/toggleButton'
import { GalleryContext } from 'options/galleryContext'
import storage from 'services/storage'

import './index.css'

export default () => {
  const { showViews, setShowViews, showEarnedKoi, setShowEarnedKoi, walletLoaded } = useContext(GalleryContext)

  useEffect(() => {
    const saveSettings = async () => {
      await storage.setting.set.showViews(showViews)
      await storage.setting.set.showEarnedKoi(showEarnedKoi)
    }

    if (walletLoaded) saveSettings()
  }, [showViews, showEarnedKoi])

  return (
    <div className='galery-settings-wrapper'>
      <div className='galery-settings'>
        <div className='header'>Gallery Settings</div>
        <div className='settings-row'>
          <div className='left'>
            <div className='title'>Display Views</div>
            <div className='description'>
              Show view counts on NFTs and Collections in my gallery.
            </div>
          </div>
          <div className='right'>
            <ToggleButton value={showViews} setValue={setShowViews} />
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
              value={showEarnedKoi}
              setValue={setShowEarnedKoi}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
