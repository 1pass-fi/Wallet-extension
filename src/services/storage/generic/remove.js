import { GENERIC } from 'constants/storageConstants'

import { ChromeStorage } from '../ChromeStorage'

export class GenericRemove {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  pendingRequest() {
    return this.#chrome._removeChrome(GENERIC.PENDING_REQUEST)
  }

  koiBalance() {
    return this.#chrome._removeChrome(GENERIC.KOI_BALANCE)
  }

  selectedCurrency() {
    return this.#chrome._removeChrome(GENERIC.SELECTED_CURRENCY)
  }

  connectedSites() {
    return this.#chrome._removeChrome(GENERIC.CONNECTED_SITE)
  }

  accountName() {
    return this.#chrome._removeChrome(GENERIC.ACCOUNT_NAME)
  }

  affiliateCode() {
    return this.#chrome._removeChrome(GENERIC.AFFILIATE_CODE)
  }

  unlocked() {
    return this.#chrome._removeChrome(GENERIC.UNLOCKED)
  }

  tokenPrice() {
    return this.#chrome._removeChrome(GENERIC.TOKEN_PRICE)
  }
}
