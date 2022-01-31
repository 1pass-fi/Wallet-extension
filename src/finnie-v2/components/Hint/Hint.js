import clsx from 'clsx'
import React from 'react'
import ReactTooltip from 'react-tooltip'

import QuestionMarkBlue from 'img/v2/question-mark-icon-blue.svg'
import QuestionMarkWhite from 'img/v2/question-mark-icon-white.svg'

import './index.css'

const Hint = ({ text, className, variant = 'blue', ...props }) => {
  return (
    <>
      {variant === 'blue' ? (
        <QuestionMarkBlue
          data-for={`hint-${text.replaceAll(' ', '')}`}
          className={clsx('w-5.5 focus:outline-none', className)}
          data-tip={text}
        />
      ) : (
        <QuestionMarkWhite
          data-for="hint"
          data-for={`hint-${text.replaceAll(' ', '')}`}
          className={clsx('w-5.5 focus:outline-none', className)}
          data-tip={text}
        />
      )}
      <ReactTooltip
        className="tooltip"
        border={true}
        borderColor="white"
        backgroundColor="#353563"
        id={`hint-${text.replaceAll(' ', '')}`}
        effect="float"
        multiline={true}
        {...props}
      />
    </>
  )
}

export default Hint
