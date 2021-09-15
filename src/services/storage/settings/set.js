import { ChromeStorage } from '../ChromeStorage'
import { SETTING } from 'constants/storageConstants'

export class SettingSet {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  /**
   * 
   * @param {String} value Selected currency, choosen in setting.
   * @returns 
   */
  selectedCurrency(value) {
    return this.#chrome._setChrome(SETTING.SELECTED_CURRENCY, value)
  }

  /**
   * 
   * @param {Number} 1 or 0
   * @returns 
   */
  showWelcomeScreen(value) {
    return this.#chrome._setChrome(SETTING.SHOW_WELCOME_SCREEN, value)
  }
  /**
   * 
   * @param {Boolean} value on/off show views on gallery
   * @returns 
   */
  showViews(value) {
    return this.#chrome._setChrome(SETTING.SHOW_VIEWS, value)
  }
  /**
   * 
   * @param {Boolean} value on/off show earned koi on gallery
   * @returns 
   */
  showEarnedKoi(value) {
    return this.#chrome._setChrome(SETTING.SHOW_EARNED_KOI, value)
  }

  showActivitiesBy(value) {
    return this.#chrome._setChrome(SETTING.SHOW_ACTIVITIES_BY, value)
  }

  accountsToShowOnActivities(value) {
    return this.#chrome._setChrome(SETTING.ACCOUNTS_SHOW_ACTIVITIES, value)
  }

  activatedAccountAddress(value) {
    return this.#chrome._setChrome(SETTING.ACTIVATED_ACCOUNT, value)
  }

  connectSiteAccountAddress(value) {
    return this.#chrome._setChrome(SETTING.CONNECT_SITE_ACCOUNT, value)
  }

  siteAddressDictionary(value) {
    return this.#chrome._setChrome(SETTING.SITE_ADDRESS_DICTIONARY, value)
  }

  assetsTabSettings(value) {
    return this.#chrome._setChrome(SETTING.ASSETS_TAB_SETTINGS, value)
  }
}
