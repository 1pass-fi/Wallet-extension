// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { setError } from 'actions/error'
// actions
import { loadActivities } from 'actions/koi'
import { setSettings } from 'actions/settings'
import { setTransactions } from 'actions/transactions'
// constants
import { SHOW_ACTIVITIES_BY } from 'constants/storageConstants'
// assets
import CollapseIcon from 'img/collapse-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'
import { isEmpty, orderBy } from 'lodash'
// actions
import { setActivities } from 'popup/actions/activities'
import ExpiredTxModal from 'popup/components/modals/expiredTxModal'
import { popupAccount } from 'services/account'
// services
import storage from 'services/storage'
import Button from 'shared/button'
import CheckBox from 'shared/checkbox'
import ToggleButton from 'shared/ToggleButton'

// components
import ActivityItem from './activityRow'

// styles
import './index.css'


export const ActivitiesList = ({ activities = [] }) => {
  return activities.map((activity, index) => (
    <ActivityItem
      key={index}
      activityName={activity.activityName}
      expense={activity.expense}
      date={activity.date}
      id={activity.id}
      source={activity.source}
      accountName={activity.accountName}
      network={activity.network}
    />
  ))
}

export const PendingList = ({ transactions, handleExpiredAction }) => {
  return orderBy(transactions, 'timestamp', 'desc').map((transaction, index) => (
    <ActivityItem
      key={index}
      activityName={transaction.activityName}
      expense={transaction.expense}
      date={transaction.date}
      pending={true}
      id={transaction.id}
      source={transaction.source}
      accountName={transaction.accountName}
      expired={transaction.expired}
      handleExpiredAction={handleExpiredAction}
      address={transaction.address}
      network={transaction.network}
    />
  ))
}

const AccountLabel = ({ accountName, collapsed, setCollapsed }) => {
  return (
    <div className="activity-account-label">
      <div className="text">{accountName}</div>
    </div>
  )
}

const ActivityOneAccount = ({
  activityItems,
  account,
  cursor,
  loadActivities
}) => {
  const [collapsed, setCollapsed] = useState(false)

  const handleLoadMore = async () => await loadActivities(cursor, account.address)

  return (
    <div className={collapsed ? 'activity-container collapsed' : 'activity-container'}>
      {account.address !== 'all' && <AccountLabel collapsed={collapsed} setCollapsed={setCollapsed} accountName={account.accountName} />}
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

const Activity = ({ 
  activities,
  setActivities,
  loadActivities, 
  accounts,
  activitySettings,
  setActivitySettings
}) => {
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [showAllAccounts, setShowAllAccounts] = useState(activitySettings.showAllAccounts)
  const [accountsToShow, setAccountsToShow] = useState(activitySettings.accountsToShowOnActivities)
  const [selectAccountsCollapsed, setSelectAccountCollapsed] = useState(!isEmpty(activitySettings.accountsToShowOnActivities))
  const [boilerplateLoaded, setBoilerplateLoaded] = useState(false)
  const [deleteTransactionModalStatus, setDeleteTransactionModalStatus] = useState({
    isShow: false,
    txInfo: {},
  })

  /* 
    Activites will be shown by looping through an array of an object that contains
    essential data.
    The reason is we are displaying activities in both "allAccounts" and "Individual"
    For "Individual", to individually tracking account's activities, it requires to seperate each account from
    others.
  */
  const loadActivitiesBoilerplate = async () => {
    const activitiesPayloads = []
    const _accounts = await popupAccount.getAllMetadata() || []
    _accounts.forEach(account => {
      activitiesPayloads.push({ account, activityItems: [], cursor: { offset: 0, limit: 20, doneLoading: null } })
    })
  
    /* 
      Currently we are storing activities of all accounts into an seperate place on storage to do sortation
      We will abstract "All Accounts" as an account with the address of "all"
      Take a look at actions/koi loadActivities()
    */
    const allActivitiesPayload = {
      account: { address: 'all' },
      activityItems: [],
      cursor: { offset: 0, limit: 20, doneLoading: null }
    }

    activitiesPayloads.push(allActivitiesPayload)

    setActivities(activitiesPayloads)
    setBoilerplateLoaded(true)
  }

  const handleLoadAllActivities = () => {
    activities.forEach(activity => {
      loadActivities(activity.cursor, activity.account.address)
    })
  }

  const handleExpiredAction = (txInfo) => {
    setDeleteTransactionModalStatus({isShow: true, txInfo})
  }

  const handleSelectAccount = async (e) => {
    let _accountToShows = [...accountsToShow]
    if (_accountToShows.includes(e.target.id)) {
      _accountToShows = _accountToShows.filter(address => address !== e.target.id)
    } else {
      _accountToShows.push(e.target.id)
    }

    setActivitySettings({ accountsToShowOnActivities: _accountToShows })
    setAccountsToShow(_accountToShows)
    await storage.setting.set.accountsToShowOnActivities(_accountToShows)
  }

  useEffect(() => {
    async function loadPendingTransactions() {
      const allPendingTransactions = await popupAccount.getAllPendingTransactions()
      setPendingTransactions(allPendingTransactions)
    }

    loadPendingTransactions()
    loadActivitiesBoilerplate()
  }, [])

  useEffect(() => {
    const setShowActivitiesBy = async () => {
      if (showAllAccounts) {
        await storage.setting.set.showActivitiesBy(SHOW_ACTIVITIES_BY.ALL_ACCOUNTS)
      } else {
        await storage.setting.set.showActivitiesBy(SHOW_ACTIVITIES_BY.INDIVIDUAL)
      }
    }

    setActivitySettings({ showAllAccounts })
    setShowActivitiesBy()
  }, [showAllAccounts])

  useEffect(() => {
    if (boilerplateLoaded) handleLoadAllActivities()
  }, [boilerplateLoaded])

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
      <PendingList transactions={pendingTransactions} handleExpiredAction={handleExpiredAction}/>

      {/* SHOW ACCOUNTS INDIVIDUALLY */}
      {!showAllAccounts && activities.map((activity, index) =>
        <div hidden={!accountsToShow.includes(activity.account.address)}>
          <ActivityOneAccount 
            key={index}
            activityItems={activity.activityItems}
            account={activity.account}
            cursor={activity.cursor}
            loadActivities={loadActivities}
          />
        </div>
      )}

      {/* SHOW ACTIVITIES OF ALL ACCOUNT */}
      {showAllAccounts && activities.map((activity, index) =>
        <div hidden={activity.account.address !== 'all'}>
          <ActivityOneAccount 
            key={index}
            activityItems={activity.activityItems}
            account={activity.account}
            cursor={activity.cursor}
            loadActivities={loadActivities}
          />
        </div>
      )}

      {
        deleteTransactionModalStatus.isShow && (
          <ExpiredTxModal
            txInfo={deleteTransactionModalStatus.txInfo}
            onClose={() => setDeleteTransactionModalStatus((prev) => ({
              ...prev,
              isShow: false,
            }))}
            setPendingTransactions={setPendingTransactions}
            pendingTransactions={pendingTransactions}
          />
        )
      }
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}

const mapStateToProps = (state) => ({ 
  activities: state.activities,
  accounts: state.accounts,
  activitySettings: state.settings
})

export default connect(mapStateToProps, {
  loadActivities,
  setTransactions,
  setError,
  setActivities,
  setActivitySettings: setSettings
})(Activity)
