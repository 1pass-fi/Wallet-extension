import React from 'react'
import ReactTooltip from 'react-tooltip'

import GoBackIcon from 'img/goback-icon.svg'

import './index.css'


const GoBackBtn = ({ goToPreviousStep }) => {
  return (
    <>
      <div className='goback-button' onClick={goToPreviousStep}>
        <div data-tip='Back'>
          <GoBackIcon />
        </div>
      </div>
      <ReactTooltip place='top' type='dark' effect='float' />
    </>
  )
}

export default GoBackBtn

