import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import './index.css'
import CollectionList from 'options/components/collectionList'
import { GalleryContext } from 'options/galleryContext'
import CollectionDetail from '../CollectionDetails'

import AddIcon from 'img/add-icon-green.svg'

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
  const { demoCollections, setShowCreateCollection, setPage, setTotalPage, setStage } = useContext(GalleryContext)

  const [collection, setCollection] = useState({})

  return (
    <div className='collections-container'>
      
      {
        !collection.id ?
          <div>
            <Header 
              setShowCreateCollection={setShowCreateCollection}
              setStage={setStage}
              setPage={setPage}
              setTotalPage={setTotalPage}
            />
            <CollectionList setCollection={setCollection} collections={demoCollections}/>
          </div>
          :
          <CollectionDetail collection={collection} setCollection={setCollection}/>
      }
    </div>
  )
}
