import { ChromeStorage } from '../ChromeStorage'
import { GENERIC } from '../storageConstants'

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
}