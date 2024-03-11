import { TYPE } from 'constants/accountConstants'
import {
  ETH_NETWORK_PROVIDER,
  K2_NETWORK_PROVIDER,
  SOL_NETWORK_PROVIDER
} from 'constants/koiConstants'
import { SETTING } from 'constants/storageConstants'
import { SHOW_ACTIVITIES_BY } from 'constants/storageConstants'

import { ChromeStorage } from '../ChromeStorage'

export class SettingGet {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  /**
   *
   * @returns {String} 3 characters of currency. Example: 'USD'
   */
  async selectedCurrency() {
    return (await this.#chrome._getChrome(SETTING.SELECTED_CURRENCY)) || 'USD'
  }
  /**
   *
   * @returns {Number} 1 or 0
   */
  async showWelcomeScreen() {
    return (await this.#chrome._getChrome(SETTING.SHOW_WELCOME_SCREEN)) || 1
  }
  /**
   *
   * @returns {Boolean} on/off show views on gallery
   */
  async showViews() {
    return await (this.#chrome._getChrome(SETTING.SHOW_VIEWS)) || true
  }
  /**
   *
   * @returns {Boolean} on/off show earned koi on gallery
   */
  async showEarnedKoi() {
    return (await this.#chrome._getChrome(SETTING.SHOW_EARNED_KOI)) || true
  }

  async showActivitiesBy() {
    return (await this.#chrome._getChrome(SETTING.SHOW_ACTIVITIES_BY)) || SHOW_ACTIVITIES_BY.ALL_ACCOUNTS
  }

  // not use
  async accountsToShowOnActivities() {
    return (await this.#chrome._getChrome(SETTING.ACCOUNTS_SHOW_ACTIVITIES)) || []
  }

  async activatedArweaveAccountAddress() {
    return await this.#chrome._getChrome(SETTING.ACTIVATED_ARWEAVE_ACCOUNT)
  }

  async activatedEthereumAccountAddress() {
    return await this.#chrome._getChrome(SETTING.ACTIVATED_ETHEREUM_ACCOUNT)
  }

  async activatedSolanaAccountAddress() {
    return await this.#chrome._getChrome(SETTING.ACTIVATED_SOLANA_ACCOUNT)
  }

  async activatedK2AccountAddress() {
    return await this.#chrome._getChrome(SETTING.ACTIVATED_K2_ACCOUNT)
  }

  // not use
  async connectSiteAccountAddress() {
    return await this.#chrome._getChrome(SETTING.CONNECT_SITE_ACCOUNT)
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
    return (await this.#chrome._getChrome(SETTING.ACTIVATED_CHAIN)) || TYPE.K2
  }

  async importedErc20Tokens() {
    return (await this.#chrome._getChrome(SETTING.IMPORTED_ERC20_TOKENS)) || {}
  }

  async importedSolanaCustomTokens() {
    return (await this.#chrome._getChrome(SETTING.IMPORTED_SOLANA_CUSTOM_TOKENS)) || {}
  }

  async importedK2CustomTokens() {
    return (await this.#chrome._getChrome(SETTING.IMPORTED_K2_CUSTOM_TOKENS)) || {}
  }

  async overwriteMetamaskSites() {
    return (await this.#chrome._getChrome(SETTING.OVERWRITE_ALTERNATIVES_SITES)) || {}
  }

  async customEvmNetworks() {
    return (await this.#chrome._getChrome(SETTING.CUSTOM_EVM_NETWORKS)) || {}
  }

  async customArweaveNetworks() {
    return (await this.#chrome._getChrome(SETTING.CUSTOM_ARWEAVE_NETWORKS)) || {}
  }

  async customSolanaNetworks() {
    return (await this.#chrome._getChrome(SETTING.CUSTOM_SOLANA_NETWORKS)) || {}
  }

  async customK2Networks() {
    return (await this.#chrome._getChrome(SETTING.CUSTOM_K2_NETWORKS)) || {}
  }

  async addedEvmNetworks() {
    return (await this.#chrome._getChrome(SETTING.ADDED_EVM_NETWORKS)) || []
  }

  async displayedImportedTokens() {
    return (await this.#chrome._getChrome(SETTING.DISPLYED_IMPORTED_TOKEN)) || []
  }
}
