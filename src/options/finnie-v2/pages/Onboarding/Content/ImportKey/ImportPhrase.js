import React, { useContext, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import Button from 'finnie-v2/components/Button'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'
import isEmpty from 'lodash/isEmpty'

import { OnboardingContext } from '../../onboardingContext'

const ImportPhrase = ({ step, setStep, importType }) => {
  const { importFromSeedphrase } = useContext(OnboardingContext)

  const [completePhrase, setCompletePhrase] = useState([])
  const [seedphrase, setSeedphrase] = useState('')
  const [validPhrase, setValidPhrase] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [isImporting, setIsImporting] = useState(false)

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

      console.log('completePhrase', importType, completePhrase)
      console.log('seedPhrase', importType, seedPhrase)

      completePhrase.forEach((word) => {
        if (isEmpty(word.word)) {
          isValid = false
        }
      })
    }
    setValidPhrase(isValid)
    setSeedphrase(seedPhrase)
  }

  const onClickContinue = async () => {
    try {
      if (isImporting) return
      if (!validPhrase) {
        setMessageError('Invalid Secret Secret Phrase')
        return
      }

      setIsImporting(true)
      const address = await importFromSeedphrase(seedphrase, importType)
      setIsImporting(false)
      if (address) setStep(12)
    } catch (err) {
      console.error(err.message)
      setError('Import wallet error')
    }
  }

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      onClickContinue()
    }
  }

  return (
    <div className="mt-40 ml-24 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div className="font-normal text-lg leading-8 tracking-finnieSpacing-tight">
        Type in your secret phrase to import your key.
      </div>
      <div className="font-normal text-sm mt-2">
        Hit the{' '}
        <span className="text-lightBlue bg-warmGray-300 bg-opacity-20 rounded-xs px-0.75 mx-0.5">
          tab
        </span>
        button to move to the next word.
      </div>
      <div className="flex flex-col" style={{ width: '347px' }}>
        <div
          style={{ height: '182px' }}
          className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm leading-6"
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
                />
              </div>
            )
          })}
        </div>

        {/* <div className="mt-1.5 text-red-finnie ml-7 text-xs font-normal h-2">{messageError}</div> */}

        <Button
          style={{ width: '240px', height: '42px' }}
          className={clsx('mt-10.75 text-base mx-auto rounded z-10', isImporting && 'cursor-wait')}
          variant="white"
          text="Confirm"
          // disabled={!validPhrase}
          onClick={onClickContinue}
        />
      </div>
    </div>
  )
}

export default ImportPhrase
