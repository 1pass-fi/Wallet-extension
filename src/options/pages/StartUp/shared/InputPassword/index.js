import React, { useState } from 'react'

import InputField from '../InputField'

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
