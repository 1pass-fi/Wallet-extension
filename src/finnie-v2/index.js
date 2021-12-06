import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import { setAssets } from 'options/actions/assets'
import { setDefaultAccount } from 'options/actions/defaultAccount'

import { popupAccount } from 'services/account'
import storage from 'services/storage'

import Gallery from './pages/Gallery'
import NFTDetail from './pages/NFTDetail'

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

  useEffect(() => {
    const loadNFTCards = async () => {
      await popupAccount.loadImported()

      const allAssets = await popupAccount.getAllAssets()
      const validAssets = allAssets.filter((asset) => asset.name !== '...')

      dispatch(setAssets({ nfts: validAssets }))
    }

    loadNFTCards()
  }, [])

  return (
    <Switch>
      <Route exact path="/v2/nfts/:id">
        <NFTDetail />
      </Route>
      <Route exact path="*">
        <Gallery />
      </Route>
    </Switch>
  )
}

export default SecondVer
