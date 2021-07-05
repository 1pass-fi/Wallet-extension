import React, { useContext, useState } from 'react'

import './index.css'
import Tag from '../Tag'

import EditIcon from 'img/edit-icon-collection.svg'
import DeleteIcon from 'img/delete-icon-collection.svg'
import { GalleryContext } from 'options/galleryContext'
 
export default ({nfts, tags, setNfts, collectionName, description, stage}) => {
  const { collectionNFT, setCollectionNFT, totalPage, setTotalPage} = useContext(GalleryContext)
  const [page, setPage] = useState(0)

  const handleOnClick = (id) => {
    let nfts = [...collectionNFT]
    nfts = nfts.filter((nft) => nft.id !== id)
    nfts.push({})
    const notEmpty = nfts.filter((nft) => nft.id)
    if ((notEmpty.length % 5 === 0 && notEmpty.length > 0)) {
      nfts = notEmpty
    }
    if ((totalPage - nfts.length / 5 === 1) && page === totalPage - 1) {
      setPage(page - 1)
    }
    setTotalPage(nfts.length / 5)
    setCollectionNFT([...nfts])
  }

  return (
    <div className='select-nft'>
      {/* INFO */}
      <div className='info'>
        <div className='nft-title'>
          <div className='edit-icon'><EditIcon /></div>
          <>{collectionName}</>
        </div>
        <div className='description'>{description}</div>
      </div>

      {/* TAGS */}
      <div className='tags' tags={tags}>
        {tags.map((tag, index) => <Tag key={index} tag={tag}/>)}
      </div>

      {/* HINT */}
      {stage === 2 && <div className='hint'>Click on each NFT from your gallery to include</div>}

      {/* NFTs */}
      {stage === 2 &&
      <div className='nft'>
        {(nfts.slice(page*5, page*5 + 5)).map((nft, index) => (
          <div key={index} className={nft.url ? 'nft-wrapper' : 'nft-wrapper empty'}>
            {nft.url && <img src={nft.url}></img>}
            {nft.url && <div onClick={() => handleOnClick(nft.id)} className='delete-icon'><DeleteIcon /></div>}
          </div>
        ))}
      </div>      
      }
      {stage === 3 &&
      <div className='selected-nft'>
        {(collectionNFT.map((nft, index) => {
          if (nft.url) return (
            <div className='nft-wrapper' key={index}>
              <img src={nft.url}></img>
            </div>
          )
        }))}
      </div>
      }

      {/* PAGES */}
      {stage === 2 && <div className='page'>
        {[...Array(totalPage)].map((a, index) => <div 
          key={index} 
          className={page === index ? 'pageNum active': 'pageNum'}
          onClick={() => setPage(index)}
        ></div>)}
      </div>}

      {/* PRICE */}
      {stage === 3 && 
      <div className='price'>
        <div>Estimated costs:</div>
        <div className='price-amount'>
          <div>1 KOII</div>
          <div>0.0014 AR</div>
        </div>
      </div>
      }
    </div>
  )
}
