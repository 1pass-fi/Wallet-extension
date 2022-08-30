import { ActivityRequest } from './activities'
import { AssetRequest } from './assets'
import { GalleryRequest } from './gallery'
import { WalletRequest } from './wallet'

export class BackgroundRequest {
  constructor(backgroundConnect) {
    this.backgroundConnect = backgroundConnect
    this.wallet = new WalletRequest(this.backgroundConnect)
    this.activities = new ActivityRequest(this.backgroundConnect)
    this.assets = new AssetRequest(this.backgroundConnect)
    this.gallery = new GalleryRequest(this.backgroundConnect)
  }
}
