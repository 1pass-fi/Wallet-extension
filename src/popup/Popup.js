import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
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
import { setKoi } from 'actions/koi'

import { LOAD_KOI_BY, HEADER_EXCLUDE_PATH, MESSAGES } from 'constants'

import {
  setChromeStorage,
  getChromeStorage,
  removeChromeStorage,
  loadWallet,
  generateWallet,
  saveWalletToChrome,
  removeWalletFromChrome,
  decryptWalletKeyFromChrome,
  JSONFileToObject
} from 'utils'

import KoiContext from 'popup/context'
import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'

const koiObj = new koiTools.koi_tools()

const backgroundConnect = new BackgroundConnect()

const Popup = ({ location, isLoading, setIsLoading, error, setError, koi, setKoi }) => {
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

  const handleImportWallet = async (e) => {
    try {
      setIsLoading(true)
      e.preventDefault()
      const password = e.target.pwd.value
      const file = get(e, 'target.files.0')
      const phrase = get(e, 'target.inputPhrase.value')

      let newData = {}
      if (file) {
        const fileData = await JSONFileToObject(file)
        backgroundConnect.postMessage({type: MESSAGES.IMPORT_WALLET, data: { object: fileData, password, from: LOAD_KOI_BY.FILE } })
      } else if (phrase) {
        backgroundConnect.postMessage({type: MESSAGES.IMPORT_WALLET, data: { object: phrase, password, from: LOAD_KOI_BY.SEED } })
      }
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

  const handleUnlockWallet = async (password) => {
    try {
      setIsLoading(true)
      const walletKey = await decryptWalletKeyFromChrome(password)
      console.log('DECRYPTED KEY: ', walletKey)
      const newData = await loadWallet(koiObj, walletKey, LOAD_KOI_BY.KEY)
      setChromeStorage({ 'koiAddress': koiObj.address })
      setKoi((prevState) => ({ ...prevState, ...newData }))
      setIsLoading(false)
      history.push('/account')
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleRemoveWallet = async () => {
    try {
      setIsLoading(true)
      await removeWalletFromChrome()
      koiObj.address = null
      koiObj.wallet = null
      setKoi(prevState => ({ ...prevState, arBalance: null, koiBalance: null, address: null }))
      setIsLoading(false)
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleReloadWallet = async () => {
    try {
      setIsLoading(true)
      const result = await getChromeStorage('koiAddress')
      if (result) {
        const newData = await loadWallet(
          koiObj,
          result['koiAddress'],
          LOAD_KOI_BY.ADDRESS
        )
        setKoi((prevState) => ({ ...prevState, ...newData }))
      }
      setIsLoading(false)
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
        setIsLoading(true)
        const result = await getChromeStorage(['koiAddress', 'koiKey'])
        if (result['koiAddress']) {
          const newData = await loadWallet(
            koiObj,
            result['koiAddress'],
            LOAD_KOI_BY.ADDRESS
          )
          setKoi((prevState) => ({ ...prevState, ...newData }))
        } else {
          if (result['koiKey']) {
            history.push('/account/login')
          }
        }
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }
    getKoiData()
    const importWalletHandler = new EventHandler(MESSAGES.IMPORT_WALLET_SUCCESS, message => {
      const { koiData, from } = message.data
      setKoi(prevState => ({ ...prevState, ...koiData }))
      setIsLoading(false)
      const redirectPath = from === LOAD_KOI_BY.FILE ? '/account/import/keyfile/success' : '/account/import/phrase/success'
      history.push(redirectPath)
    })

    backgroundConnect.addHandler(importWalletHandler)

    return () => {
      backgroundConnect.removeHandler(importWalletHandler)
    }
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
        handleImportWallet,
        handleRemoveWallet,
        handleGenerateWallet,
        handleReloadWallet,
        handleSaveWallet,
        handleLockWallet,
        handleUnlockWallet,
        isLoading,
        setIsLoading,
        backgroundConnect,
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

export default connect(mapStateToProps, { setIsLoading, setError, setKoi })(withRouter(Popup))
