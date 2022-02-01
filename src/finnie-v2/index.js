import React, { useContext, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useLocation, useParams } from 'react-router-dom'
import { find } from 'lodash'

import { setDefaultAccount } from 'options/actions/defaultAccount'

import { popupAccount } from 'services/account'
import storage from 'services/storage'

import NavBar from 'finnie-v2/components/NavBar'

import getCollectionByTxId from './selectors/getCollectionByTxid'

import Collection from './pages/Collection'
import Gallery from './pages/Gallery'
import NFTDetail from './pages/NFTDetail'
import Notifications from './pages/Notifications'
import CollectionDetails from 'options/pages/CollectionDetails/CollectionDetails'
import SelectNfts from 'finnie-v2/components/SelectNfts'

import './style.css'
import Success from 'options/pages/StartUp/shared/Success'
import MainLayout from './components/MainLayout'
import { GalleryContext } from 'options/galleryContext'
import Settings from './pages/Settings/Settings'
import FriendReferral from './pages/FriendReferral'

const SecondVer = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const { editingCollectionId } = useContext(GalleryContext)
  const collections = useSelector((state) => state.collections)

  const collectionName = useMemo(() => {
    if (collections && editingCollectionId) {
      const collection = find(collections.collections, (c) => {
        return c.id === editingCollectionId
      })
      if (collection) return collection.name
      return null
    }
  }, [editingCollectionId, collections])

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

    if (location.pathname.includes('/collections') && collectionName) title = collectionName
    return title
  }, [location.pathname, collectionName])

  return (
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
        <Route exact path="/collections/create">
          <Collection />
        </Route>
        <Route path="/collections/:collectionId">
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
