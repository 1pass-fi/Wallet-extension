import { SET_IS_ONBOARDING, SET_ONBOARDING_PROCESSED, SET_ONBOARDING_PROCESSING } from './types'

export const setIsOnboarding = (payload) => (dispatch) => {
  dispatch({ type: SET_IS_ONBOARDING, payload })
}

export const setOnboardingProcessing = (dispatch) => {
  dispatch({ type: SET_ONBOARDING_PROCESSING })
}

export const setOnboardingProcessed = (dispatch) => {
  dispatch({ type: SET_ONBOARDING_PROCESSED })
}
