import React, { useContext, useEffect } from 'react'
import Layout from 'options/layout'
import Content from 'options/components/content'
import { GalleryContext } from 'options/galleryContext'
import { useSelector } from 'react-redux'


export default () => {
  const { setShowCreateCollection } = useContext(GalleryContext)

  const createCollection = useSelector(state => state.createCollection)

  useEffect(() => {
    if (createCollection.stage !== 1) {
      setShowCreateCollection(false)
    }
  }, [])

  return (<Content />)
}
