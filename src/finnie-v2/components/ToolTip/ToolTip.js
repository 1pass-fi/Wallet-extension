import React from 'react'
import ReactTooltip from 'react-tooltip'

import './index.css'

const ToolTip = (props) => (
  <ReactTooltip
    className="tooltip"
    border={true}
    borderColor="white"
    backgroundColor="#353563"
    effect="float"
    multiline={true}
    {...props}
  />
)

export default ToolTip
