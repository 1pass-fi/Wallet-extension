import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './index.css'

const propTypes = {
  id: PropTypes.string,
  activityName: PropTypes.string,
  expense: PropTypes.number,
  pending: PropTypes.bool,
  date: PropTypes.string,
  source: PropTypes.string
}

const ActivityRow = ({ activityName, expense, date, source, id, pending }) => {
  const url = 'https://viewblock.io/arweave/tx'

  return (
    <div className='activity-row-container'>
      <div className='activity-info main'>
        <div className='activity-name'>{activityName}</div>
        <div className='activity-expense'>{activityName === 'Received AR' ? '+' : '-'} {expense} {activityName === 'Sent KOI' ? 'KOI' : 'AR'}</div>
      </div>
      <div className='activity-info sub'>
        <div className='activity-account'>{pending ? 'Transaction pending' : <a target="_blank" href={`${url}/${id}`}><button>view block</button></a>}</div>
        <div className='activity-date'>{date}</div>
      </div>
      {(activityName.includes('KOI') || activityName.includes('AR')) && <div>{activityName.includes('Sent') ? 'to ' : 'from '}{source}</div>}
    </div>
  )
}

ActivityRow.propTypes = propTypes

export default ActivityRow
