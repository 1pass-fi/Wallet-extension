import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './index.css'

const propTypes = {
  activityName: PropTypes.string,
  expense: PropTypes.number,
  accountName: PropTypes.string,
  date: PropTypes.instanceOf(Date)
}

const ActivityRow = ({ activityName, expense, accountName, date }) => {
  const dateFormat = (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }
  return (
    <div className='activity-row-container'>
      <div className='activity-info main'>
        <div className='activity-name'>{activityName}</div>
        <div className='activity-expense'>- {expense} {activityName === 'Transfer KOI' ? 'KOI' : 'AR'}</div>
      </div>
      <div className='activity-info sub'>
        <div className='activity-account'>{accountName}</div>
        <div className='activity-date'>{dateFormat(date)}</div>
      </div>
    </div>
  )
}

ActivityRow.propTypes = propTypes

export default ActivityRow
