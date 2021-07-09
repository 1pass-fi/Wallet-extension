import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import { get, isNumber } from 'lodash'

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

import { HEADER_EXCLUDE_PATH, STORAGE, REQUEST, PATH, DISCONNECTED_BACKGROUND } from 'koiConstants'

import { getChromeStorage, setChromeStorage } from 'utils'
import axios from 'axios'

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
  setWarning,
  getBalances,
  setPrice,
  setKoi
}) => {
  const history = useHistory()

  const [needToReconnect, setNeedToReconnect] = useState(false)

  useEffect(() => {
    async function getKoiData() {
      try {
        const { KOI_ADDRESS, KOI_KEY, PENDING_REQUEST } = STORAGE
        const storage = await getChromeStorage([KOI_ADDRESS, KOI_KEY, PENDING_REQUEST])
        const query = window.location.search
        getBalances()
        if (storage[KOI_ADDRESS]) {
          // Koi Address in local storage
          setKoi({ address: storage[KOI_ADDRESS] })
          getBalances()
          switch (get(storage[PENDING_REQUEST], 'type')) {
            case REQUEST.PERMISSION:
              history.push('/account/connect-site')
              break
            case REQUEST.TRANSACTION:
              history.push('/account/sign-transaction')
              break
            default:
              history.push('/account')
          }
        } else {
          // Koi Address not in local storage
          if (storage[KOI_KEY]) {
            history.push('/account/login')
          } else if (query.includes('create-wallet')) {
            history.push('/account/create')
          } else if (query.includes('upload-json')) {
            history.push('/account/import/keyfile')
          } else if (query.includes('upload-seedphrase')) {
            history.push('/account/import/phrase')
          } else {
            history.push('/account/welcome')
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
    getKoiData()
  }, [])

  useEffect(() => {
    const loadPrice = async () => {
      try {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
        const storage = await getChromeStorage(STORAGE.PRICE)
        const { AR } = storage[STORAGE.PRICE] || { AR: 1 }
        setPrice({ AR })
        const { data } = await axios.get(PATH.AR_PRICE)
        const arPrice = get(data, 'arweave.usd')
        if (isNumber(arPrice)) {
          await setPrice({ AR: arPrice })
          const price =  { AR: arPrice, KOI: 1 }
          await setChromeStorage({ [STORAGE.PRICE]: price })
        }
      } catch(err) {
        setError(err.message)
      }
    }

    loadPrice()
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

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [warning])

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
              </Switch>
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
  price: state.price
})

const mapDispatchToProps = {
  setIsLoading,
  setError,
  setNotification,
  setWarning,
  setKoi,
  getBalances,
  setPrice
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
