import React from 'react'
import exportIcon from '../../../img/export-icon.svg'
import importIcon from '../../../img/import-icon.svg'
import plusIcon from '../../../img/plus-icon-outline.svg'
import './index.css'
import Card from '../../shared/card'

const CONTENTS = [
    {
        key: 1,
        imgSrc: importIcon,
        title: 'Import with a seed phrase',
        description: 'Import an existing wallet using a 12-word seed phrase.'
    }, {
        key: 2,
        imgSrc: exportIcon,
        title: 'Upload a .JSON wallet file',
        description: 'Import an existing wallet by uploading a .JSON file.'
    }, {
        key: 3,
        imgSrc: plusIcon,
        title: 'Get a new wallet',
        description: 'Start from the beginning.'
    }
]

const CardOption = ({ imgSrc, title, description }) => {
    return (
        <Card className="option-card">
            <div className="card-title-wrapper">
                <img className="card-icon" src={imgSrc} />
                <p className="card-title">{title}</p>
            </div>
            <div className="card-description">{description}</div>
        </Card>
    )
}

export default () => {
    return (
        <div className="account-import">
            {CONTENTS.map(content => <CardOption {...content} />)}
        </div>
    )
}
