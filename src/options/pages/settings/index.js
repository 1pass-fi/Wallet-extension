import React from 'react'

import SettingIcon from 'img/navbar/setting.svg'
import BlockRewardIcon from 'img/block-reward-icon.svg'

import './index.css'

export default () => {
  return (
    <div className='settings-page-wrapper'>
      <div className='settings-page'>
        <div className='top-section'>
          <SettingIcon className='settings-icon' />
          <div className='title'>Customization Settings</div>
          <div className='description'>Coming soon!</div>
        </div>
        <div className='content-section'>
          <div className='description'>
            With customization settings, you’ll be able to change the
            presentation of your Gallery and your Collections. A few of the
            coming features include:
          </div>
          <div className='specs'>
            <div className='spec-item'>
              <div className='number'>1</div>
              <div className='text'>
                Edit the theme of your gallery, including background color,
                fonts, and decorations
              </div>
            </div>
            <div className='spec-item'>
              <div className='number'>2</div>
              <div className='text'> Create themes for others to use</div>
            </div>
            <div className='spec-item'>
              <div className='number'>3</div>
              <div className='text'>Edit default exchange currencies</div>
            </div>
            <div className='spec-item'>
              <div className='number'>4</div>
              <div className='text'>
                Filter views (alphabetical, most views, most KOII earned, etc.)
              </div>
            </div>
          </div>
        </div>
        <div className='bottom-section'>
          <div className='reward-box'>
            <BlockRewardIcon className='reward-icon' />
            <div className='reward-text'>
              Have a feature you’d like to see? We want to hear!
              <br /> Fill out &nbsp;<a className='form-link'>this form.</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
