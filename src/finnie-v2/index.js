import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import { setDefaultAccount } from 'options/actions/defaultAccount'

import { popupAccount } from 'services/account'
import storage from 'services/storage'

import Gallery from './pages/Gallery'

import './style.css'

const SecondVer = () => {
  const dispatch = useDispatch()

  const updateDefaultAccountData = async () => {
    const activatedAccountAddress = await storage.setting.get.activatedAccountAddress()
    const activatedAccount = await popupAccount.getAccount({
      address: activatedAccountAddress
    })
    const activatedAccountMetadata = await activatedAccount.get.metadata()

    dispatch(setDefaultAccount(activatedAccountMetadata))
  }

  useEffect(() => {
    updateDefaultAccountData()
  }, [])

  return (
    <Switch>
      <Route path="*">
        <Gallery />
      </Route>
    </Switch>
  )
}

export default SecondVer
