import React, { useEffect, useState } from 'react'
import union from 'lodash/union'
import map from 'lodash/map'
import filter from 'lodash/filter'

import './index.css'

export default ({ seedPhrase }) => {
  const [basePhrase, setBasePhrase] = useState([])
  const [addedPhrase, setAddedPhrase] = useState([])

  useEffect(() => {
    const constructedSeedPhrase = seedPhrase.map((word) => ({
      word,
      disabled: false,
    }))

    setBasePhrase(constructedSeedPhrase)
  }, [])

  const onAddWord = (newWord) => {
    // Add new word
    setAddedPhrase(union(addedPhrase, [newWord]))

    // Dissable word in base phrase
    const updatedPhrase = map(basePhrase, (item) => {
      if (item.word === newWord) {
        return {
          ...item,
          disabled: true,
        }
      }
      return item
    })
    setBasePhrase(updatedPhrase)
  }

  const onRemoveWord = (removeWord) => {
    // Update added phrase
    const updatedAddedPhrase = filter(
      addedPhrase,
      (word) => word !== removeWord
    )
    setAddedPhrase(updatedAddedPhrase)

    // Update base phrase
    const updatedPhrase = map(basePhrase, (item) => {
      if (item.word === removeWord) {
        return {
          ...item,
          disabled: false,
        }
      }
      return item
    })
    setBasePhrase(updatedPhrase)
  }

  return (
    <div>
      <div className='b1'>
        {addedPhrase.map((word) => (
          <button className='box' key={word} onClick={() => onRemoveWord(word)}>
            {word}
          </button>
        ))}
      </div>
      <div>helllo</div>
      <div className='b2'>
        {basePhrase.map(({ word, disabled, onClick }) => (
          <button
            key={word}
            className={`box ${disabled ? 'disabled' : ''}`}
            onClick={() => onAddWord(word)}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  )
}
