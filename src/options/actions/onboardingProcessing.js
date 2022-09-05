import { SET_IS_ONBOARDING, SET_ONBOARDING_PROCESSED, SET_ONBOARDING_PROCESSING } from './types'

export const setOnboardingProcessing = (dispatch) => {
  dispatch({ type: SET_ONBOARDING_PROCESSING })
}

export const setOnboardingProcessed = (dispatch) => {
  dispatch({ type: SET_ONBOARDING_PROCESSED })
}
