import React from 'react'
import get from 'lodash/get'

import QuestionMarkIcon from 'img/startup/question-mark.svg'

import './index.css'

export default ({
  icon: Icon,
  title: Title,
  description: Description,
  selected,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`${get(props, 'className', '')}  ${
        selected ? 'selected' : ''
      } wallet-type`}
    >
      <Icon />
      <Title className='wallet-type-title' />
      <div className='wallet-type-description'>
        {Description && (
          <>
            <QuestionMarkIcon className='question-icon' />
            <Description className='wallet-type-description-text' />
          </>
        )}
      </div>
    </div>
  )
}
