import React, { useState } from 'react'

import InputField from '../InputField'
import './index.css'

export default () => {
  const [inputPassword, setinputPassword] = useState('')

  return (
    <>
      <InputField
        label={'Password'}
        value={inputPassword}
        setValue={setinputPassword}
      />
    </>
  )
}
