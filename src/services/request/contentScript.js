import { BackgroundConnect } from './src/backgroundConnect'
import { BackgroundRequest } from './src/backgroundRequest'

import { PORTS } from 'constants/koiConstants'

export const contentBackgroundConnect = new BackgroundConnect(PORTS.CONTENT_SCRIPT)
export const contentBackgroundRequest = new BackgroundRequest(contentBackgroundConnect)
