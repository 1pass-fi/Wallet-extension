import { GalleryContext } from 'options/galleryContext'
import React, { useContext, useEffect, useState } from 'react'

import Twitter from 'img/social-icons/twitter-icon.svg'
import Facebook from 'img/social-icons/facebook-icon.svg'
import LinkedIn from 'img/social-icons/linkedin-icon.svg'
import Email from 'img/social-icons/email-icon.svg'

import './index.css'
import Tag from '../Tag'

const Share = () => {
  return (
    <div className='share'>
      <div className='share-buttons'>
        <button className='yellow'>Share</button>
        <button>Embed</button>
      </div>
      <div className='share-social'>
        <div className='twitter'><Twitter/></div>
        <div className='facebook'><Facebook/></div>
        <div className='linkedin'><LinkedIn/></div>
        <div className='email'><Email/></div>
      </div>
    </div>
  )
}

export default ({ collectionName, description, tags }) => {
  const { collectionNFT, setCollectionNFT } = useContext(GalleryContext)
  const [nfts, setNfts] = useState([])

  useEffect(() => {
    setNfts([...collectionNFT])
    setCollectionNFT([])
  }, [])

  return (
    <div className='success'>
      <div className='hint'>
        Start earning attention rewards when your friends and followers check out your new collection.
      </div>
      {/* 
        Currently on koi.rocks still not have Collections. We will hide this for now.
      */}      
      {/* <Share /> */}
      <div className='nfts'>
        {nfts.map((nft, index) => {
          if (nft.url) return (
            <div className='nft-wrapper' key={index}>
              {nft.contentType.includes('image') ? <img src={nft.url}></img> :
                <video
                  width={118}
                  height={118}
                  src={nft.url}
                  className='nft-img'
                  controls
                  autoPlay
                  muted
                />
              }
            </div>
          )
        })}
      </div>
      <div className='info'>
        <div className='name'>{collectionName}</div>
        <div className='description'>{description}</div>
        <div className='tags'>
          {tags.map((tag, index) => <Tag key={index} tag={tag}/>)}
        </div>
      </div>
    </div>
  )
}
