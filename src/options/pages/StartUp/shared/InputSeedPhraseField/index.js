import React, { useRef, useEffect, useState } from 'react'

import EyeIcon from 'img/startup/eye.svg'
import SeedPhraseErrorIcon from 'img/seed-phrase-error.svg'

import './index.css'
import wordList from 'utils/wordList.json'

import isEmpty from 'lodash/isEmpty'

import { TYPE } from 'constants/accountConstants'

const checkSeedPhraseInWordList = (phrase) => phrase.every((word) => wordList.includes(word))

export default ({
  label = '',
  userSeedPhrase,
  setUserSeedPhrase,
  seedPhraseError,
  setSeedPhraseError,
  walletType,
  setIsSeedPhrase,
}) => {
  const [isShow, setIsShow] = useState(true)
  const [suggestWords, setSuggestWords] = useState([])
  const [selectedWords, setSelectedWords] = useState([])
  const [inputWord, setInputWord] = useState('')
  const [showInput, setShowInput] = useState(false)

  const inputRef = useRef(null)

  useEffect(() => {
    const seedPhrase = selectedWords.join(' ')
    setUserSeedPhrase(seedPhrase)
  }, [selectedWords])

  useEffect(() => {
    if (userSeedPhrase) {
      const currentSeedPhrase = userSeedPhrase?.trim()?.split(' ')
      setSelectedWords(currentSeedPhrase)
    }
  }, [userSeedPhrase])

  useEffect(() => {
    if (showInput) inputRef.current?.focus()
  }, [showInput])

  const addWord = (word) => {
    setSelectedWords([...selectedWords, word])
    setInputWord('')
    setSuggestWords([])
  }

  const removeWord = (removedWord) => {
    const newArr = [...selectedWords]
    newArr.splice(removedWord['index'], 1)
    setSelectedWords(newArr)

    if (checkSeedPhraseInWordList(newArr)) {
      setSeedPhraseError('')
    }
  }

  /*
   * When the input key is Backspace and the user's input is empty:
   *  remove last item from selectWords list
   * - keyCode of 'Backspace': 8
   */
  const handleKeyDown = (e) => {
    if (e.keyCode === 8 && isEmpty(inputWord)) {
      const newArr = [...selectedWords]
      newArr.pop()
      setSelectedWords(newArr)
    }
  }

  const seedPhraseArr = (inputField) => {
    const removedDoubleSpacePhrase = inputField.replace(/\s+/g, ' ')
    const seedPhrase = removedDoubleSpacePhrase?.trim()?.split(' ')
    return seedPhrase
  }

  /*
   * update select words and suggest words base on user's input field
   */
  const updateSuggestWords = (inputField) => {
    setInputWord(inputField)

    /*
     * In case has seed-phrase error:
     *  - Case 1: If the input seed-phrase contains more than one word(s), do nothing (still keep seed-phrase error)
     *  - Case 2: If the input seed-phrase is one: validate current user's selectedWords
     *      + if invalid selectedWords, do nothing
     *      + if valid selectedWord, validate and suggest for inputWord.
     */
    if (seedPhraseError) {
      if (seedPhraseArr(inputField).length > 1) {
        return
      } else {
        if (!checkSeedPhraseInWordList(selectedWords)) {
          return
        }
        setSeedPhraseError('')
      }
    }

    /*
     * If user removes the seed-phrase, suggest word(s) are cleared
     */
    if (!inputField) {
      setSuggestWords([])
      return
    }

    /*
     * check the number of words
     */
    if (inputField.includes(' ')) {
      const seedPhrase = seedPhraseArr(inputField)

      /*
       * if has more than 1 word, convert the input field to word array then add to the selectedWords
       */
      if (seedPhrase.length > 1) {
        const newArr = [...selectedWords]
        const validArr = [...newArr, ...seedPhrase]
        setSelectedWords(validArr)
        setSuggestWords([])
        setInputWord('')
        if (!checkSeedPhraseInWordList(seedPhrase)) {
          setSeedPhraseError('That’s not a valid recovery word. Check the spelling and try again.')
        }
        return
      }

      /*
       * if has 1 word, validate the input
       *  - if valid, add to the selectedWords, then clear inputWord and suggestWords
       *  - else, clear suggestWords and show the spelling error
       */
      if (inputField?.endsWith(' ')) {
        const suggestWordList = wordList.filter((word) => {
          return word.startsWith(inputField?.trim())
        })
        /*
         * If there is only one suggested word for the user's input:
         *  - When the user enters a space, this suggested word is automatically set to the selectWords list.
         */
        if (suggestWordList.length === 1) {
          setSelectedWords([...selectedWords, suggestWordList[0]])
          setInputWord('')
          setSuggestWords([])
          return
        }

        if (checkSeedPhraseInWordList(seedPhrase)) {
          setSelectedWords([...selectedWords, seedPhrase])
          setInputWord('')
          setSuggestWords([])
        } else {
          setSuggestWords([])
          setSeedPhraseError('That’s not a valid recovery word. Check the spelling and try again.')
        }
      }
    } else {
      /*
       * in case the user hasn't finished typing a word, show the suggestWords
       * if there are no suggested word(s) for the user's input, display the spelling error.
       */
      const suggestWordList = wordList.filter((word) => {
        return word.startsWith(inputField)
      })
      setSuggestWords(suggestWordList)
      if (!suggestWordList.length) {
        setSeedPhraseError('That’s not a valid recovery word. Check the spelling and try again.')
      }
    }
  }

  return (
    <div className='input-seedphrase-field'>
      <EyeIcon className='hide-icon' onClick={() => setIsShow(!isShow)} />
      <label className='label'>{label}</label>
      <div
        className='selected-words-wrapper'
        onClick={() => {
          setShowInput(true)
          inputRef.current?.focus()
        }}
      >
        <div className='selected-words'>
          {!userSeedPhrase && !showInput && (
            <div className='seed-phrase-message'>
              Start typing then select from the options below, or copy/paste.
            </div>
          )}
          {selectedWords.length > 0 &&
            selectedWords.map((word, index) => (
              <div key={word + index} className='word' onClick={() => removeWord({ word, index })}>
                {isShow && word}
              </div>
            ))}
          {(showInput || userSeedPhrase) && selectedWords.length < 12 && (
            <input
              type={isShow ? 'text' : 'password'}
              value={inputWord}
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(e) => updateSuggestWords(e.target.value)}
              className='inputSeedPhrase'
              ref={inputRef}
            />
          )}
        </div>
      </div>

      {walletType === TYPE.ETHEREUM && (
        <div className='import-private-key'>
          Have a private key?{' '}
          <span
            onClick={() => {
              setIsSeedPhrase(false)
            }}
            className='import-private-key-link'
          >
            Import it instead.
          </span>
        </div>
      )}

      {!isEmpty(seedPhraseError) ? (
        <div className='error-message'>
          <SeedPhraseErrorIcon className='seed-phrase-error-icon' />
          {seedPhraseError}
        </div>
      ) : (
        <div style={{ height: '164px' }}>
          <div className='unselected-words'>
            {suggestWords.map((word) => (
              <button
                key={word}
                className='word'
                onClick={() => {
                  addWord(word)
                  inputRef.current.focus()
                }}
              >
                {isShow && word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
