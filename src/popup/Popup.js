import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import { get, isNumber, isEmpty } from 'lodash'

import './Popup.css'
import Header from 'components/header'
import Loading from 'components/loading'
import Account from 'components/accounts'
import Assets from 'components/assets'
import Activity from 'components/activity'
import Setting from 'components/setting'
import Message from 'components/message'
import continueLoadingIcon from 'img/continue-load.gif'

import KoiLogo from 'img/koi-logo.svg'

import { setIsLoading } from 'actions/loading'
import { setError } from 'actions/error'
import { setNotification } from 'actions/notification'
import { setWarning } from 'actions/warning'
import { setPrice } from 'actions/price'
import { setKoi, getBalances } from 'actions/koi'
import { setCurrency } from 'actions/currency'
import { setEthereum } from 'actions/ethereum'
import { setAccounts } from 'actions/accounts'
import { setActivityNotifications } from 'actions/activityNotification'
import { setSettings } from 'actions/settings'
import { setActivities } from 'actions/activities'

import { HEADER_EXCLUDE_PATH, REQUEST, DISCONNECTED_BACKGROUND, PATH } from 'koiConstants'
import { backgroundRequest } from 'popup/backgroundRequest'

import axios from 'axios'

import storage from 'storage'

import { popupAccount } from 'account'
import { SHOW_ACTIVITIES_BY } from 'storage/storageConstants'

const ContinueLoading = () => (
  <div className='continue-loading'>
    <img src={continueLoadingIcon} />
  </div>
)

const Reconnect = () => (
  <div className='reconnect'>
    <div className='reconnect-logo'><KoiLogo /></div>
      Finnie needs to reconnect to the background. Please click on the button below.
    <button onClick={() => chrome.runtime.reload()}>Reconnect</button>
  </div>
)

const Popup = ({
  location,
  isLoading,
  isContLoading,
  setIsLoading,
  error,
  setError,
  notification,
  setNotification,
  warning,
  getBalances,
  setPrice,
  setKoi,
  setCurrency,
  setAccounts,
  accounts,
  setActivityNotifications,
  setSettings,
  activities,
  setActivities
}) => {
  const history = useHistory()

  const [needToReconnect, setNeedToReconnect] = useState(false)
  const [appLoaded, setAppLoaded] = useState(false)

  const loadApp = async () => {
    /* 
      load for wallet state of lock or unlock
      load for all accounts
    */
    getBalances()
    await popupAccount.loadImported()
    let accounts = await popupAccount.getAllMetadata()

    const isLocked = await backgroundRequest.wallet.getLockState()

    console.log('account metadata: ', accounts)
    setAccounts(accounts)


    const query = window.location.search // later we should refactor using react-hash-router

    /* 
      Load for activity notifications
    */
    const _activityNotifications = await storage.generic.get.activityNotifications() || []
    setActivityNotifications(_activityNotifications)

    /* 
      Load for pending request
    */
    const pendingRequest = await storage.generic.get.pendingRequest()

    /* 
      When there's no imported account, redirect to welcome screen
      If not unlocked, redirect to lock screen
      Click on add account, go to welcome screen
    */
    try {
      if (isEmpty(accounts)) {
        history.push('/account/welcome')
      } else {
        history.push('/account')
      }

      if (!isEmpty(accounts) && isLocked) {
        history.push('/account/login')
      }

      if (query.includes('create-wallet')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/create?type=${walletType}`)
      } else if (query.includes('upload-json')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/import/keyfile?type=${walletType}`)
      } else if (query.includes('upload-seedphrase')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/import/phrase?type=${walletType}`)
      }

      if (pendingRequest) {
        switch (pendingRequest.type) {
          case REQUEST.PERMISSION:
            history.push(PATH.CONNECT_SITE)
            break
          case REQUEST.TRANSACTION:
            history.push(PATH.SIGN_TRANSACTION)
        }
      }
    } catch (err) {
      console.log(err.message)
      if (err.message === DISCONNECTED_BACKGROUND) {
        setNeedToReconnect(true)
      } else {
        setError(err.message)
      }
      setIsLoading(false)
    }
  }

  const loadPrice = async () => {
    try {
      const price = await storage.arweaveWallet.get.price()
      let selectedCurrency = await storage.setting.get.selectedCurrency() || 'USD'

      console.log('Selected Currency: ', selectedCurrency)

      const AR = price || 1

      setPrice({ AR })
      setCurrency(selectedCurrency)

      const { data: responseData } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${selectedCurrency}`)
      console.log('currency: ', selectedCurrency)
      console.log('price', responseData)

      const arPrice = get(responseData, `arweave.${selectedCurrency.toLowerCase()}`)

      if (isNumber(arPrice)) {
        await setPrice({ AR: arPrice })
        await storage.arweaveWallet.set.price(arPrice)
      }
    } catch(err) {
      setError(err.message)
    }
  }

  const loadSettings = async () => {
    try {
      const showActivitiesBy = await storage.setting.get.showActivitiesBy()
      const accountsToShowOnActivities = await storage.setting.get.accountsToShowOnActivities() || []
      const payload = {
        showAllAccounts : showActivitiesBy == SHOW_ACTIVITIES_BY.ALL_ACCOUNTS,
        accountsToShowOnActivities
      }
      console.log('payload', payload)
      setSettings(payload)

    } catch (err) {
      console.log(err.message)
    }
  }

  const loadActivitiesBoilerplate = async () => {
    const activitiesPayloads = []
    const _accounts = await popupAccount.getAllMetadata() || []
    console.log('_accounts', _accounts)
    _accounts.forEach(account => {
      activitiesPayloads.push({ account, activityItems: [], cursor: { ownedCursor: null, recipientCursor: null, doneLoading: null } })
    })
    if (isEmpty(activities)) setActivities(activitiesPayloads)
  }
  useEffect(() => {
    const load = async () => {
      await loadApp()
      await loadPrice()
      await loadSettings()
      await loadActivitiesBoilerplate()
      setAppLoaded(true)
    }

    load()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [error, notification, warning])

  return (
    <div className="popup">
      {
        needToReconnect ? <Reconnect /> :
          <div>
            {isContLoading && location.pathname === '/assets' && <ContinueLoading />}
            {isLoading && <Loading />}
            {error && <Message type='error' children={error} />}
            {notification && <Message type='notification' children={notification} />}
            {warning && <Message type='warning' children={warning} />}
            {!HEADER_EXCLUDE_PATH.includes(location.pathname) && <Header location={location} />}
            <div className='content'>
              {<Switch>
                <Route path='/account'>
                  <Account />
                </Route>
                <Route path='/assets'>
                  <Assets />
                </Route>
                <Route path='/activity'>
                  <Activity />
                </Route>
                <Route path='/settings'>
                  <Setting />
                </Route>
              </Switch>}
            </div>
          </div>
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.loading,
  error: state.error,
  notification: state.notification,
  warning: state.warning,
  koi: state.koi,
  transactions: state.transactions,
  isContLoading: state.contLoading,
  price: state.price,
  accounts: state.accounts,
  activityNotifications: state.activityNotifications,
  activities: state.activities
})

const mapDispatchToProps = {
  setIsLoading,
  setError,
  setNotification,
  setWarning,
  setKoi,
  getBalances,
  setPrice,
  setCurrency,
  setAccounts,
  setActivityNotifications,
  setSettings,
  setActivities
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
