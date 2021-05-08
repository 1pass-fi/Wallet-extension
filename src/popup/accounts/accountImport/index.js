import React from 'react'
import { Link } from 'react-router-dom'

import ExportIcon from 'img/export-icon.svg'
import ImportIcon from 'img/import-icon.svg'
import PlusIcon from 'img/plus-icon-outline.svg'
import './index.css'
import Card from 'shared/card'

const CONTENTS = [
  {
    key: 1,
    SvgImage: <ImportIcon className="card-icon"/>,
    title: 'Import with a seed phrase',
    description: 'Import an existing wallet using a 12-word seed phrase.',
    path: '/account/import/phrase'
  }, {
    key: 2,
    SvgImage: <ExportIcon className="card-icon"/>,
    title: 'Upload a .JSON wallet file',
    description: 'Import an existing wallet by uploading a .JSON file.',
    path: '/account/import/keyfile'
  }, {
    key: 3,
    SvgImage: <PlusIcon className="card-icon"/>,
    title: 'Get a new wallet',
    description: 'Start from the beginning.',
    path: '#'
  }
]

const CardOption = ({ SvgImage, title, description, path }) => {
  return (
    <Link style={{ textDecoration: 'none' }} to={path}>
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
  return (
    <div className="account-import">
      {CONTENTS.map(content => <CardOption {...content} />)}
    </div>
  )
}
