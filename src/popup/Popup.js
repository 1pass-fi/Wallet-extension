import '@babel/polyfill'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, useHistory, withRouter } from 'react-router-dom'
import koiTools from 'koi_tools'
import get from 'lodash/get'

import './Popup.css'
import Header from 'components/header'
import Loading from 'components/loading'
import Account from 'components/accounts/index'
import ErrorMessage from 'components/errorMessage'

import { setIsLoading } from 'actions/loading'
import { setError } from 'actions/error'
import { setKoi, loadWallet, removeWallet } from 'actions/koi'

import { LOAD_KOI_BY, HEADER_EXCLUDE_PATH } from 'constants'

import {
  setChromeStorage,
  getChromeStorage,
  removeChromeStorage,
  generateWallet,
  saveWalletToChrome,
  decryptWalletKeyFromChrome,
} from 'utils'

import KoiContext from 'popup/context'

const koiObj = new koiTools.koi_tools()


const Popup = ({
  location,
  isLoading, 
  setIsLoading, 
  error, 
  setError, 
  koi, 
  setKoi, 
  loadWallet,
  removeWallet }) => {
  const history = useHistory()

  const handleGenerateWallet = async () => {
    try {
      setIsLoading(true)
      const seedPhrase = await generateWallet(koiObj)
      setIsLoading(false)
      return seedPhrase
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleLockWallet = async () => {
    try {
      setIsLoading(true)
      await removeChromeStorage('koiAddress')
      koiObj.wallet = null
      koiObj.address = null
      setKoi({
        arBalance: null,
        koiBalance: null,
        address: null,
      })
      setIsLoading(false)
      history.push('/account/login')
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  // const handleUnlockWallet = async (password) => {
  //   try {
  //     setIsLoading(true)
  //     const walletKey = await decryptWalletKeyFromChrome(password)
  //     console.log('DECRYPTED KEY: ', walletKey)
  //     const newData = await loadWallet(koiObj, walletKey, LOAD_KOI_BY.KEY)
  //     setChromeStorage({ 'koiAddress': koiObj.address })
  //     setKoi((prevState) => ({ ...prevState, ...newData }))
  //     setIsLoading(false)
  //     history.push('/account')
  //   } catch (err) {
  //     setError(err.message)
  //     setIsLoading(false)
  //   }
  // }

  const handleRemoveWallet = () => removeWallet()

  const handleReloadWallet = async () => {
    try {
      const storage = await getChromeStorage('koiAddress')
      if (storage) {
        const newData = await loadWallet(
          koiObj,
          result['koiAddress'],
          LOAD_KOI_BY.ADDRESS
        )
        setKoi((prevState) => ({ ...prevState, ...newData }))
      }
    } catch (err) {
      setError(err.message)
      isLoading(false)
    }
  }

  const handleSaveWallet = async (password) => {
    try {
      setIsLoading(true)
      await saveWalletToChrome(koiObj, password)
      setIsLoading(false)
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function getKoiData() {
      try {
        const storage = await getChromeStorage(['koiAddress', 'koiKey'])
        if (storage['koiAddress']) {
          loadWallet({ data: storage['koiAddress'] })
        } else {
          if (storage['koiKey']) {
            history.push('/account/login')
          }
        }
      } catch (err) {
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
      <KoiContext.Provider value={{
        koi,
        setKoi,
        handleRemoveWallet,
        handleGenerateWallet,
        handleReloadWallet,
        handleSaveWallet,
        handleLockWallet,
        isLoading,
        setIsLoading,
      }}>
        {isLoading && <Loading />}
        {error && <ErrorMessage children={error} />}
        {!HEADER_EXCLUDE_PATH.includes(location.pathname) && <Header />}
        <div className='content'>
          <Switch>
            <Route path='/account'>
              <Account />
            </Route>
            <Route path='/assets'></Route>
            <Route path='/activity'>Activity</Route>
            <Route path='/'>
              <Redirect to='/account' />
            </Route>
          </Switch>
        </div>
      </KoiContext.Provider>
    </div>
  )
}

const mapStateToProps = (state) => ({ 
  isLoading: state.loading,
  error: state.error,
  koi: state.koi
})

const mapDispatchToProps = {
  setIsLoading, 
  setError, 
  setKoi, 
  loadWallet, 
  removeWallet
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
