import React from 'react'
import { NavLink } from 'react-router-dom'

import './index.css'

export default () => {
    return (
        <nav>
            <NavLink to="/account" className="nav-item" activeClassName="nav-item-active">
                <div>Accounts</div>
            </NavLink>
            <NavLink to="/assets" className="nav-item" activeClassName="nav-item-active">
                <div>Assets</div>
            </NavLink>
            <NavLink to="/activity" className="nav-item" activeClassName="nav-item-active">
                <div>Activity</div>
            </NavLink>
        </nav>
    )
}
