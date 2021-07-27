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
import { Account } from 'account'
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

// const Activity = ({
//   activities,
//   loadActivities,
//   cursor,
//   transactions,
//   setTransactions,
//   setError,
//   accountName,
// }) => {
//   useEffect(() => {
//     async function handleLoadActivities() {
//       const listPendingTransaction = await storage.arweaveWallet.get.pendingTransactions() || []
//       const address = await storage.arweaveWallet.get.address()
//       setTransactions(listPendingTransaction)
      
//       if (address) {
//         await loadActivities(cursor)
//       }
//     }
//     handleLoadActivities()
//   }, [])
  
//   const handleLoadMore = async () => await loadActivities(cursor)

//   return (
//     <div className="activity-container">
//       {activities.length !== 0 && <AccountLabel accountName={accountName} />}
//       <PendingList transactions={transactions} />
//       <ActivitiesList activities={activities} />
//       {!cursor.doneLoading && (
//         <Button
//           className="load-more"
//           type="outline"
//           onClick={handleLoadMore}
//           label="See More Activity"
//         />
//       )}
//     </div>
//   )
// }
const Activity = ({
  activityItems,
  address,
  cursor,
  loadActivities
}) => {
  const [accountName, setAccountName] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    async function handleLoadActivities() {
      const type = await Account.getTypeOfWallet(address)
      const account = await Account.get({ address }, type)
      const name = await account.get.accountName()
      setAccountName(name)

      const listPendingTransaction = await account.get.pendingTransactions() || []
      setTransactions(listPendingTransaction)

      await loadActivities(cursor, address)
    }
    handleLoadActivities()
  }, [])

  const handleLoadMore = async () => await loadActivities(cursor, address)

  return (
    <div className={collapsed ? 'activity-container collapsed' : 'activity-container'}>
      <AccountLabel collapsed={collapsed} setCollapsed={setCollapsed} accountName={accountName} />
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

const Activities = ({ activities, setActivities, loadActivities, accounts }) => {
  useEffect(() => {
    async function handleLoadActivities() {
      let allWallets = await Account.getAllWallets()
      const allAddresses = allWallets.map(wallet => wallet.address)
      const listOfPayloads = []
      allAddresses.forEach(address => {
        listOfPayloads.push({ address, activityItems: [], cursor: { ownedCursor: null, recipientCursor: null, doneLoading: null } })
      })
      console.log('list of payloads: ', listOfPayloads)
      if (isEmpty(activities)) setActivities(listOfPayloads)
    }

    handleLoadActivities()
  }, [])

  return (
    <div>
      {activities.map((activity, index) => 
        <Activity 
          key={index}
          activityItems={activity.activityItems}
          address={activity.address}
          cursor={activity.cursor}
          loadActivities={loadActivities}
        />
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({ activities: state.activities })

export default connect(mapStateToProps, {
  loadActivities,
  setTransactions,
  setError,
  setActivities
})(Activities)
