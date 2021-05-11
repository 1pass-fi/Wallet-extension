import React, { useEffect, useMemo, useState } from 'react'
import union from 'lodash/union'
import map from 'lodash/map'
import filter from 'lodash/filter'

import KeyIcon from 'img/key-icon.svg'
import Card from 'shared/card'
import Button from 'shared/button'
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

  const confirmActive = useMemo(
    () => basePhrase.length === addedPhrase.length,
    [basePhrase, addedPhrase]
  )

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
      <Card className='confirmation-card'>
        <div className='title'>
          <KeyIcon className='icon' />
          <div className='text'>Confirm Backup Phrase</div>
        </div>
        <div className='description'>
          Select each word in order to make sure it is correct.
        </div>
        <div className='selected-box'>
          {addedPhrase.map((word) => (
            <button
              className='word'
              key={word}
              onClick={() => onRemoveWord(word)}
            >
              {word}
            </button>
          ))}
        </div>
        <div className='b2'>
          {basePhrase.map(({ word, disabled }) => (
            <button
              key={word}
              className={`word ${disabled ? 'disabled' : ''}`}
              onClick={() => onAddWord(word)}
            >
              {word}
            </button>
          ))}
        </div>
        <Button
          className='confirm-button'
          label={'Confirm'}
          type={confirmActive ? '' : 'outline'}
        />
      </Card>
    </div>
  )
}
