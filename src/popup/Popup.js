import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import {
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom'
import koiTools from 'koi_tools'
import { get } from 'lodash'

import './Popup.css'
import Header from './header'
import Account from './accounts/index'
import { loadKoiBy } from 'constant'

import { setChromeStorage, getChromeStorage, loadWallet, JSONFileToObject } from 'utils'

import KoiContext from 'popup/context'

const koiObj = new koiTools.koi_tools()

const Popup = () => {
  const history = useHistory()
  const [koi, setKoi] = useState({
    arBalance: koiObj.balance,
    koiBalance: koiObj.koiBalance,
    address: koiObj.address
  })

  const handleImportWallet = async (e) => {
    try {
      e.preventDefault()
      console.log(e.target.files)
      let file = get(e, 'target.fileField.files[0]')
      file = await JSONFileToObject(file)
      const newData = await loadWallet(koiObj, file, loadKoiBy.FILE)
      await setChromeStorage({'koiAddress': koiObj.address})
      setKoi(prevState => ({...prevState, ...newData}))
      history.push('/account')
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    async function getKoiData() {
      // await setChromeStorage({ "koiAddress": "6VJYLb6lvBISrgRbhd1ODHzJ1xAh3ZA3OdSY20E88Bg" })
      // const result = await getChromeStorage('koiAddress')
      // koiObj.address = result['koiAddress']
      // await koiObj.getWalletBalance()
      // const koiBalance = await koiObj.getKoiBalance()
      // const koiData = await loadWallet(koiObj, file, loadKoiBy.FILE)

      // setKoi((prevState) => {
      //   return {
      //     ...prevState,
      //     ...koiData
      //   }
      // })
    }
    getKoiData()
  }, [])
  
  return (
    <div className="popup">
      <KoiContext.Provider value={{koi, setKoi, handleImportWallet}}>
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
