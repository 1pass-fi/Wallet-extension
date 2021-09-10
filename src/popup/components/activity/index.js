// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { isEmpty, orderBy } from 'lodash'
import ReactTooltip from 'react-tooltip'

// actions
import { loadActivities } from 'actions/koi'
import { setTransactions } from 'actions/transactions'
import { setError } from 'actions/error'
import { setActivityNotifications } from 'actions/activityNotification'
import { setSettings } from 'actions/settings'

// components
import ActivityRow from './activityRow'
import ConfirmedAsset from './ConfirmedAsset'
import Button from 'shared/button'
import CheckBox from 'shared/checkbox'
import ToggleButton from 'shared/ToggleButton'

// services
import storage from 'services/storage'
import { popupAccount } from 'services/account'

// actions
import { setActivities } from 'popup/actions/activities'

// assets
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'

// constants
import { SHOW_ACTIVITIES_BY } from 'constants/storageConstants'

// styles
import './index.css'


export const ActivitiesList = ({ activities }) => {
  return activities.map((activity, index) => (
    <ActivityRow
      key={index}
      activityName={activity.activityName}
      expense={activity.expense}
      date={activity.date}
      id={activity.id}
      source={activity.source}
      accountName={activity.accountName}
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
      {/* {!collapsed && <div onClick={() => setCollapsed(!collapsed)} className="collapse-icon"><CollapseIcon /></div>}
      {collapsed && <div onClick={() => setCollapsed(!collapsed)} className="collapse-icon"><ExtendIcon /></div>} */}
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

  // useEffect(() => {
  //   async function handleLoadActivities() {
  //     await loadActivities(cursor, account.address)
  //   }
  //   handleLoadActivities()
  // }, [])

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
  setActivityNotifications,
  settings,
  setSettings
}) => {
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [notifications, setNotifications] = useState([])
  const [allActivities, setAllActivities] = useState([])
  const [showAllAccounts, setShowAllAccounts] = useState(settings.showAllAccounts)
  const [accountsToShow, setAccountsToShow] = useState(settings.accountsToShowOnActivities)
  const [selectAccountsCollapsed, setSelectAccountCollapsed] = useState(!isEmpty(settings.accountsToShowOnActivities))

  useEffect(() => {
    async function loadPendingTransactions() {
      const allPendingTransactions = await popupAccount.getAllPendingTransactions()
      setPendingTransactions(allPendingTransactions)
    }

    async function loadNotifications() {
      setNotifications(activityNotifications)
      setActivityNotifications([])
      storage.generic.set.activityNotifications([])
    }

    // async function getShowActivitiesBy() {
    //   const _showActivitiesBy = await storage.setting.get.showActivitiesBy()
    //   setShowAllAccounts(_showActivitiesBy == SHOW_ACTIVITIES_BY.ALL_ACCOUNTS)
    // }

    loadNotifications()
    loadPendingTransactions()
    handleLoadAllActivities()
    // getShowActivitiesBy()
  }, [])

  useEffect(() => {
    const getAllActivities = () => {
      let _allActivities = []
      activities.forEach(activity => {
        _allActivities = [..._allActivities, ...activity.activityItems]
      })
      _allActivities = orderBy(_allActivities, 'time', 'desc')
      setAllActivities(_allActivities)
    }

    getAllActivities()
  }, [activities])

  useEffect(() => {
    const setShowActivitiesBy = async () => {
      if (showAllAccounts) {
        await storage.setting.set.showActivitiesBy(SHOW_ACTIVITIES_BY.ALL_ACCOUNTS)
      } else {
        await storage.setting.set.showActivitiesBy(SHOW_ACTIVITIES_BY.INDIVIDUAL)
      }
    }

    setSettings({ showAllAccounts })
    setShowActivitiesBy()
  }, [showAllAccounts])

  const handleLoadAllActivities = () => {
    console.log('activities state', activities)
    activities.forEach(activity => {
      loadActivities(activity.cursor, activity.account.address)
    })
  }

  const handleSelectAccount = async (e) => {
    let _accountToShows = [...accountsToShow]
    if (_accountToShows.includes(e.target.id)) {
      _accountToShows = _accountToShows.filter(address => address !== e.target.id)
    } else {
      _accountToShows.push(e.target.id)
    }

    setSettings({ accountsToShowOnActivities: _accountToShows })
    setAccountsToShow(_accountToShows)
    await storage.setting.set.accountsToShowOnActivities(_accountToShows)
  }

  return (
    <div className='activities'>
      <div className='activity-setting'>
        <>All Accounts</>
        <ToggleButton value={!showAllAccounts} setValue={setShowAllAccounts}/>
        <>Individual</>
        {!showAllAccounts && <div onClick={() => setSelectAccountCollapsed(!selectAccountsCollapsed)} className='collapse-extend-icon'>
          {/* TOOLTIP NOT WORKING HERE */}
          { selectAccountsCollapsed ?
            <ExtendIcon data-tip='Expand' />
            :
            <CollapseIcon data-tip='Collapse' />
          }
        </div>}
      </div>
      {/* SELECT ACCOUNTS TO DISPLAY */}
      {!showAllAccounts && !selectAccountsCollapsed && <div className='select-accounts'>
        {accounts.map((account, index) => (
          <div key={index} className='account'>
            <CheckBox 
              id={account.address} 
              onChange={handleSelectAccount} 
              defaultChecked={accountsToShow.includes(account.address)}
            />
            <label for={account.address}>{account.accountName}</label>
          </div>
        ))}
      </div>}
      <ConfirmedAssetList transactions={notifications}/>
      <PendingList transactions={pendingTransactions} />
      {!showAllAccounts && activities.map((activity, index) =>
        <div hidden={!accountsToShow.includes(activity.account.address)}>
          <Activity 
            key={index}
            activityItems={activity.activityItems}
            account={activity.account}
            cursor={activity.cursor}
            loadActivities={loadActivities}
          />
        </div>
      )}
      {showAllAccounts &&
        <div className='all-activities'>
          <ActivitiesList activities={allActivities}/>
          <Button
            className="load-more-btn"
            type="outline"
            onClick={handleLoadAllActivities}
            label="See More Activity"
          />

        </div>
      }
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}

const mapStateToProps = (state) => ({ 
  activities: state.activities,
  accounts: state.accounts, 
  activityNotifications: state.activityNotifications,
  settings: state.settings
})

export default connect(mapStateToProps, {
  loadActivities,
  setTransactions,
  setError,
  setActivities,
  setActivityNotifications,
  setSettings
})(Activities)
