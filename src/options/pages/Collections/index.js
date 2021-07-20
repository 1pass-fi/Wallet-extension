import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isString } from 'lodash'

import './index.css'
import CollectionList from 'options/components/collectionList'
import { GalleryContext } from 'options/galleryContext'
import { loadCollections } from 'options/utils'

import AddIcon from 'img/add-icon-green.svg'
import storage from 'storage'

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
    setCollectionsLoaded
  } = useContext(GalleryContext)

  useEffect(() => {
    const getCollectionsFromStorage = async () => {
      const savedCollections = await storage.arweaveWallet.get.collections() || []
      setCollections(savedCollections)
    }

    getCollectionsFromStorage()
  }, [])

  useEffect(() => {
    const handleLoadCollection = async () => {
      try {
        if (address) {
          setIsLoading(true)
          const result = await loadCollections(address)
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
    if (address && !collectionsLoaded) {
      handleLoadCollection()
    }
  }, [address])

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
