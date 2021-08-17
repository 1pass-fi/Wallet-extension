import React from 'react'
import get from 'lodash/get'

import './index.css'

export default (props) => {
  return (
    <button
      {...props}
      className={`${get(props, 'className', '')} custom-button`}
    >
      {props.children}
    </button>
  )
}
