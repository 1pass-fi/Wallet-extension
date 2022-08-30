import { PORTS } from 'constants/koiConstants'

import { BackgroundConnect } from './src/backgroundConnect'
import { BackgroundRequest } from './src/backgroundRequest'

export const popupBackgroundConnect = new BackgroundConnect(PORTS.POPUP)
export const popupBackgroundRequest = new BackgroundRequest(popupBackgroundConnect)
