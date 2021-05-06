import React from 'react'
import logoIcon from '../../img/koi-logo.svg'
import settingIcon from '../../img/settings-icon.svg'
import NavBar from './navBar'
import './index.css'

export default () => {
    return (
        <>
            <header>
                <img className="logo" src={logoIcon} />
                <button className="gallery-button">My NFT Gallery</button>
                <button className="setting-button">
                    <img src={settingIcon}></img>
                </button>
            </header >
            <NavBar />
        </>
    )
}
