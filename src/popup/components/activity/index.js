import React from 'react'
import PropTypes from 'prop-types'

import ActivityRow from './activityRow'

import './index.css'

const propTypes = {
  activities: PropTypes.array,
}

const ActivitiesList = ({ activities }) => {
  return activities.map((activity, index) => (
    <ActivityRow
      key={index}
      activityName={activity.activityName}
      expense={activity.expense}
      accountName={activity.accountName}
      date={activity.date}
    />
  ))
}

const Activity = ({ activities }) => {
  return (
    <div className='activity-container'>
      <ActivitiesList activities={activities} />
    </div>
  )
}

Activity.propTypes = propTypes

export default Activity
