import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import BulletPointIcon from 'img/bullet-point.svg'
import CheckIcon from 'img/check-icon-onboarding.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import { setIsOnboarding, setOnboardingPath } from 'options/actions/onboardingProcessing'

const UploadJsonSuccess = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <WelcomeBackgroundTop className={clsx('absolute top-0 right-0 z-0')} />
      <WelcomeBackgroundBottom className={clsx('absolute bottom-0 left-0 z-0')} />
      <div className="text-left">
        <div className="flex items-center text-2xl font-semibold">
          <CheckIcon />
          <div>
            Your key was <br /> successfully imported!
          </div>
        </div>
        <div className="mt-8 text-sm font-normal ml-3">
          <div>Remember:</div>
          <div className="flex mt-2 mb-2">
            <div className="pt-2 mr-2">
              <BulletPointIcon />
            </div>
            <div>
              Stay safe from phising scams - <br />{' '}
              <span className="text-warning">
                Koii will NEVER ask you for your recovery phrase or keyfile
              </span>
            </div>
          </div>
          <div className="flex">
            <div className="pt-2 mr-2">
              <BulletPointIcon />
            </div>
            <div>
              If you have questions or see something suspicious, contact us <br /> at{' '}
              <span className="text-turquoiseBlue">security@koii.network</span>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          dispatch(setIsOnboarding(false))
          dispatch(setOnboardingPath(''))
          history.push('/settings/wallet')
        }}
        className="absolute bottom-10 right-8 underline text-lightBlue cursor-pointer z-10"
      >
        Go to Settings
      </div>
    </div>
  )
}

export default UploadJsonSuccess
