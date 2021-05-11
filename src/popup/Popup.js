import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import koiTools from 'koi_tools'
import get from 'lodash/get'

import './Popup.css'
import Header from './header'
import Loading from './loading'
import Account from './accounts/index'
import { loadKoiBy } from 'constant'

import {
  setChromeStorage,
  getChromeStorage,
  removeChromeStorage,
  loadWallet,
  generateWallet,
  saveWalletToChrome,
  removeWalletFromChrome
} from 'utils'

import KoiContext from 'popup/context'

const koiObj = new koiTools.koi_tools()

const Popup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const [koi, setKoi] = useState({
    arBalance: koiObj.balance,
    koiBalance: koiObj.koiBalance,
    address: koiObj.address,
  })

  const handleGenerateWallet = async () => {
    try {
      setIsLoading(true)
      const seedPhrase = await generateWallet(koiObj)
      setIsLoading(false)
      return seedPhrase
    } catch (err) {
      console.log(err.message)
      setIsLoading(false)
    }
  }

  const handleImportWallet = async (e) => {
    try {
      setIsLoading(true)
      e.preventDefault()

      const file = get(e, 'target.files.0')
      const phrase = get(e, 'target.inputPhrase.value')

      let newData = {}
      let redirectPath = ''
      if (file) {
        newData = await loadWallet(koiObj, file, loadKoiBy.FILE)
        redirectPath = '/account/import/keyfile/success'
      } else if (phrase) {
        newData = await loadWallet(koiObj, phrase, loadKoiBy.SEED)
        redirectPath = '/account/import/phrase/success'
      }
      const password = ''
      await saveWalletToChrome(koiObj, password)

      setKoi(prevState => ({ ...prevState, ...newData }))
      setIsLoading(false)
      history.push(redirectPath)
    } catch (err) {
      console.log(err.message)
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
      console.log(err.message)
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
          loadKoiBy.ADDRESS
        )
        setKoi((prevState) => ({ ...prevState, ...newData }))
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err.message)
      isLoading(false)
    }
  }

  const handleSaveWallet = async (password) => {
    try {
      setIsLoading(true)
      await saveWalletToChrome(koiObj, password)
      setIsLoading(false)
    } catch (err) {
      console.log(err.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function getKoiData() {
      try {
        setIsLoading(true)
        const result = await getChromeStorage('koiAddress')
        if (result) {
          const newData = await loadWallet(
            koiObj,
            result['koiAddress'],
            loadKoiBy.ADDRESS
          )
          setKoi((prevState) => ({ ...prevState, ...newData }))
        }
        setIsLoading(false)
      } catch (err) {
        console.log(err.message)
        setIsLoading(false)
      }
    }
    getKoiData()
  }, [])

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
        isLoading,
        setIsLoading
      }}>
        {isLoading && <Loading />}
        <Header />
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

export default Popup
