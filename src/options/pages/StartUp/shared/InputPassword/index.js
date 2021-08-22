import React, { useState } from 'react'

import InputField from '../InputField'

export default ({ setPassword }) => {

  return (
    <>
      <InputField
        label={'Password'}
        setValue={setPassword}
      />
    </>
  )
}
