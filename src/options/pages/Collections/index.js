import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isString, isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import './index.css'
import CollectionList from 'options/components/collectionList'
import { GalleryContext } from 'options/galleryContext'
import { loadCollections } from 'options/utils'

import AddIcon from 'img/add-icon-green.svg'
import storage from 'services/storage'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import { setCreateCollection } from 'options/actions/createCollection'

const Header = ({ setShowCreateCollection }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleOnClick = () => {
    setShowCreateCollection(true)
    const payload = {
      stage: 1,
      totalPage: 1,
      currentPage: 0
    }
    dispatch(setCreateCollection(payload))

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
  const { 
    setShowCreateCollection,
    setIsLoading, 
    setError, 
    collections, 
    setCollections,
    collectionsLoaded,
    setCollectionsLoaded,
  } = useContext(GalleryContext)

  const defaultAccount = useSelector(state => state.defaultAccount)
  

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

    if (!isEmpty(defaultAccount)) getCollectionsFromStorage()
  }, [defaultAccount])

  useEffect(() => {
    const handleLoadCollection = async () => {
      try {
        if (!isEmpty(defaultAccount)) {          
          setIsLoading(true)
          await backgroundRequest.gallery.loadCollections({ address: defaultAccount.address })
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
    if (!isEmpty(defaultAccount) && !collectionsLoaded) {
      handleLoadCollection()
    }
  }, [defaultAccount])

  return (
    <div className='collections-container'>
      <div>
        <Header 
          setShowCreateCollection={setShowCreateCollection}
        />
        <CollectionList collections={collections}/>
      </div>
    </div>
  )
}
