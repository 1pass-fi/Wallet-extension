import React from 'react'

import './index.css'
import UploadIcon from '../../../img/import-icon.svg'
import Card from '../../shared/card/index'
import InputField from '../../shared/inputField/index'
import ButtonShared from '../../shared/button/index'

export default () => {
    return (
        <div className="account-import-phrase">
            <Card className="import-phrase">
                <div className="title">
                    <img src={UploadIcon} />
                    <p>Import a wallet</p>
                </div>
                <div className="fields">
                    <InputField label="12-word seed phrase" onChange={() => { }} placeholder="Paste seed phrase here" />
                    <InputField label="New password" onChange={() => { }} placeholder="Make it unique (min. 8 characters)" />
                    <InputField label="Confirm password" onChange={() => { }} placeholder="" />
                </div>
                <div className="term-service">
                    <div className="checkbox">
                        <input type="checkbox" />
                    </div>
                    <label>I agree with the <a href="#">Terms of Service</a></label>
                </div>
                <div className="button">
                    <ButtonShared label="Import Wallet" />
                </div>
            </Card>
        </div>
    )
}
