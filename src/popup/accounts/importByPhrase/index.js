import React from 'react'

import './index.css'
import UploadIcon from '../../../img/import-icon.svg'
import Card from '../../shared/card/index'
import InputField from '../../shared/inputField/index'
import CreatePassword from '../../shared/createPassword/index'


export default () => {
    return (
        <div className="account-import-phrase">
            <Card className="import-phrase">
                <div className="title">
                    <img src={UploadIcon} />
                    <p>Import a wallet</p>
                </div>
                <InputField label="12-word seed phrase" onChange={() => { }} placeholder="Paste seed phrase here" />
                <CreatePassword />
            </Card>
        </div>
    )
}
