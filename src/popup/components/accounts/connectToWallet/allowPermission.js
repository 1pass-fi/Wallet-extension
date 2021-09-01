// modules
import React from 'react'
import Button from 'popup/components/shared/button'

// components
import Checkbox from 'popup/components/shared/checkbox'

// styles
import '../index.css'

const AllowPermission = ({ handleOnClick }) => {
  return (
    <div className='allow-permission'>
      <div className='label'>Allow this site to:</div>
      <div className={`permission ${true && 'checked'}`}>
        <Checkbox 
          className='check-allow'
          defaultChecked={true}
          isDisabled={true}
          onChange={(e) => {}}
          label='View the addresses of your permitted accounts (required)'
        />
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
