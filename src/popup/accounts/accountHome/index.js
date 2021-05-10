import React, { useContext } from 'react'
import PlusIcon from 'img/plus-icon.svg'
import { Link } from 'react-router-dom'
import './index.css'

import KoiContext from 'popup/context'

export default () => {
  const { koi, setKoi } = useContext(KoiContext)
  return (
    <div>
      {koi.arBalance ? <h1>ArBalance: {koi.arBalance}</h1> : ''}
      {koi.koiBalance ? <h1>KoiBalance: {koi.koiBalance}</h1> : ''}
      {koi.address ? <h1>KoiAddress: {koi.address}</h1> : ''}
      <Link to='/account/import' className="plus-button">
        <PlusIcon />
      </Link>
    </div>
  )
}
