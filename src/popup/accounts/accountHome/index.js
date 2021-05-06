import React from 'react'
import plusIcon from '../../../img/plus-icon.svg'
import { Link } from 'react-router-dom'
import './index.css'

export default () => {
    return (
        <Link to='/account/import' className="plus-button">
            <img src={plusIcon}></img>
        </Link>
    )
}
