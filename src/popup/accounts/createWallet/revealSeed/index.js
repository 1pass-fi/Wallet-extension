import React from 'react'

export default ({ seedPhrase, setStage, password }) => {
  return (
    <div>
      <div>REVEAL SEED: {seedPhrase}, PASSWORD: {password}</div>
      <button onClick={() => setStage(3)}>Next</button>
    </div>
  )
}
