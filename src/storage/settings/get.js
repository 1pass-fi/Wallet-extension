import { ChromeStorage } from '../ChromeStorage'
import { SETTING } from '../storageConstants'

export class SettingGet {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  /**
   * 
   * @returns {String} 3 characters of currency. Example: 'USD'
   */
  selectedCurrency() {
    return this.#chrome._getChrome(SETTING.SELECTED_CURRENCY)
  }
  /**
   * 
   * @returns {Number} 1 or 0
   */
  showWelcomeScreen() {
    return this.#chrome._getChrome(SETTING.SHOW_WELCOME_SCREEN)
  }
  /**
   * 
   * @returns {Boolean} on/off show views on gallery
   */
  showViews() {
    return this.#chrome._getChrome(SETTING.SHOW_VIEWS)
  }
  /**
   * 
   * @returns {Boolean} on/off show earned koi on gallery
   */
  showEarnedKoi() {
    return this.#chrome._getChrome(SETTING.SHOW_EARNED_KOI)
  }
}
