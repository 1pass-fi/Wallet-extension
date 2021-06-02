import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { setActivities } from 'actions/activities'
import { loadActivities } from 'actions/koi'
import { getChromeStorage } from 'utils'

import ActivityRow from './activityRow'
import { STORAGE } from 'koiConstants'

import './index.css'

const propTypes = {
  activities: PropTypes.array,
}

export const ActivitiesList = ({ activities }) => {
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

const AccountLabel = ({ accountName }) => {
  return (
    <div className='activity-account-label'>
      <div className='text'>{accountName}</div>
    </div>
  )
}

const Activity = ({ activities, setActivities, loadActivities }) => {
  useEffect(() => {
    async function handleLoadActivities() {
      const storage = await getChromeStorage([STORAGE.ACTIVITIES_LIST, STORAGE.KOI_ADDRESS])
      if (storage[STORAGE.ACTIVITIES_LIST]) {
        setActivities(storage[STORAGE.ACTIVITIES_LIST])
      }
      if (storage[STORAGE.KOI_ADDRESS]) {
        loadActivities()
      }
    }
    handleLoadActivities()
  }, [])

  return (
    <div className='activity-container'>
      {activities.length !== 0 && <AccountLabel accountName='Account #1' />}
      <ActivitiesList activities={activities} />
    </div>
  )
}

Activity.propTypes = propTypes

const mapStateToProps = (state) => ({ activities: state.activities })

export default connect(mapStateToProps, { setActivities, loadActivities })(Activity)
