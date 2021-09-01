import React, { useEffect, useState, useContext } from 'react'

import ToggleButton from 'options/components/toggleButton'

import { setChromeStorage, getChromeStorage } from 'utils'
import { STORAGE } from 'constants/koiConstants'

import './index.css'
import { isEmpty } from 'lodash'

import { GalleryContext } from 'options/galleryContext'

export default () => {
  const { setShowViews, setShowEarnedKoi } = useContext(GalleryContext)

  const [discoverableNFTs, setDiscoverableNFTs] = useState(true)
  const [displayView, setDisplayView] = useState(true)
  const [displayKoiEarned, setDisplayKoiEarned] = useState(true)

  useEffect(() => {
    const setFromStorage = async () => {
      const storage = await getChromeStorage([STORAGE.SHOW_VIEWS, STORAGE.SHOW_EARNED_KOI])
      if (!isEmpty(storage)) {
        setDisplayView(storage[STORAGE.SHOW_VIEWS])
        setDisplayKoiEarned(storage[STORAGE.SHOW_EARNED_KOI])
      }
    }

    setFromStorage()
  }, [])

  useEffect(() => {
    const setStorage = async () => {
      await setChromeStorage({ [STORAGE.SHOW_VIEWS]: displayView })
      setShowViews(displayView)
      await setChromeStorage({ [STORAGE.SHOW_EARNED_KOI]: displayKoiEarned })
      setShowEarnedKoi(displayKoiEarned)
    }
    setStorage()
  }, [displayKoiEarned, displayView])

  return (
    <div className='galery-settings-wrapper'>
      <div className='galery-settings'>
        <div className='header'>Gallery Settings</div>

        {/* 
          Currently on koi.rocks hasn't had this function yet.
          We will hide this for now.
        */}
        {/* <div className='settings-row'>
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
        </div> */}

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
              value={displayKoiEarned}
              setValue={setDisplayKoiEarned}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
