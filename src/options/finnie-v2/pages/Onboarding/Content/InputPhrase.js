import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

import WelcomeBackground from 'img/v2/onboarding/welcome-background-1.svg'
import HiddenPhraseIcon from 'img/v2/onboarding/hidden-phrase.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'

import Button from 'finnie-v2/components/Button'

const InputPhrase = ({ step, setStep, phrase }) => {
  // const SEED_ARRAY = phrase.split(' ')
  const [hiddenPhrase, setHiddenPhrase] = useState([])
  const [completePhrase, setCompletePhrase] = useState([])
  const [isNextStep, setIsNextStep] = useState(false)
  const [messageError, setMessageError] = useState('')

  const SEED_STRING = 'color tired merge rural token pole capable people metal student catch uphold'
  const SEED_ARRAY = SEED_STRING.split(' ')

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
    newCompletePhrase[changeIndex].word = e.target.value

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

  const onClickContinue = () => {
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
      setStep(step + 1)
    } else {
      setMessageError('Invalid Secret Recovery Phrase')
    }
  }
  return (
    <div className="w-11/12 flex flex-col text-white text-left">
      <WelcomeBackground className="absolute bottom-0 right-0" />
      <div className="font-semibold text-2xl tracking-finnieSpacing-wider">
        Save your Secret Phrase
      </div>

      <div className="mt-5 font-normal text-lg leading-6">
        Do you have a <span className="text-success">pen & paper handy?</span>
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        What about a <span className="text-success">safe place to keep it?</span>
      </div>

      <div className="mt-8 font-normal text-lg leading-6 text-white">
        Type in the missing words to confirm your secret phase is properly secured.
      </div>

      <div className="flex flex-col" style={{ width: '347px' }}>
        <div
          style={{ height: '182px' }}
          className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm leading-6"
        >
          {SEED_ARRAY.map((phrase, index) => {
            return hiddenPhrase.map((obj, index) => obj.index).includes(index) ? (
              <div className="flex mx-7.5 my-auto gap-2" key={index}>
                {index + 1}.
                <input
                  className="bg-transparent border-b-2 focus:outline-none cursor-pointer w-22 h-5.5"
                  type="text"
                  onChange={(e) => onChangeInputPhrase(e, index)}
                />
              </div>
            ) : (
              <div className="mx-7.5 my-auto" key={index}>
                {index + 1}. {phrase}
              </div>
            )
          })}
        </div>

        <div className="mt-1.5 text-red-finnie ml-7 text-xs font-normal h-2">{messageError}</div>

        <Button
          style={{ width: '240px', height: '42px' }}
          className="mt-10.75 text-base mx-auto rounded z-10"
          variant="white"
          text="Continue"
          disabled={!isNextStep}
          onClick={onClickContinue}
        />
      </div>

      <div
        className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
        onClick={() => setStep(6)}
      >
        Skip this step
      </div>
    </div>
  )
}

export default InputPhrase
