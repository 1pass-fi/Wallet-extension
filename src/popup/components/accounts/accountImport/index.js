import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ExportIcon from 'img/export-icon.svg'
import ImportIcon from 'img/import-icon.svg'
import PlusIcon from 'img/plus-icon-outline.svg'
import './index.css'
import Card from 'shared/card'
import { getChromeStorage } from 'utils'
import { STORAGE } from 'koiConstants'



const CardOption = ({ SvgImage, title, description, path, onClick }) => {
  return (
    <Link onClick={onClick} style={{ textDecoration: 'none' }} to={path}>
      <Card className="option-card">
        <div className="card-title-wrapper">
          {SvgImage}
          <p className="card-title">{title}</p>
        </div>
        <div className="card-description">{description}</div>
      </Card>
    </Link>
  )
}

export default () => {
  const [selections, setSelections] = useState([])

  const handleOnClick = (path) => {
    const url = chrome.extension.getURL(path)
    chrome.windows.create({
      url,
      focused: true,
      type: 'popup',
      height: 628,
      width: 426
    })
    window.close()
  }

  useEffect(() => {
    const loadSelections = async () => {
      const storage = await getChromeStorage(STORAGE.PENDING_REQUEST)
      const hasPendingRequest = !!storage[STORAGE.PENDING_REQUEST]
      setSelections([
        {
          key: 1,
          SvgImage: <ImportIcon className="card-icon" />,
          title: 'Import with a seed phrase',
          description: 'Import an existing wallet using a 12-word seed phrase.',
          path: '/account/import/phrase'
        }, {
          key: 2,
          SvgImage: <ExportIcon className="card-icon" />,
          title: 'Upload a .JSON wallet file',
          description: 'Import an existing wallet by uploading a .JSON file.',
          path: (hasPendingRequest ? '/account/import/keyfile' : '#'),
          onClick: () => { !hasPendingRequest && handleOnClick('/popup.html?page=upload-json') }
        }, {
          key: 3,
          SvgImage: <PlusIcon className="card-icon" />,
          title: 'Get a new wallet',
          description: 'Start from the beginning.',
          path: (hasPendingRequest ? '/account/create' : '#'),
          onClick: () => { !hasPendingRequest && handleOnClick('/popup.html?page=create-wallet')}
        }
      ])
    }

    loadSelections()
  }, [])

  return (
    <div className="account-import">
      {selections.map(content => <CardOption {...content} />)}
    </div>
  )
}
