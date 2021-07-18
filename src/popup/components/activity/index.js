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
import storage from 'storage'

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
      source={transaction.source}
    />
  ))
}

const AccountLabel = ({ accountName }) => {
  return (
    <div className="activity-account-label">
      <div className="text">{accountName}</div>
    </div>
  )
}

const Activity = ({
  activities,
  loadActivities,
  cursor,
  transactions,
  setTransactions,
  setError,
  accountName,
}) => {
  useEffect(() => {
    async function handleLoadActivities() {
      const listPendingTransaction = await storage.arweaveWallet.get.pendingTransactions() || []
      const address = await storage.arweaveWallet.get.address()
      setTransactions(listPendingTransaction)
      
      if (address) {
        await loadActivities(cursor)
      }
    }
    handleLoadActivities()
  }, [])
  
  const handleLoadMore = async () => await loadActivities(cursor)

  return (
    <div className="activity-container">
      {activities.length !== 0 && <AccountLabel accountName={accountName} />}
      <PendingList transactions={transactions} />
      <ActivitiesList activities={activities} />
      {!cursor.doneLoading && (
        <Button
          className="load-more"
          type="outline"
          onClick={handleLoadMore}
          label="See More Activity"
        />
      )}
    </div>
  )
}

Activity.propTypes = propTypes

const mapStateToProps = (state) => ({
  activities: state.activities,
  cursor: state.cursor,
  transactions: state.transactions,
  contLoading: state.contLoading,
  error: state.error,
  accountName: state.accountName
})

export default connect(mapStateToProps, {
  loadActivities,
  setTransactions,
  setError,
})(Activity)
