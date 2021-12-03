import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import get from 'lodash/get'

import { setDefaultAccount } from 'options/actions/defaultAccount'

import { MESSAGES } from 'constants/koiConstants'

import { popupAccount } from 'services/account'
import { popupBackgroundConnect } from 'services/request/popup'
import { EventHandler } from 'services/request/src/backgroundConnect'
import storage from 'services/storage'

import Gallery from './pages/Gallery'

import './style.css'

const SecondVer = () => {
  const store = useStore()
  const dispatch = useDispatch()

  useEffect(() => {
    const updateAccounts = async () => {
      await popupAccount.loadImported()

      /* 
        Set default account if imported account is the first account
      */
      if (get(popupAccount, 'importedAccount.length') === 1) {
        let activatedAccount = await storage.setting.get.activatedAccountAddress()
        activatedAccount = await popupAccount.getAccount({
          address: activatedAccount
        })
        activatedAccount = await activatedAccount.get.metadata()
        dispatch(setDefaultAccount(activatedAccount))
      }
    }

    updateAccounts()
  }, [])

  useEffect(() => {
    const handleAddHandler = () => {
      const loadBalancesSuccess = new EventHandler(MESSAGES.GET_BALANCES_SUCCESS, async () => {
        try {
          const { defaultAccount } = store.getState()

          let activatedAccount = await storage.setting.get.activatedAccountAddress()
          activatedAccount = await popupAccount.getAccount({
            address: activatedAccount
          })
          const activatedAccountData = await activatedAccount.get.metadata()
          const { balance, koiBalance } = activatedAccountData

          const balancesUpdated =
            defaultAccount.balance !== balance || defaultAccount.koiBalance !== koiBalance
          if (balancesUpdated) {
            await dispatch(loadAllAccounts())

            setNotification('Your balances have been updated.')
          }

        } catch (err) {
          setError(err.message)
        }
      })

      popupBackgroundConnect.addHandler(loadBalancesSuccess)
    }

    handleAddHandler()
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
