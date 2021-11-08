import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { union, trim } from 'lodash'

import './index.css'
import Tag from '../Tag'
import EditIcon from 'img/edit-icon-collection.svg'
import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'
import { getArAccounts } from 'options/selectors/accounts'
import { setDefaultAccount } from 'options/actions/defaultAccount'

export default ({tags, setColletionName, setDescription, setTags, collectionName, description}) => {
  const [tagInput, setTagInput] = useState('')
  const { setShowSelectAccount } = useContext(GalleryContext)

  const dispatch = useDispatch()

  const defaultAccount = useSelector(state => state.defaultAccount)
  const arAccounts = useSelector(getArAccounts)

  const addTag = (e) => {
    const { keyCode } = e
    if (keyCode === 13 || keyCode === 188) {
      let newTags = tagInput.split(',')
      newTags = newTags.map((tag) => trim(tag)).filter((tag) => tag.replace(/\s/g, '').length)
      setTags(union(tags, newTags))
      setTagInput('')
    }
  }

  useEffect(() => {
    if(defaultAccount.type !== TYPE.ARWEAVE){
      dispatch(setDefaultAccount(arAccounts[0]))
    }
  }, [])

  return (
    <div className='input-info'>
      {/* HINT */}
      <div className='hint'>
        Name your collection and add details.
      </div>

      {/* INPUT FORM */}
      <div className='form'>
        <div className='field'>
          <div className='label'>
            Wallet
            <div onClick={() => setShowSelectAccount(true)} className='edit-icon'><EditIcon /></div>
          </div>
          <div className='selected-account'>
            {defaultAccount.accountName}
            <div className='address'>{`${defaultAccount.address.slice(0,5)}...${defaultAccount.address.slice(defaultAccount.address.length - 4)}`}</div>
          </div>
        </div>
        <div className='field'>
          <div className='label'>Name your collection:</div>
          <div><input value={collectionName} onChange={(e) => setColletionName(e.target.value)}/></div>
        </div>
        <div className='field'>
          <div className='label'>Add a description:</div>
          <div><textarea value={description} onChange={(e) => setDescription(e.target.value)}/></div>
        </div>
        <div className='field'>
          <div className='label for-tags'>
            Add tags
            <div className='hint'>
              (hit enter after each tag or separate them by commas)
            </div>
          </div>
          <div><input 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyUp={addTag}
          /></div>
        </div>
      </div>

      {/* TAGS */}
      <div className='tags'>
        {tags.map((tag, index) => <Tag key={index} tag={tag} setTags={setTags} tags={tags}/>)}
      </div>
    </div>
  )
}
