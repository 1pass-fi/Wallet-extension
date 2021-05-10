import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import {
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom'
import koiTools from 'koi_tools'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import './Popup.css'
import Header from './header'
import Loading from './loading'
import Account from './accounts/index'
import { loadKoiBy } from 'constant'

import { setChromeStorage, getChromeStorage, loadWallet, JSONFileToObject } from 'utils'

import KoiContext from 'popup/context'

const koiObj = new koiTools.koi_tools()

const Popup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const [koi, setKoi] = useState({
    arBalance: koiObj.balance,
    koiBalance: koiObj.koiBalance,
    address: koiObj.address
  })

  const handleImportWallet = async (e) => {
    try {
      setIsLoading(true)
      e.preventDefault()
      const file = get(e, 'target.files.0')
      if (isEmpty(file)) {
        return
      }

      const fileObject = await JSONFileToObject(file)
      const newData = await loadWallet(koiObj, fileObject, loadKoiBy.FILE)
      // await setChromeStorage({'koiAddress': koiObj.address})
      setKoi(prevState => ({ ...prevState, ...newData }))
      history.push('/account')
      setIsLoading(false)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    async function getKoiData() {
      setIsLoading(true)
      const result = await getChromeStorage('koiAddress')

      if (result) {
        const newData = await loadWallet(koiObj, result['koiAddress'], loadKoiBy.ADDRESS)
        setKoi(prevState => ({ ...prevState, ...newData }))
      }
      setIsLoading(false)
    }
    getKoiData()
  }, [])

  return (
    <div className="popup">
      <KoiContext.Provider value={{ koi, setKoi, handleImportWallet, isLoading, setIsLoading }}>
        {isLoading && <Loading />}
        <Header />
        <div className="content">
          <Switch>
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/assets"></Route>
            <Route path="/activity">Activity</Route>
            <Route path="/">
              <Redirect to="/account" />
            </Route>
          </Switch>
        </div>
      </KoiContext.Provider>
    </div>
  )
}

export default Popup
