import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { loadActivities } from 'actions/koi'
import { setTransactions } from 'actions/transactions'
import { setError } from 'actions/error'
import { getChromeStorage } from 'utils'

import ActivityRow from './activityRow'
import Button from 'shared/button'
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
      date={activity.date}
      id={activity.id}
      source={activity.source}
    />
  ))
}

export const PendingList = ({ transactions }) => {
  return transactions.map((transaction, index) => (
    <ActivityRow 
      key={index}
      activityName={transaction.activityName}
      expense={transaction.expense}
      date={transaction.date}
      pending={true}
      id={transaction.id}
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

const Activity = ({ activities, loadActivities, cursor, transactions, setTransactions, setError, error }) => {

  useEffect(() => {
    async function handleLoadActivities() {
      const storage = await getChromeStorage([STORAGE.KOI_ADDRESS, STORAGE.PENDING_TRANSACTION])
      const listPendingTransaction = storage[STORAGE.PENDING_TRANSACTION]
      if (storage[STORAGE.KOI_ADDRESS]) {
        loadActivities({ cursor })
      } 
      setTransactions(listPendingTransaction)
    }
    handleLoadActivities()
  }, [])

  const handleLoadMore = () => loadActivities({ cursor })

  return (
    <div className='activity-container'>
      {activities.length !== 0 && <AccountLabel accountName='Account #1' />}
      <PendingList transactions={transactions} />
      <ActivitiesList activities={activities} />
      <Button className='load-more'
        type='outline'
        onClick={handleLoadMore}
        label='See More Activity'
      />
    </div>
  )
}

Activity.propTypes = propTypes

const mapStateToProps = (state) => ({ activities: state.activities, cursor: state.cursor, transactions: state.transactions, contLoading: state.contLoading, error: state.error })

export default connect(mapStateToProps, { loadActivities, setTransactions, setError })(Activity)
