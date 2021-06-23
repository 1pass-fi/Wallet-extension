import React, { useContext } from 'react'
import { trim } from 'lodash'

import Checkbox from 'popup/components/shared/checkbox'
import './index.css'

import { UploadContext } from '../../../index'

export default ({
  stage,
  title,
  description,
  username,
  setDescription,
  setTitle,
  setUsername,
}) => {
  const { setTags, tags } = useContext(UploadContext)

  const addTag = (e) => {
    const value = trim(e.target.value)
    if (e.keyCode === 32 || e.keyCode === 13) {
      if (value && !tags.includes(value)) setTags([...tags, value])
      e.target.value = ''
    }
  }

  if (stage == 1) {
    return (
      <div className='right-column stage1'>
        <div className='field'>
          <label className='field-label'>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='field-input'
          ></input>
        </div>
        <div className='field'>
          <label className='field-label'>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='field-input'
          ></input>
        </div>
        <div className='field'>
          <div hidden={true} className='field-checkbox'><Checkbox /></div>
          <label hidden={true} className='field-label-checkbox'>Save my username for future NFTs</label>
        </div>
        <div className='field'>
          <label className='field-label'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='field-input'
          />
        </div>
        <div className='field'>
          <label className='field-label'>Tags</label>
          <input
            className='field-input'
            onKeyUp={addTag}
          ></input>
        </div>
      </div>
    )
  }

  if (stage == 2) {
    return (
      <div className='right-column stage2'>
        <div className='estimate-cost'>
          <div className='estimate-cost-title'>Estimated Costs</div>
          <div className='estimate-ar'>0.0002 AR</div>
          <div className='estimate-koi'>1.00 KOI</div>
        </div>
      </div>
    )
  }

  return (
    <div className='right-column stage3'>
      <div className='preview-info'>{title}</div>
      <div className='preview-info'>{username}</div>
    </div>
  )
}
