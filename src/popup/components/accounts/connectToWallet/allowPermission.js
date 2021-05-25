import React from 'react'
import Button from 'popup/components/shared/button'

import '../index.css'

const AllowPermission = ({ handleOnClick }) => {
  return (
    <div className='allow-permission'>
      <div className='label'>Allow this site to:</div>
      <div className={`permission ${true && 'checked'}`}>
        <input
          type='checkbox'
          className='check-allow'
          checked={true}
          onChange={(e) => { }}
          disabled={true}
        />
        <div className='permission-content'>
          View the addresses of your permitted accounts (required)
        </div>
      </div>
      <div className='trust-sites'>Only connect with sites you trust.</div>
      <div className='button-line'>
        <Button className='button connect' label='Connect' onClick={() => handleOnClick(true)} />
        <Button className='button reject' type='outline' label='Reject' onClick={() => handleOnClick(false)} />
      </div>
    </div>
  )
}

export default AllowPermission
