import { CLEAR_ACTIVITIES,SET_ACTIVITIES } from './types'

export const setActivities = (payload) => ({ type: SET_ACTIVITIES, payload })

export const clearActivities = () => ({ type: CLEAR_ACTIVITIES })
