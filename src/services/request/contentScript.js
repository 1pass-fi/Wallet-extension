import { PORTS } from 'constants/koiConstants'

import { BackgroundConnect } from './src/backgroundConnect'
import { BackgroundRequest } from './src/backgroundRequest'

export const contentBackgroundConnect = new BackgroundConnect(PORTS.CONTENT_SCRIPT)
export const contentBackgroundRequest = new BackgroundRequest(contentBackgroundConnect)
