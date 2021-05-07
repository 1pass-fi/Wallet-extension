import React from 'react'
import ExportIcon from 'img/export-icon.svg'
import ImportIcon from 'img/import-icon.svg'
import PlusIcon from 'img/plus-icon-outline.svg'
import './index.css'

const Card = ({ SvgImg, title, description }) => {
    return (
        <div className="option-card">
            <div className="card-title-wrapper">
                <SvgImg className="card-icon" />
                <p className="card-title">{title}</p>
            </div>
            <div className="card-description">{description}</div>
        </div>
    )
}

const CONTENTS = [
    {
        key: 1,
        SvgImg: ImportIcon,
        title: 'Import with a seed phrase',
        description: 'Import an existing wallet using a 12-word seed phrase.'
    }, {
        key: 2,
        SvgImg: ExportIcon,
        title: 'Upload a .JSON wallet file',
        description: 'Import an existing wallet by uploading a .JSON file.'
    }, {
        key: 3,
        SvgImg: PlusIcon,
        title: 'Get a new wallet',
        description: 'Start from the beginning.'
    }
]

export default () => {
    return (
        <div className="account-import">
            {CONTENTS.map(content => <Card {...content} />)}
        </div>
    )
}
