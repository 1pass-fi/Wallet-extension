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

  activatedArweaveAccountAddress(value) {
    return this.#chrome._setChrome(SETTING.ACTIVATED_ARWEAVE_ACCOUNT, value)
  }

  activatedEthereumAccountAddress(value) {
    return this.#chrome._setChrome(SETTING.ACTIVATED_ETHEREUM_ACCOUNT, value)
  }

  activatedSolanaAccountAddress(value) {
    return this.#chrome._setChrome(SETTING.ACTIVATED_SOLANA_ACCOUNT, value)
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

  disabledOrigin(value) {
    return this.#chrome._setChrome(SETTING.DISABLED_ORIGINS, value)
  }

  siteConnectedAddresses(value) {
    return this.#chrome._setChrome(SETTING.SITE_CONNECTED_ADDRESSES, value)
  }

  ethereumProvider(value) {
    return this.#chrome._setChrome(SETTING.ETHEREUM_PROVIDER, value)
  }

  solanaProvider(value) {
    return this.#chrome._setChrome(SETTING.SOLANA_PROVIDER, value)
  }

  activatedChain(value) {
    return this.#chrome._setChrome(SETTING.ACTIVATED_CHAIN, value)
  }

  importedErc20Tokens(value) {
    return this.#chrome._setChrome(SETTING.IMPORTED_ERC20_TOKENS, value)
  }
}
