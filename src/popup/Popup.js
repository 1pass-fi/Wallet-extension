import '@babel/polyfill'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, useHistory, withRouter } from 'react-router-dom'
import { get } from 'lodash'

import './Popup.css'
import Header from 'components/header'
import Loading from 'components/loading'
import Account from 'components/accounts'
import Assets from 'components/assets'
import Activity from 'components/activity'
import Setting from 'components/setting'
import ErrorMessage from 'components/errorMessage'
import NotificationMessage from 'components/notificationMessage'
import continueLoadingIcon from 'img/continue-load.gif'

import { setIsLoading } from 'actions/loading'
import { setError } from 'actions/error'
import { setNotification } from 'actions/notification'
import { setKoi, loadWallet, removeWallet } from 'actions/koi'

import { HEADER_EXCLUDE_PATH, STORAGE, REQUEST } from 'koiConstants'

import { getChromeStorage } from 'utils'

const ContinueLoading = () => (
  <div className='continue-loading'>
    <img src={continueLoadingIcon} />
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
  loadWallet,
  transactions
}) => {
  const history = useHistory()

  useEffect(() => {
    async function getKoiData() {
      try {
        const { KOI_ADDRESS, KOI_KEY, PENDING_REQUEST } = STORAGE
        const storage = await getChromeStorage([KOI_ADDRESS, KOI_KEY, PENDING_REQUEST])

        if (storage[KOI_ADDRESS]) {
          // Koi Address in local storage
          loadWallet({ data: storage[KOI_ADDRESS] })
          switch (get(storage[PENDING_REQUEST], 'type')) {
            case REQUEST.PERMISSION:
              history.push('/account/connect-site')
              break
            case REQUEST.TRANSACTION:
              history.push('/account/sign-transaction')
              break
          }
        } else {
          // Koi Address not in local storage
          if (storage[KOI_KEY]) {
            history.push('/account/login')
          } else {
            history.push('/account/welcome')
          }
        }
      } catch (err) {
        console.log(err.message)
        setError(err.message)
        setIsLoading(false)
      }
    }
    getKoiData()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const activities = [
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
  ]

  return (
    <div className="popup">
      {isContLoading && location.pathname === '/assets' && <ContinueLoading />}
      {isLoading && <Loading />}
      {error && <ErrorMessage children={error} />}
      {notification && <NotificationMessage children={notification} />}
      {!HEADER_EXCLUDE_PATH.includes(location.pathname) && <Header location={location} />}
      <div className='content'>
        <Switch>
          <Route path='/account'>
            <Account />
          </Route>
          <Route path='/assets'>
            <Assets />
          </Route>
          <Route path='/activity'>
            <Activity activities={activities} />
          </Route>
          <Route path='/setting'>
            <Setting />
          </Route>
          <Route path='/'>
            <Redirect to='/account' />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.loading,
  error: state.error,
  notification: state.notification,
  koi: state.koi,
  transactions: state.transactions,
  isContLoading: state.contLoading
})

const mapDispatchToProps = {
  setIsLoading,
  setError,
  setNotification,
  setKoi,
  loadWallet,
  removeWallet
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
