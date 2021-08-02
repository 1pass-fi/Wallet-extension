import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isString, isEmpty } from 'lodash'

import './index.css'
import CollectionList from 'options/components/collectionList'
import { GalleryContext } from 'options/galleryContext'
import { loadCollections } from 'options/utils'

import AddIcon from 'img/add-icon-green.svg'
import storage from 'storage'
import { Account, popupAccount } from 'account'
import { backgroundRequest } from 'popup/backgroundRequest'

const Header = ({ setShowCreateCollection, setStage, setPage, setTotalPage }) => {
  const history = useHistory()

  const handleOnClick = () => {
    setStage(1)
    setTotalPage(1)
    setPage(0)
    setShowCreateCollection(true)
    history.push('/')
  }

  return (
    <div className='collections-container__header'>
      <div className='collections-container__header__title'>Collections</div>
      <div onClick={handleOnClick} className='collections-container__header__add-icon'><AddIcon /></div>
    </div>
  )
}

export default () => {
  const { setShowCreateCollection, 
    setPage, 
    setTotalPage,
    setStage, 
    setIsLoading, 
    setError, 
    collections, 
    setCollections,
    collectionsLoaded,
    setCollectionsLoaded,
    account
  } = useContext(GalleryContext)

  useEffect(() => {
    const getCollectionsFromStorage = async () => {
      try {
        const allCollections = await popupAccount.getAllCollections()
        console.log('All Collections', allCollections)
        setCollections(allCollections)
      } catch (err) {
        console.log(err.message)
        setError(err.message)
      }
    }

    if (!isEmpty(account)) getCollectionsFromStorage()
  }, [account])

  useEffect(() => {
    const handleLoadCollection = async () => {
      try {
        if (!isEmpty(account)) {          
          setIsLoading(true)
          await backgroundRequest.gallery.loadCollections({ address: account.address })
          const allCollections = await popupAccount.getAllCollections()
          setCollections(allCollections)
          setIsLoading(false)
          setCollectionsLoaded(true)
        }
      } catch (err) {
        setIsLoading(false)
        setError(err.message)
        console.log(err.message)
      }
    }
    if (!isEmpty(account) && !collectionsLoaded) {
      handleLoadCollection()
    }
  }, [account])

  return (
    <div className='collections-container'>
      <div>
        <Header 
          setShowCreateCollection={setShowCreateCollection}
          setStage={setStage}
          setPage={setPage}
          setTotalPage={setTotalPage}
        />
        <CollectionList collections={collections}/>
      </div>
    </div>
  )
}
