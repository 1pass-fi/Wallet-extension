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
import Setting from 'components/setting'
import ErrorMessage from 'components/errorMessage'

import { setIsLoading } from 'actions/loading'
import { setError } from 'actions/error'
import { setKoi, loadWallet, removeWallet } from 'actions/koi'

import { HEADER_EXCLUDE_PATH, STORAGE, REQUEST } from 'constants'

import { getChromeStorage } from 'utils'

const Popup = ({
  location,
  isLoading,
  setIsLoading,
  error,
  setError,
  loadWallet,
  transactions
}) => {
  const history = useHistory()

  useEffect(() => {
    async function getKoiData() {
      try {
        const { KOI_ADDRESS, KOI_KEY, PENDING_REQUEST } = STORAGE
        const storage = await getChromeStorage([KOI_ADDRESS, KOI_KEY, PENDING_REQUEST])

        if (storage['koiAddress']) {
          // Koi Address in local storage
          loadWallet({ data: storage['koiAddress'] })
          switch (get(storage[PENDING_REQUEST], 'type')) {
            case REQUEST.PERMISSION:
              history.push('/account/connect-site')
              break
            case REQUEST.TRANSACTION:
              history.push('account/sign-transaction')
              break
          }
        } else {
          // Koi Address not in local storage
          if (storage['koiKey']) {
            history.push('/account/login')
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

  return (
    <div className="popup">
      {isLoading && <Loading />}
      {error && <ErrorMessage children={error} />}
      {!HEADER_EXCLUDE_PATH.includes(location.pathname) && <Header location={location}/>}
      <div className='content'>
        <Switch>
          <Route path='/account'>
            <Account />
          </Route>
          <Route path='/assets'>
            <Assets />
          </Route>
          <Route path='/activity'>
            {transactions.map((transaction) => <h1>Transactions: {transaction}</h1>)}
          </Route>
          <Route path='/setting'>
            <Setting/>
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
  koi: state.koi,
  transactions: state.transactions
})

const mapDispatchToProps = {
  setIsLoading,
  setError,
  setKoi,
  loadWallet,
  removeWallet
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
