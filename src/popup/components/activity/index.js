import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { loadActivities } from 'actions/koi'
import { setTransactions } from 'actions/transactions'
import { setError } from 'actions/error'
import { getChromeStorage } from 'utils'

import ActivityRow from './activityRow'
import Button from 'shared/button'
import { STORAGE } from 'koiConstants'

import './index.css'
import storage from 'storage'
import { Account, popupAccount } from 'account'
import { setActivities } from 'popup/actions/activities'

import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

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

const AccountLabel = ({ accountName, collapsed, setCollapsed }) => {
  return (
    <div className="activity-account-label">
      <div className="text">{accountName}</div>
      {!collapsed && <div onClick={() => setCollapsed(!collapsed)} className="collapse-icon"><CollapseIcon /></div>}
      {collapsed && <div onClick={() => setCollapsed(!collapsed)} className="collapse-icon"><ExtendIcon /></div>}
    </div>
  )
}


/* 
  Activities of single account
*/
const Activity = ({
  activityItems,
  account,
  cursor,
  loadActivities
}) => {
  const [transactions, setTransactions] = useState([])
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    async function handleLoadActivities() {
      await loadActivities(cursor, account.address)
      
      const _account = await popupAccount.getAccount({ address: account.address })
      const pendingTransactions = await _account.get.pendingTransactions() || []
      setTransactions(pendingTransactions)
    }
    handleLoadActivities()
  }, [])

  const handleLoadMore = async () => await loadActivities(cursor, account.address)

  return (
    <div className={collapsed ? 'activity-container collapsed' : 'activity-container'}>
      <AccountLabel collapsed={collapsed} setCollapsed={setCollapsed} accountName={account.accountName} />
      <PendingList transactions={transactions} />
      <ActivitiesList activities={activityItems} />
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

/* 
  Activities of all accounts
*/
const Activities = ({ activities, setActivities, loadActivities, accounts }) => {
  useEffect(() => {
    async function loadActivitiesBoilerplate() {
      const activitiesPayloads = []
      accounts.forEach(account => {
        activitiesPayloads.push({ account, activityItems: [], cursor: { ownedCursor: null, recipientCursor: null, doneLoading: null } })
      })
      if (isEmpty(activities)) setActivities(activitiesPayloads)
    }

    loadActivitiesBoilerplate()
  }, [])

  return (
    <div>
      {activities.map((activity, index) =>
        <Activity 
          key={index}
          activityItems={activity.activityItems}
          account={activity.account}
          cursor={activity.cursor}
          loadActivities={loadActivities}
        />
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({ activities: state.activities, accounts: state.accounts })

export default connect(mapStateToProps, {
  loadActivities,
  setTransactions,
  setError,
  setActivities
})(Activities)
