import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route, useLocation } from 'react-router-dom'

import { setDefaultAccount } from 'options/actions/defaultAccount'

import { popupAccount } from 'services/account'
import storage from 'services/storage'

import NavBar from 'finnie-v2/components/NavBar'

import Collection from './pages/Collection'
import Gallery from './pages/Gallery'
import NFTDetail from './pages/NFTDetail'
import Notifications from './pages/Notifications'
import CollectionDetails from 'options/pages/CollectionDetails'
import SelectNfts from 'finnie-v2/components/SelectNfts'

import './style.css'
import Success from 'options/pages/StartUp/shared/Success'
import Settings from './pages/Settings/Settings'

const SecondVer = () => {
  const dispatch = useDispatch()
  const location = useLocation()

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

  const pageTitle = useMemo(() => {
    switch(location.pathname) {
      case '/':
      case '/gallery':
        return 'Gallery'
      case '/collections':
        return 'Collections'
      case '/collections/create':
        return 'Create Collection'
      case '/collections/create/select-nft':
        return 'Select your NFTs'
      default: 
        return 'Page Title'
    }
  }, [location.pathname])

  return (
    <MainLayout title={pageTitle}>
      <Switch>
        <Route exact path="/nfts/:id">
          <NFTDetail />
        </Route>
        <Route exact path="/settings/*">
          <div className="transform flex justify-start" style={{ width: '862px' }}>
            <Settings />
          </div>
        </Route>
        <Route exact path="/collections/create/select-nft">
          <SelectNfts />
        </Route>
        <Route exact path="/collections/create">
          <Collection />
        </Route>
        <Route exact path="/collections/:collectionId">
          <CollectionDetails />
        </Route>
        <Route exact path="/collections">
          <Collection />
        </Route>
        <Route path="/notifications">
          <Notifications />
        </Route>
        <Route path="/success">
          <>
            <NavBar />
            <Success />
          </>
        </Route>
        <Route exact path="/gallery">
          <Gallery />
        </Route>
        <Route path="*">
          <Gallery />
        </Route>
      </Switch>
    </MainLayout>
  )
}

export default SecondVer
