import React from 'react'
import PlusIcon from 'img/plus-icon.svg'
import { Link } from 'react-router-dom'
import './index.css'

export default () => {
  return (
    <Link to='/account/import' className="plus-button">
      <PlusIcon />
    </Link>
  )
}
