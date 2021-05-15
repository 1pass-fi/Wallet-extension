import React, { useContext } from 'react'
import PlusIcon from 'img/plus-icon.svg'
import { Link } from 'react-router-dom'
import './index.css'

import Wallet from './wallet/index'

import KoiContext from 'popup/context'

export default () => {
  const { koi, setKoi } = useContext(KoiContext)
  return (
    <div>
      {koi.address ? <Wallet accountAddress={koi.address} koiBalance={koi.koiBalance} arBalance={koi.arBalance} /> :
        <Link to='/account/import' className="plus-button">
          <PlusIcon />
        </Link>}
    </div>
  )
}
