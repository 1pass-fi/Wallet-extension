import React, { useContext, useEffect, useMemo, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import clsx from 'clsx'

import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'

import Button from 'finnie-v2/components/Button'

import { OnboardingContext } from '../../onboardingContext'

const ImportPhrase = ({ step, setStep, importType }) => {
  const { importFromSeedphrase } = useContext(OnboardingContext)

  const [completePhrase, setCompletePhrase] = useState([])
  const [seedphrase, setSeedphrase] = useState('')
  const [validPhrase, setValidPhrase] = useState(false)
  const [messageError, setMessageError] = useState('')

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

    const changeIndex = newCompletePhrase.findIndex((item) => item.index === idx)
    newCompletePhrase[changeIndex].word = e.target.value?.trim()

    setCompletePhrase(newCompletePhrase)

    const seedPhrase = completePhrase
      .map((phrase) => {
        return phrase.word?.trim()
      })
      .filter(Boolean)
      .join(' ')

    console.log('completePhrase', importType, seedPhrase)

    let isValid = true
    completePhrase.forEach((word) => {
      if (isEmpty(word.word)) {
        isValid = false
      }
    })
    setValidPhrase(isValid)
    setSeedphrase(seedPhrase)
  }

  const onClickContinue = async () => {
    try {
      if (!validPhrase) {
        setMessageError('Invalid Secret Recovery Phrase')
        return
      }

      const address = await importFromSeedphrase(seedphrase, importType)
      if (address) setStep(12)
    } catch (err) {
      console.error(err.message)
      setError('Import wallet error')
    }
  }

  return (
    <div className="mt-40 ml-24 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div className="font-normal text-lg leading-8 tracking-finnieSpacing-tight">
        Type in your secret phrase to import your key.
      </div>
      <div className="flex flex-col" style={{ width: '347px' }}>
        <div
          style={{ height: '182px' }}
          className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm leading-6"
        >
          {completePhrase.map((phrase, index) => {
            return (
              <div className="flex ml-7.5 my-auto gap-2" key={index}>
                {index + 1}.
                <input
                  key={index}
                  className="bg-transparent focus:outline-none cursor-pointer w-22 h-5.5"
                  type="text"
                  onChange={(e) => onChangeInputPhrase(e, index)}
                  value={completePhrase[index].word}
                />
              </div>
            )
          })}
        </div>

        {/* <div className="mt-1.5 text-red-finnie ml-7 text-xs font-normal h-2">{messageError}</div> */}

        <Button
          style={{ width: '240px', height: '42px' }}
          className="mt-10.75 text-base mx-auto rounded z-10"
          variant="white"
          text="Confirm"
          disabled={!validPhrase}
          onClick={onClickContinue}
        />
      </div>
    </div>
  )
}

export default ImportPhrase
