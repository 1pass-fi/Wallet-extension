import { SETTING } from 'constants/storageConstants'

import { ChromeStorage } from '../ChromeStorage'

export class SettingRemove {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  selectedCurrency() {
    return this.#chrome._removeChrome(SETTING.SELECTED_CURRENCY)
  }

  showWelcomeScreen() {
    return this.#chrome._removeChrome(SETTING.SHOW_WELCOME_SCREEN)
  }

  showViews() {
    return this.#chrome._removeChrome(SETTING.SHOW_VIEWS)
  }

  showEarnedKoi() {
    return this.#chrome._removeChrome(SETTING.SHOW_EARNED_KOI)
  }
}
