import clsx from 'clsx'
import React from 'react'
import ReactTooltip from 'react-tooltip'

import QuestionMark from 'img/v2/question-mark-icon.svg'

import './index.css'

const Hint = ({ text, className, ...props }) => {
  return (
    <>
      <QuestionMark data-for="hint" className={clsx('w-5.5', className)} data-tip={text} />
      <ReactTooltip
        className="tooltip"
        border={true}
        borderColor="white"
        backgroundColor="#353563"
        id="hint"
        effect="float"
        multiline={true}
        {...props}
      />
    </>
  )
}

export default Hint
