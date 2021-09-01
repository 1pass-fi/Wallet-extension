// modules
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

// styles
import './index.css'

export const Navbar = ({ activityNotifications }) => {
  return (
    <nav>
      <NavLink to="/account" className="nav-item" activeClassName="nav-item-active">
        <div>Accounts</div>
      </NavLink>
      <NavLink to="/assets" className="nav-item" activeClassName="nav-item-active">
        <div>Assets</div>
      </NavLink>
      <NavLink to="/activity" className="nav-item" activeClassName="nav-item-active">
        <div className='activity-tab'>
          { activityNotifications.length > 0 &&
            <div className={'activity-notifications'}>{activityNotifications.length}</div>
          }
          Activity
        </div>
      </NavLink>
    </nav>
  )
}

const mapStateToProps = (state) => ({ activityNotifications: state.activityNotifications })

export default connect(mapStateToProps)(Navbar)
