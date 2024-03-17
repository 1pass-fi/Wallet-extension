import React, { useContext, useEffect, useMemo, useState } from 'react'
import { validateMnemonic } from 'bip39'
import clsx from 'clsx'
// import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'
import isEmpty from 'lodash/isEmpty'
import Button from 'options/components/Button'
import wordList from 'utils/wordList.json'

import { OnboardingContext } from '../../onboardingContext'

const ImportPhrase = ({ step, setStep, importType }) => {
  const { importFromSeedphrase } = useContext(OnboardingContext)

  const [completePhrase, setCompletePhrase] = useState([])
  const [seedphrase, setSeedphrase] = useState('')
  const [validPhrase, setValidPhrase] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [canClickContinue, setCanClickContinue] = useState(false)

  const checkSeedPhraseInWordList = (phrase) => phrase.every((word) => wordList.includes(word))

  useEffect(() => {
    let initialPhrase = []
    let n = 0
    while (n < 12) {
      initialPhrase.push({ index: n, word: '' })
      n++
    }
    setCompletePhrase(initialPhrase)
  }, [])

  const onChangeInputPhrase = (e, idx) => {
    setMessageError('')

    let newCompletePhrase = [...completePhrase]
    let seedPhrase
    let isValid = true

    if (e.target.value?.split(' ').length == 12) {
      newCompletePhrase = e.target.value?.split(' ').map((item, index) => ({
        index: index,
        word: item
      }))

      setCompletePhrase(newCompletePhrase)

      seedPhrase = newCompletePhrase
        .map((phrase) => {
          return phrase.word?.trim()
        })
        .filter(Boolean)
        .join(' ')
    } else {
      const changeIndex = newCompletePhrase.findIndex((item) => item.index === idx)
      newCompletePhrase[changeIndex].word = e.target.value?.replace(/ /g, '')

      setCompletePhrase(newCompletePhrase)

      seedPhrase = completePhrase
        .map((phrase) => {
          return phrase.word?.trim()
        })
        .filter(Boolean)
        .join(' ')

      completePhrase.forEach((word) => {
        if (isEmpty(word.word)) {
          isValid = false
        }
      })
    }
    setValidPhrase(isValid)
    setSeedphrase(seedPhrase)
  }

  useEffect(() => {
    setCanClickContinue(
      checkSeedPhraseInWordList(seedphrase.split(' ')) && seedphrase.split(' ').length === 12
    )
  }, [seedphrase])

  const onClickContinue = async () => {
    try {
      setMessageError('')
      if (isImporting) return

      if (!validPhrase || !validateMnemonic(seedphrase)) {
        setMessageError(chrome.i18n.getMessage('invalidSecretPhrase'))
        return
      }

      setIsImporting(true)
      const address = await importFromSeedphrase(seedphrase, importType)
      setIsImporting(false)
      if (address) setStep(12)
    } catch (err) {
      console.error(err.message)
      setMessageError('Import wallet error')
    }
  }

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      onClickContinue()
    }
  }

  return (
    <div data-testid="ImportPhrase" className="mt-40 ml-24 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className={clsx('welcome-bg-top')} />
      {/* <WelcomeBackgroundBottom className={clsx('welcome-bg-bottom')} /> */}
      <div className="font-normal text-lg leading-8 tracking-finnieSpacing-tight">
        {chrome.i18n.getMessage('typeSecretPhrase')}
      </div>
      <div className="font-normal text-sm mt-2">
        {chrome.i18n.getMessage('hitThe')}{' '}
        <span className="text-lightBlue bg-warmGray-300 bg-opacity-20 rounded-xs px-0.75 mx-0.5">
          {chrome.i18n.getMessage('tabLc')}
        </span>{' '}
        {chrome.i18n.getMessage('moveToTheNextWordLc')}
      </div>
      <div className={clsx('flex flex-col max-w-full z-10')} style={{ width: '347px' }}>
        <div
          style={{ height: '182px' }}
          className="sm:mt-2 lg:mt-4 mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm leading-6"
        >
          {completePhrase.map((phrase, index) => {
            return (
              <div className="flex ml-7.5 my-auto" key={index}>
                <div className="w-5 text-right mr-3">{index + 1}. </div>
                <input
                  key={index}
                  className="bg-transparent focus:outline-none cursor-pointer w-22 h-5.5"
                  type="text"
                  onChange={(e) => onChangeInputPhrase(e, index)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  value={completePhrase[index].word}
                  data-testid={`import-phrase-${index}`}
                />
              </div>
            )
          })}
        </div>

        <div
          data-testid="import-phrase-error"
          className="sm:mt-0 lg:mt-1 mt-1.5 text-red-finnie ml-7 text-xs font-normal h-2"
        >
          {messageError}
        </div>

        <Button
          style={{ width: '240px', height: '42px' }}
          className={clsx('sm:mt-2 lg:mt-4 mt-10.75 text-base mx-auto rounded z-10', isImporting && 'cursor-wait')}
          variant="white"
          text={chrome.i18n.getMessage('confirm')}
          disabled={!canClickContinue}
          onClick={onClickContinue}
          id="confirm-button"
        />
      </div>
    </div>
  )
}

export default ImportPhrase
