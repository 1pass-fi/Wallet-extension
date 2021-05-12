import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import union from 'lodash/union'
import map from 'lodash/map'
import shuffle from 'lodash/shuffle'
import filter from 'lodash/filter'

import KeyIcon from 'img/key-icon.svg'
import WarningIcon from 'img/warning-icon.svg'
import CancelIcon from 'img/x-icon.svg'

import Card from 'shared/card'
import Button from 'shared/button'
import './index.css'

export default ({ seedPhrase, handleSaveWallet, handleReloadWallet, handleCancel, password }) => {
  const wordLists = shuffle(seedPhrase.split(' '))
  const history = useHistory()
  const [basePhrase, setBasePhrase] = useState([])
  const [addedPhrase, setAddedPhrase] = useState([])

  const handleOnClick = async () => {
    try {
      if (seedPhrase === addedPhrase.join(' ')) {
        await handleSaveWallet(password)
        await handleReloadWallet()
        history.push('/account')
      } else {

      }
    } catch (err) {
      console.log(err.message)
    }
  }

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

  useEffect(() => {
    const constructedSeedPhrase = wordLists.map((word) => ({
      word,
      disabled: false,
    }))

    setBasePhrase(constructedSeedPhrase)
  }, [])

  return (
    <div>
      <Card className='confirmation-card'>
        <div onClick={handleCancel} className='cancel-icon'>
          <CancelIcon />
        </div>
        <div className='title'>
          <KeyIcon className='icon' />
          <div className='text'>Secret Backup Phrase</div>
        </div>
        <div className='description'>
          Your secret backup phrase makes it easy to back up and restore your
          account.
        </div>
        <div className='warning'>
          <WarningIcon className='warning-icon' />
          <div className='warning-text'>
            Your secret backup phrase makes it easy to back up and restore your
            account.
          </div>
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
          onClick={handleOnClick}
        />
      </Card>
    </div>
  )
}
