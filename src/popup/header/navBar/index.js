import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import './index.css'



export default () => {

    useRouteMatch()
    const pageIsActivate = (slug) => (window.location.href).includes(slug)
    
    return (
        <nav>
            <Link to="/account/home" className="nav-item"><div className={pageIsActivate('account') ? "nav-item-active" : ""}>Accounts</div></Link>
            <Link to="/assets" className="nav-item"><div className={pageIsActivate('assets') ? "nav-item-active" : ""}>Assets</div></Link>
            <Link to="/activity" className="nav-item"><div className={pageIsActivate('activity') ? "nav-item-active" : ""}>Activity</div></Link>
        </nav>
    )
}
