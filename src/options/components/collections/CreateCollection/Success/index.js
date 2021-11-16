import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Twitter from 'img/social-icons/twitter-icon.svg'
import Facebook from 'img/social-icons/facebook-icon.svg'
import LinkedIn from 'img/social-icons/linkedin-icon.svg'
import Email from 'img/social-icons/email-icon.svg'

import './index.css'
import Tag from '../Tag'

import { setCreateCollection } from 'options/actions/createCollection'

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
  const [nfts, setNfts] = useState([])

  const createCollection = useSelector(state => state.createCollection)
  const dispatch = useDispatch()

  useEffect(() => {
    setNfts([...createCollection.selectedNfts])
    dispatch(setCreateCollection({ selectedNfts: [] }))
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
              {nft?.contentType?.includes('image') && 
                <img src={nft.url}></img>
              }
              {nft?.contentType.includes('video') && 
                <video
                  width={118}
                  height={118}
                  src={nft.url}
                  className='nft-img'
                  controls
                  muted
                />
              }
              {nft?.contentType?.includes('html') &&
                <div className='iframe-wrapper-success'>
                  <iframe frameBorder="0" src={nft.url}/>
                </div>
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
