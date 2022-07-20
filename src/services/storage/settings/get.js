import { ChromeStorage } from '../ChromeStorage'
import { SETTING } from 'constants/storageConstants'
import { TYPE } from 'constants/accountConstants'
import { ETH_NETWORK_PROVIDER, SOL_NETWORK_PROVIDER, K2_NETWORK_PROVIDER } from 'constants/koiConstants'

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

  showActivitiesBy() {
    return this.#chrome._getChrome(SETTING.SHOW_ACTIVITIES_BY)
  }

  accountsToShowOnActivities() {
    return this.#chrome._getChrome(SETTING.ACCOUNTS_SHOW_ACTIVITIES)
  }

  activatedArweaveAccountAddress() {
    return this.#chrome._getChrome(SETTING.ACTIVATED_ARWEAVE_ACCOUNT)
  }

  activatedEthereumAccountAddress() {
    return this.#chrome._getChrome(SETTING.ACTIVATED_ETHEREUM_ACCOUNT)
  }

  activatedSolanaAccountAddress() {
    return this.#chrome._getChrome(SETTING.ACTIVATED_SOLANA_ACCOUNT)
  }

  activatedK2AccountAddress() {
    return this.#chrome._getChrome(SETTING.ACTIVATED_K2_ACCOUNT)
  }

  connectSiteAccountAddress() {
    return this.#chrome._getChrome(SETTING.CONNECT_SITE_ACCOUNT)
  }

  async siteAddressDictionary() {
    return (await this.#chrome._getChrome(SETTING.SITE_ADDRESS_DICTIONARY)) || {}
  }

  async assetsTabSettings() {
    return (await this.#chrome._getChrome(SETTING.ASSETS_TAB_SETTINGS)) || {}
  }

  async disabledOrigins() {
    return (await this.#chrome._getChrome(SETTING.DISABLED_ORIGINS)) || []
  }

  async siteConnectedAddresses() {
    return (await this.#chrome._getChrome(SETTING.SITE_CONNECTED_ADDRESSES)) || {}
  }

  async ethereumProvider() {
    return (
      (await this.#chrome._getChrome(SETTING.ETHEREUM_PROVIDER)) || ETH_NETWORK_PROVIDER.MAINNET
    )
  }

  async solanaProvider() {
    return (await this.#chrome._getChrome(SETTING.SOLANA_PROVIDER)) || SOL_NETWORK_PROVIDER.MAINNET
  }

  async k2Provider() {
    return (await this.#chrome._getChrome(SETTING.K2_PROVIDER)) || K2_NETWORK_PROVIDER.TESTNET
  }

  async activatedChain() {
    return (await this.#chrome._getChrome(SETTING.ACTIVATED_CHAIN)) || TYPE.ARWEAVE
  }

  async importedErc20Tokens() {
    return (await this.#chrome._getChrome(SETTING.IMPORTED_ERC20_TOKENS)) || {}
  }

  async importedSolanaCustomTokens() {
    return (await this.#chrome._getChrome(SETTING.IMPORTED_SOLANA_CUSTOM_TOKENS)) || {}
  }
}
