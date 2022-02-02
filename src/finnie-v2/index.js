import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route, useLocation, useParams } from 'react-router-dom'

import { setDefaultAccount } from 'options/actions/defaultAccount'

import { popupAccount } from 'services/account'
import storage from 'services/storage'

import NavBar from 'finnie-v2/components/NavBar'

import Collection from './pages/Collection'
import Gallery from './pages/Gallery'
import NFTDetail from './pages/NFTDetail'
import Notifications from './pages/Notifications'
import CollectionDetails from './pages/CollectionDetails'
import SelectNfts from 'finnie-v2/components/SelectNfts'

import './style.css'
import Success from 'options/pages/StartUp/shared/Success'
import MainLayout from './components/MainLayout'
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
    let title = ''
    switch (location.pathname) {
      case '/':
      case '/gallery':
        title = 'Gallery'
        break
      case '/collections':
        title = 'Collections'
        break
      case '/collections/create':
        title = 'Create Collection'
        break
      case '/collections/create/select-nft':
        title = 'Select your NFTs'
        break
      default:
        title = ''
    }

    if (location.pathname.includes('collections')) title = 'Collections'

    if (location.pathname.includes('notifications')) title = 'Notification Center'

    if (location.pathname.includes('settings')) title = 'Settings'

    if (location.pathname.includes('create-nft')) title = 'Gallery'

    return title
  }, [location.pathname])

  return (
    <Switch>
      <Route exact path="/collections/create">
        <MainLayout title="Collections">
          <Collection />
        </MainLayout>
      </Route>
      <Route exact path="/collections/:collectionId">
        <CollectionDetails />
      </Route>
      <MainLayout title={pageTitle}>
        <Switch>
          <Route exact path="/nfts/:id">
            <NFTDetail />
          </Route>
          <Route exact path="/settings/*">
            <div className="flex justify-start" style={{ maxWidth: '100%' }}>
              <Settings />
            </div>
          </Route>
          <Route exact path="/collections/create/select-nft">
            <SelectNfts />
          </Route>
          <Route exact path="/collections/edit/select-nft/:collectionId">
            <SelectNfts />
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
    </Switch>
  )
}

export default SecondVer
