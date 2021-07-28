import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isString, isEmpty } from 'lodash'

import './index.css'
import CollectionList from 'options/components/collectionList'
import { GalleryContext } from 'options/galleryContext'
import { loadCollections } from 'options/utils'

import AddIcon from 'img/add-icon-green.svg'
import storage from 'storage'
import { Account } from 'account'

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
    address, 
    collections, 
    setCollections,
    collectionsLoaded,
    setCollectionsLoaded,
    account
  } = useContext(GalleryContext)

  useEffect(() => {
    const getCollectionsFromStorage = async () => {
      const type = await Account.getTypeOfWallet(account.address)
      const _account = await Account.get(account, type)

      const savedCollections = await _account.get.collections() || []
      setCollections(savedCollections)
    }

    if (!isEmpty(account)) getCollectionsFromStorage()
  }, [account])

  useEffect(() => {
    const handleLoadCollection = async () => {
      try {
        if (!isEmpty(account)) {
          const type = await Account.getTypeOfWallet(account.address)
          const _account = await Account.get(account, type)
          
          setIsLoading(true)
          const result = await _account.method.loadCollections()
          await _account.set.collections(result)
          console.log('result', result)
          if (!isString(result)) {
            setCollections(result)
          }
          setIsLoading(false)
          setCollectionsLoaded(true)
        }
      } catch (err) {
        setIsLoading(false)
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
