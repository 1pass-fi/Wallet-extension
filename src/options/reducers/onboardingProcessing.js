import { SET_IS_ONBOARDING, SET_ONBOARDING_PROCESSED, SET_ONBOARDING_PROCESSING } from './types'

const initialState = {
  isProcessing: 0,
  isOnboarding: false
}

export default function isOnboardingProcessingReducer(state = initialState, action) {
  const { type } = action

  switch (type) {
    case SET_ONBOARDING_PROCESSING:
      return { ...state, isProcessing: state.isProcessing + 1 }
    case SET_ONBOARDING_PROCESSED:
      return { ...state, isProcessing: !state.isProcessing || state.isProcessing - 1 }
    default:
      return state
  }
}
