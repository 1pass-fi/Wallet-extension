import {
  SET_IS_ONBOARDING,
  SET_ONBOARDING_PATH,
  SET_ONBOARDING_PROCESSED,
  SET_ONBOARDING_PROCESSING
} from 'options/actions/types'

const initialState = {
  isProcessing: 0,
  isOnboarding: false,
  path: ''
}

export default function onboardingReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_IS_ONBOARDING:
      return { ...state, isOnboarding: payload }
    case SET_ONBOARDING_PROCESSING:
      return { ...state, isProcessing: state.isProcessing + 1 }
    case SET_ONBOARDING_PROCESSED:
      return { ...state, isProcessing: !state.isProcessing || state.isProcessing - 1 }
    case SET_ONBOARDING_PATH:
      return { ...state, path: payload }
    default:
      return state
  }
}
