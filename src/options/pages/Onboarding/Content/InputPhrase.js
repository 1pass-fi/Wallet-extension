import React, { useContext, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import HiddenPhraseIcon from 'img/v2/onboarding/hidden-phrase.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'
import WelcomeBackground from 'img/v2/onboarding/welcome-background-1.svg'
import Button from 'options/components/Button'

import { OnboardingContext } from '../onboardingContext'

const InputPhrase = ({ step, setStep, phrase, importType }) => {
  const { saveNewKey, newSeedphrase, setSkipPhrase } = useContext(OnboardingContext)

  const [hiddenPhrase, setHiddenPhrase] = useState([])
  const [completePhrase, setCompletePhrase] = useState([])
  const [isNextStep, setIsNextStep] = useState(false)
  const [messageError, setMessageError] = useState('')

  const SEED_STRING = useMemo(() => {
    return newSeedphrase
  }, [newSeedphrase])
  const SEED_ARRAY = useMemo(() => {
    return SEED_STRING.split(' ')
  }, [SEED_STRING])

  useEffect(() => {
    const getRandom = (seedString, n) => {
      let seedArray = seedString.split(' ')
      let result = []
      let taken = []

      while (n !== 0) {
        let index = Math.floor(Math.random() * seedArray.length)
        if (!taken.includes(index)) {
          result.push({ index: index, word: seedArray[index] })
          taken.push(index)
          n--
        }
      }

      result.sort((a, b) => {
        return a.index < b.index ? -1 : 1
      })

      return result
    }

    let result = getRandom(SEED_STRING, 3)

    const newCompletePhrase = result.map((obj, index) => {
      let new_obj = { ...obj, word: '' }
      return new_obj
    })

    setCompletePhrase(newCompletePhrase)
    setHiddenPhrase(result)
  }, [phrase])

  const onChangeInputPhrase = (e, idx) => {
    let newCompletePhrase = [...completePhrase]

    const changeIndex = newCompletePhrase.findIndex((item) => item.index === idx)
    newCompletePhrase[changeIndex].word = e.target.value?.replace(/ /g, '')

    setCompletePhrase(newCompletePhrase)
    setMessageError('')
  }

  useEffect(() => {
    if (completePhrase.length > 0) {
      let canContinue = true
      for (let obj of completePhrase) {
        if (obj.word === '') {
          canContinue = false
          break
        }
      }
      setIsNextStep(canContinue)
    }
  }, [completePhrase])

  const onClickContinue = async () => {
    const validateInputPhrase = () => {
      let isValid = true
      for (let i = 0; i < completePhrase.length; i++) {
        if (completePhrase[i].word !== hiddenPhrase[i].word) {
          isValid = false
          break
        }
      }
      return isValid
    }

    if (validateInputPhrase()) {
      await saveNewKey(importType)
      setStep(step + 1)
    } else {
      setMessageError(chrome.i18n.getMessage('invalidSecretPhrase'))
    }
  }

  const handleSkipThisStep = async () => {
    await saveNewKey(importType)
    setSkipPhrase(true)
    setStep(6)
  }

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      onClickContinue()
    }
  }

  return (
    <div
      data-testid="InputPhrase"
      className="w-11/12 flex flex-col text-white text-left max-w-full"
      style={{ width: '500px' }}
    >
      <WelcomeBackground className={clsx('absolute bottom-0 right-0 z-0')} />
      <div className="lg:mt-8 mt-10 font-semibold text-2xl tracking-finnieSpacing-wider z-10">
        {chrome.i18n.getMessage('saveYourSecretPhrase')}
      </div>

      {/* <div className="mt-5 font-normal text-lg leading-6">
        Do you have a <span className="text-turquoiseBlue">pen & paper handy?</span>
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        What about a <span className="text-turquoiseBlue">safe place to keep it?</span>
      </div> */}

      <div className="lg:mt-4 mt-8 font-normal text-lg leading-6 text-white">
        {chrome.i18n.getMessage('typeInTheMissingWords')}
      </div>

      <div
        className="flex flex-col max-w-full z-51 text-red-600"
        style={{ width: '347px', zIndex: 2 }}
      >
        <div
          style={{ height: '182px' }}
          className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm leading-6 z-20"
        >
          {SEED_ARRAY.map((phrase, index) => {
            return hiddenPhrase.map((obj) => obj.index).includes(index) ? (
              <div className="flex mx-7.5 my-auto" key={index}>
                <div className="w-5 text-right mr-3">{index + 1}. </div>
                <input
                  className="bg-transparent border-b-2 focus:outline-none cursor-pointer w-22 h-5.5"
                  type="text"
                  onChange={(e) => onChangeInputPhrase(e, index)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  value={completePhrase.find((obj) => obj.index === index).word}
                  data-testid={`input-phrase-${index}`}
                />
              </div>
            ) : (
              <div className="mx-7.5 my-auto flex" key={index}>
                <div className="w-5 text-right mr-3">{index + 1}. </div>
                <div data-testid={`input-phrase-${index}`}>{phrase}</div>
              </div>
            )
          })}
        </div>

        <div
          data-testid="input-phrase-error"
          className="mt-1.5 text-red-finnie ml-7 text-xs font-normal h-2"
        >
          {messageError}
        </div>

        <Button
          style={{ width: '240px', height: '42px' }}
          className="mt-10.75 text-base mx-auto rounded z-10"
          variant="white"
          text={chrome.i18n.getMessage('confirmPhrase')}
          // disabled={!isNextStep}
          onClick={onClickContinue}
          id="continue-button"
        />
      </div>

      <div
        className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
        onClick={handleSkipThisStep}
      >
        {chrome.i18n.getMessage('skipThisStep')}
      </div>
    </div>
  )
}

export default InputPhrase
