import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { loadActivities } from 'actions/koi'
import { setTransactions } from 'actions/transactions'
import { setError } from 'actions/error'
import { setActivityNotifications } from 'actions/activityNotification'

import { getChromeStorage } from 'utils'

import ActivityRow from './activityRow'
import ConfirmedAsset from './ConfirmedAsset'
import Button from 'shared/button'

import './index.css'
import storage from 'storage'
import { Account, popupAccount } from 'account'
import { setActivities } from 'popup/actions/activities'

import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'


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
      accountName={transaction.accountName}
    />
  ))
}

export const ConfirmedAssetList = ({ transactions }) => {
  return transactions.map((transaction, index) => (
    <ConfirmedAsset 
      key={index}
      title={transaction.title}
      id={transaction.id}
      date={transaction.date}
    />
  ))
}

export const PendingConfirmationList = ({ transactions }) => {
  return transactions.map((transaction, index) => (
    <ActivityRow
      key={index}
      activityName={transaction.activityName}
      expense={transaction.expense}
      date={transaction.date}
      pendingConfirmation={true}
      id={transaction.id}
      source={transaction.source}
      accountName={transaction.accountName}
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
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    async function handleLoadActivities() {
      await loadActivities(cursor, account.address)
    }
    handleLoadActivities()
  }, [])

  const handleLoadMore = async () => await loadActivities(cursor, account.address)

  return (
    <div className={collapsed ? 'activity-container collapsed' : 'activity-container'}>
      <AccountLabel collapsed={collapsed} setCollapsed={setCollapsed} accountName={account.accountName} />
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
const Activities = ({ 
  activities, 
  setActivities, 
  loadActivities, 
  accounts, 
  activityNotifications,
  setActivityNotifications
}) => {
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    async function loadActivitiesBoilerplate() {
      const activitiesPayloads = []
      accounts.forEach(account => {
        activitiesPayloads.push({ account, activityItems: [], cursor: { ownedCursor: null, recipientCursor: null, doneLoading: null } })
      })
      if (isEmpty(activities)) setActivities(activitiesPayloads)
    }

    async function loadPendingTransactions() {
      const allPendingTransactions = await popupAccount.getAllPendingTransactions()
      setPendingTransactions(allPendingTransactions)
    }

    async function loadNotifications() {
      console.log('activityNotifications', activityNotifications)
      setNotifications(activityNotifications)
      setActivityNotifications([])
      storage.generic.set.activityNotifications([])
    }

    loadNotifications()
    loadPendingTransactions()
    loadActivitiesBoilerplate()
  }, [])

  return (
    <div>
      <ConfirmedAssetList transactions={notifications}/>
      <PendingList transactions={pendingTransactions} />
      {activities.map((activity, index) =>
        <div>
          <Activity 
            key={index}
            activityItems={activity.activityItems}
            account={activity.account}
            cursor={activity.cursor}
            loadActivities={loadActivities}
          />
        </div>

      )}
    </div>
  )
}

const mapStateToProps = (state) => ({ 
  activities: state.activities, 
  accounts: state.accounts, 
  activityNotifications: state.activityNotifications 
})

export default connect(mapStateToProps, {
  loadActivities,
  setTransactions,
  setError,
  setActivities,
  setActivityNotifications
})(Activities)
