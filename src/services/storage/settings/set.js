import { SETTING } from 'constants/storageConstants'

import { ChromeStorage } from '../ChromeStorage'

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

  activatedK2AccountAddress(value) {
    return this.#chrome._setChrome(SETTING.ACTIVATED_K2_ACCOUNT, value)
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

  k2Provider(value) {
    return this.#chrome._setChrome(SETTING.K2_PROVIDER, value)
  }

  activatedChain(value) {
    return this.#chrome._setChrome(SETTING.ACTIVATED_CHAIN, value)
  }

  importedErc20Tokens(value) {
    return this.#chrome._setChrome(SETTING.IMPORTED_ERC20_TOKENS, value)
  }

  importedSolanaCustomTokens(value) {
    return this.#chrome._setChrome(SETTING.IMPORTED_SOLANA_CUSTOM_TOKENS, value)
  }

  importedK2CustomTokens(value) {
    return this.#chrome._setChrome(SETTING.IMPORTED_K2_CUSTOM_TOKENS, value)
  }

  overwriteMetamaskSites(value) {
    return this.#chrome._setChrome(SETTING.OVERWRITE_ALTERNATIVES_SITES, value)
  }

  customEvmNetworks(value) {
    return this.#chrome._setChrome(SETTING.CUSTOM_EVM_NETWORKS, value)
  }

  customArweaveNetworks(value) {
    return this.#chrome._setChrome(SETTING.CUSTOM_ARWEAVE_NETWORKS, value)
  }

  customSolanaNetworks(value) {
    return this.#chrome._setChrome(SETTING.CUSTOM_SOLANA_NETWORKS, value)
  }
  
  customK2Networks(value) {
    return this.#chrome._setChrome(SETTING.CUSTOM_K2_NETWORKS, value)
  }

  addedEvmNetworks(value) {
    return this.#chrome._setChrome(SETTING.ADDED_EVM_NETWORKS, value)
  }

  displayedImportedTokens(value) {
    return this.#chrome._setChrome(SETTING.DISPLYED_IMPORTED_TOKEN, value)
  }
}
