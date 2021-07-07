import { BackgroundConnect } from 'utils/backgroundConnect'
import { PORTS } from 'koiConstants'

import { GalleryRequest } from './gallery'
import { AssetRequest } from './assets'
import { ActivityRequest } from './activities'
import { WalletRequest } from './wallet'

class BackgroundRequest {
  constructor(port) {
    this.backgroundConnect = new BackgroundConnect(port)
    this.wallet = new WalletRequest(this.backgroundConnect)
    this.activities = new ActivityRequest(this.backgroundConnect)
    this.assets = new AssetRequest(this.backgroundConnect)
    this.gallery = new GalleryRequest(this.backgroundConnect)
  }
}

export const backgroundRequest = new BackgroundRequest(PORTS.POPUP)
