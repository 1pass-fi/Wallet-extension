import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import classifyAssets from 'finnie-v2/utils/classifyAssets'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { setAssets, setCollectionNfts } from 'options/actions/assets'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

export const useNfts = ({ setCollections, walletLoaded, newAddress, pathname }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    // load nfts and collection from store, set to state
    const loadAssetsFromStorage = async () => {
      dispatch(setIsLoading)
      let allCollections = await popupAccount.getAllCollections()
      let allCollectionNfts = await popupAccount.getAllCollectionNfts()
      dispatch(setCollections({ collections: allCollections, filteredCollections: allCollections }))
      dispatch(setCollectionNfts({ collectionNfts: allCollectionNfts }))

      console.log('all Collections', allCollections)
      console.log('loading all contents')
      let allAssets = await popupAccount.getAllAssets()
      let validAssets = allAssets.filter((asset) => asset.name !== '...')

      validAssets = classifyAssets(validAssets, allCollections)
      console.log('valid assets', validAssets.length)
      validAssets = validAssets.filter((nft) => !get(nft, 'name')?.includes('DID Profile Page'))

      dispatch(setAssets({ nfts: validAssets, filteredNfts: validAssets }))

      dispatch(setLoaded)
    }

    const fetchAssets = async () => {
      let allCollections = await popupAccount.getAllCollections()
      let allCollectionNfts = await popupAccount.getAllCollectionNfts()
      let allAssets, validAssets

      const loadCollection = async () => {
        console.log('LOADING COLLECTION')
        await backgroundRequest.gallery.loadCollections()
        allCollections = await popupAccount.getAllCollections()
        allCollectionNfts = await popupAccount.getAllCollectionNfts()
        dispatch(
          setCollections({ collections: allCollections, filteredCollections: allCollections })
        )
        dispatch(setCollectionNfts({ collectionNfts: allCollectionNfts }))
      }

      const loadNfts = async () => {
        await backgroundRequest.assets.loadAllContent()
        allAssets = await popupAccount.getAllAssets()
        validAssets = allAssets.filter((asset) => asset.name !== '...')
        validAssets = classifyAssets(validAssets, allCollections)
        validAssets = validAssets.filter((nft) => !get(nft, 'name')?.includes('DID Profile Page'))
        dispatch(setAssets({ nfts: validAssets, filteredNfts: validAssets }))
      }

      dispatch(setIsLoading)
      await Promise.all([loadCollection, loadNfts].map((f) => f()))
      validAssets = classifyAssets(validAssets, allCollections)
      if (isEmpty(validAssets) && pathname === '/') {
      } else {
        dispatch(setAssets({ nfts: validAssets, filteredNfts: validAssets }))
      }
      dispatch(setLoaded)
    }

    if (walletLoaded) {
      loadAssetsFromStorage()
      fetchAssets()
    }
  }, [walletLoaded, newAddress])
}
