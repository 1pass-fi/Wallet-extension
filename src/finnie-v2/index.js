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
import Settings from 'options/pages/Settings'
import Layout from 'options/layout'
import MainLayout from './components/MainLayout'

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

      dispatch(setAssets({ nfts: validAssets, filteredNfts: validAssets }))
    }

    loadNFTCards()
  }, [])

  return (
    <Layout>
      <Switch>
        <Route exact path="/v2/nfts/:id">
          <NFTDetail />
        </Route>
        <Route exact path="/v2/settings/*">
          <MainLayout title="Settings">
            <div className="transform flex justify-start" style={{ width: '862px' }}>
              <Settings />
            </div>
          </MainLayout>
        </Route>
        <Route exact path="*">
          <Gallery />
        </Route>
      </Switch>
    </Layout>
  )
}

export default SecondVer
