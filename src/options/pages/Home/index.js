import React, { useContext, useEffect } from 'react'
import Layout from 'options/layout'
import Content from 'options/components/content'
import { GalleryContext } from 'options/galleryContext'


export default () => {
  const { stage, setShowCreateCollection } = useContext(GalleryContext)

  useEffect(() => {
    if (stage !== 1) {
      setShowCreateCollection(false)
    }
  }, [])

  return (<Content />)
}
