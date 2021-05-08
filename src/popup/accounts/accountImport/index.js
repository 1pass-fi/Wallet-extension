import React from 'react'
import { Link } from 'react-router-dom'

import exportIcon from '../../../img/export-icon.svg'
import importIcon from '../../../img/import-icon.svg'
import plusIcon from '../../../img/plus-icon-outline.svg'
import './index.css'
import Card from '../../shared/card'

const CONTENTS = [
    {
        key: 1,
        SvgImg: ImportIcon,
        title: 'Import with a seed phrase',
        description: 'Import an existing wallet using a 12-word seed phrase.',
        path: '/account/import/phrase'
    }, {
        key: 2,
        SvgImg: ExportIcon,
        title: 'Upload a .JSON wallet file',
        description: 'Import an existing wallet by uploading a .JSON file.',
        path: '/account/import/keyfile'
    }, {
        key: 3,
        SvgImg: PlusIcon,
        title: 'Get a new wallet',
        description: 'Start from the beginning.',
        path: '#'
    }
]

const CardOption = ({ imgSrc, title, description, path }) => {
    return (
        <Link style={{ textDecoration: 'none' }} to={path}>
            <Card className="option-card">
                <div className="card-title-wrapper">
                    <img className="card-icon" src={imgSrc} />
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
