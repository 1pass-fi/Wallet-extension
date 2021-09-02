import { BackgroundConnect } from './src/backgroundConnect'
import { BackgroundRequest } from './src/backgroundRequest'

import { PORTS } from 'constants/koiConstants'

export const popupBackgroundConnect = new BackgroundConnect(PORTS.POPUP)
export const popupBackgroundRequest = new BackgroundRequest(popupBackgroundConnect)
