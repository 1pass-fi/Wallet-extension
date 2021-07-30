import backgroundConnect from 'actions/backgroundConnect'

import { GalleryRequest } from './gallery'
import { AssetRequest } from './assets'
import { ActivityRequest } from './activities'
import { WalletRequest } from './wallet'

class BackgroundRequest {
  constructor(backgroundConnect) {
    this.backgroundConnect = backgroundConnect
    this.wallet = new WalletRequest(this.backgroundConnect)
    this.activities = new ActivityRequest(this.backgroundConnect)
    this.assets = new AssetRequest(this.backgroundConnect)
    this.gallery = new GalleryRequest(this.backgroundConnect)
  }
}

export const backgroundRequest = new BackgroundRequest(backgroundConnect)
