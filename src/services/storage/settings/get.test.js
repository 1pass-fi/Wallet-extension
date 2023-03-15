import { TYPE } from 'constants/accountConstants'
import { ETH_NETWORK_PROVIDER, K2_NETWORK_PROVIDER, SOL_NETWORK_PROVIDER } from 'constants/koiConstants'
import { SETTING } from 'constants/storageConstants'
import { SHOW_ACTIVITIES_BY } from 'constants/storageConstants'

import { SettingGet } from './get'

const SELECTED_CURRENCY_VALUE = 'SELECTED_CURRENCY_VALUE'
const SHOW_WELCOME_SCREEN_VALUE = 'SHOW_WELCOME_SCREEN_VALUE'
const SHOW_VIEWS_VALUE = 'SHOW_VIEWS_VALUE'
const SHOW_EARNED_KOI_VALUE = 'SHOW_EARNED_KOI_VALUE'
const SHOW_ACTIVITIES_BY_VALUE = 'SHOW_ACTIVITIES_BY_VALUE'
const ACTIVATED_ARWEAVE_ACCOUNT_VALUE = 'ACTIVATED_ARWEAVE_ACCOUNT_VALUE'
const ACTIVATED_ETHEREUM_ACCOUNT_VALUE = 'ACTIVATED_ETHEREUM_ACCOUNT_VALUE'
const ACTIVATED_SOLANA_ACCOUNT_VALUE = 'ACTIVATED_SOLANA_ACCOUNT_VALUE'
const ACTIVATED_K2_ACCOUNT_VALUE = 'ACTIVATED_K2_ACCOUNT_VALUE'
const SITE_ADDRESS_DICTIONARY_VALUE = 'SITE_ADDRESS_DICTIONARY_VALUE'
const ASSETS_TAB_SETTINGS_VALUE = 'ASSETS_TAB_SETTINGS_VALUE'
const DISABLED_ORIGINS_VALUE = 'DISABLED_ORIGINS_VALUE'
const SITE_CONNECTED_ADDRESSES_VALUE = 'SITE_CONNECTED_ADDRESSES_VALUE'
const ETHEREUM_PROVIDER_VALUE = 'ETHEREUM_PROVIDER_VALUE'
const SOLANA_PROVIDER_VALUE = 'SOLANA_PROVIDER_VALUE'
const K2_PROVIDER_VALUE = 'K2_PROVIDER_VALUE'
const ACTIVATED_CHAIN_VALUE = 'ACTIVATED_CHAIN_VALUE'
const IMPORTED_ERC20_TOKENS_VALUE = 'IMPORTED_ERC20_TOKENS_VALUE'
const IMPORTED_SOLANA_CUSTOM_TOKENS_VALUE = 'IMPORTED_SOLANA_CUSTOM_TOKENS_VALUE'
const IMPORTED_K2_CUSTOM_TOKENS_VALUE = 'IMPORTED_K2_CUSTOM_TOKENS_VALUE'

const setChromeStorage = (obj) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(obj, () => {
      resolve()
    })
  })
}

const removeChromeStorage = (key) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.remove(key, () => {
      resolve()
    })
  })
}

describe('SettingGet class', () => {
  let settingGet

  beforeAll(async () => {
    await setChromeStorage({ [SETTING.SELECTED_CURRENCY]: SELECTED_CURRENCY_VALUE })
    await setChromeStorage({ [SETTING.SHOW_WELCOME_SCREEN]: SHOW_WELCOME_SCREEN_VALUE })
    await setChromeStorage({ [SETTING.SHOW_VIEWS]: SHOW_VIEWS_VALUE })
    await setChromeStorage({ [SETTING.SHOW_EARNED_KOI]: SHOW_EARNED_KOI_VALUE })
    await setChromeStorage({ [SETTING.SHOW_ACTIVITIES_BY]: SHOW_ACTIVITIES_BY_VALUE })
    await setChromeStorage({ [SETTING.ACTIVATED_ARWEAVE_ACCOUNT]: ACTIVATED_ARWEAVE_ACCOUNT_VALUE })
    await setChromeStorage({ [SETTING.ACTIVATED_ETHEREUM_ACCOUNT]: ACTIVATED_ETHEREUM_ACCOUNT_VALUE })
    await setChromeStorage({ [SETTING.ACTIVATED_SOLANA_ACCOUNT]: ACTIVATED_SOLANA_ACCOUNT_VALUE })
    await setChromeStorage({ [SETTING.ACTIVATED_K2_ACCOUNT]: ACTIVATED_K2_ACCOUNT_VALUE })
    await setChromeStorage({ [SETTING.SITE_ADDRESS_DICTIONARY]: SITE_ADDRESS_DICTIONARY_VALUE })
    await setChromeStorage({ [SETTING.ASSETS_TAB_SETTINGS]: ASSETS_TAB_SETTINGS_VALUE })
    await setChromeStorage({ [SETTING.DISABLED_ORIGINS]: DISABLED_ORIGINS_VALUE })
    await setChromeStorage({ [SETTING.SITE_CONNECTED_ADDRESSES]: SITE_CONNECTED_ADDRESSES_VALUE })
    await setChromeStorage({ [SETTING.ETHEREUM_PROVIDER]: ETHEREUM_PROVIDER_VALUE })
    await setChromeStorage({ [SETTING.SOLANA_PROVIDER]: SOLANA_PROVIDER_VALUE })
    await setChromeStorage({ [SETTING.K2_PROVIDER]: K2_PROVIDER_VALUE })
    await setChromeStorage({ [SETTING.ACTIVATED_CHAIN]: ACTIVATED_CHAIN_VALUE })
    await setChromeStorage({ [SETTING.IMPORTED_ERC20_TOKENS]: IMPORTED_ERC20_TOKENS_VALUE })
    await setChromeStorage({ [SETTING.IMPORTED_SOLANA_CUSTOM_TOKENS]: IMPORTED_SOLANA_CUSTOM_TOKENS_VALUE })
    await setChromeStorage({ [SETTING.IMPORTED_K2_CUSTOM_TOKENS]: IMPORTED_K2_CUSTOM_TOKENS_VALUE })
    
    settingGet = new SettingGet()
  })

  beforeEach(() => {

  })

  describe('selectedCurrency()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.selectedCurrency()
      expect(result).toEqual(SELECTED_CURRENCY_VALUE)
    })

    it('returns default value (USD) when not found', async () => {
      await removeChromeStorage(SETTING.SELECTED_CURRENCY)
      const result = await settingGet.selectedCurrency()

      expect(result).toEqual('USD')
    })
  })

  describe('showWelcomeScreen()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.showWelcomeScreen()
      expect(result).toEqual(SHOW_WELCOME_SCREEN_VALUE)
    })

    it('returns default value (1) when not found', async () => {
      await removeChromeStorage(SETTING.SHOW_WELCOME_SCREEN)
      const result = await settingGet.showWelcomeScreen()

      expect(result).toEqual(1)
    })
  })

  describe('showViews()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.showViews()
      expect(result).toEqual(SHOW_VIEWS_VALUE)
    })

    it('returns default value (true) when not found', async () => {
      await removeChromeStorage(SETTING.SHOW_VIEWS)
      const result = await settingGet.showViews()

      expect(result).toEqual(true)
    })
  })

  describe('showEarnedKoi()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.showEarnedKoi()
      expect(result).toEqual(SHOW_EARNED_KOI_VALUE)
    })

    it('returns default value (true) when not found', async () => {
      await removeChromeStorage(SETTING.SHOW_EARNED_KOI)
      const result = await settingGet.showEarnedKoi()

      expect(result).toEqual(true)
    })
  })

  describe('showActivitiesBy()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.showActivitiesBy()
      expect(result).toEqual(SHOW_ACTIVITIES_BY_VALUE)
    })

    it('returns default value when not found', async () => {
      await removeChromeStorage(SETTING.SHOW_ACTIVITIES_BY)
      const result = await settingGet.showActivitiesBy()

      expect(result).toEqual(SHOW_ACTIVITIES_BY.ALL_ACCOUNTS)
    })
  })

  describe('activatedArweaveAccountAddress()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.activatedArweaveAccountAddress()
      expect(result).toEqual(ACTIVATED_ARWEAVE_ACCOUNT_VALUE)
    })

    it('returns default value (null) when not found', async () => {
      await removeChromeStorage(SETTING.ACTIVATED_ARWEAVE_ACCOUNT)
      const result = await settingGet.activatedArweaveAccountAddress()

      expect(result).toBeNull()
    })
  })

  describe('activatedEthereumAccountAddress()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.activatedEthereumAccountAddress()
      expect(result).toEqual(ACTIVATED_ETHEREUM_ACCOUNT_VALUE)
    })

    it('returns default value (null) when not found', async () => {
      await removeChromeStorage(SETTING.ACTIVATED_ETHEREUM_ACCOUNT)
      const result = await settingGet.activatedEthereumAccountAddress()

      expect(result).toBeNull()
    })
  })

  describe('activatedSolanaAccountAddress()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.activatedSolanaAccountAddress()
      expect(result).toEqual(ACTIVATED_SOLANA_ACCOUNT_VALUE)
    })

    it('returns default value (null) when not found', async () => {
      await removeChromeStorage(SETTING.ACTIVATED_SOLANA_ACCOUNT)
      const result = await settingGet.activatedSolanaAccountAddress()

      expect(result).toBeNull()
    })
  })

  describe('activatedK2AccountAddress()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.activatedK2AccountAddress()
      expect(result).toEqual(ACTIVATED_K2_ACCOUNT_VALUE)
    })

    it('returns default value (null) when not found', async () => {
      await removeChromeStorage(SETTING.ACTIVATED_K2_ACCOUNT)
      const result = await settingGet.activatedK2AccountAddress()

      expect(result).toBeNull()
    })
  })
  
  describe('siteAddressDictionary()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.siteAddressDictionary()
      expect(result).toEqual(SITE_ADDRESS_DICTIONARY_VALUE)
    })

    it('returns default value ({}) when not found', async () => {
      await removeChromeStorage(SETTING.SITE_ADDRESS_DICTIONARY)
      const result = await settingGet.siteAddressDictionary()

      expect(result).toEqual({})
    })
  })
  
  describe('assetsTabSettings()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.assetsTabSettings()
      expect(result).toEqual(ASSETS_TAB_SETTINGS_VALUE)
    })

    it('returns default value ({}) when not found', async () => {
      await removeChromeStorage(SETTING.ASSETS_TAB_SETTINGS)
      const result = await settingGet.assetsTabSettings()

      expect(result).toEqual({})
    })
  })

  describe('disabledOrigins()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.disabledOrigins()
      expect(result).toEqual(DISABLED_ORIGINS_VALUE)
    })

    it('returns default value ([]) when not found', async () => {
      await removeChromeStorage(SETTING.DISABLED_ORIGINS)
      const result = await settingGet.disabledOrigins()

      expect(result).toEqual([])
    })
  })

  describe('siteConnectedAddresses()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.siteConnectedAddresses()
      expect(result).toEqual(SITE_CONNECTED_ADDRESSES_VALUE)
    })

    it('returns default value ({}) when not found', async () => {
      await removeChromeStorage(SETTING.SITE_CONNECTED_ADDRESSES)
      const result = await settingGet.siteConnectedAddresses()

      expect(result).toEqual({})
    })
  })

  describe('ethereumProvider()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.ethereumProvider()
      expect(result).toEqual(ETHEREUM_PROVIDER_VALUE)
    })

    it('returns default value (mainnet) when not found', async () => {
      await removeChromeStorage(SETTING.ETHEREUM_PROVIDER)
      const result = await settingGet.ethereumProvider()

      expect(result).toEqual(ETH_NETWORK_PROVIDER.MAINNET)
    })
  })

  describe('solanaProvider()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.solanaProvider()
      expect(result).toEqual(SOLANA_PROVIDER_VALUE)
    })

    it('returns default value (mainnet) when not found', async () => {
      await removeChromeStorage(SETTING.SOLANA_PROVIDER)
      const result = await settingGet.solanaProvider()

      expect(result).toEqual(SOL_NETWORK_PROVIDER.MAINNET)
    })
  })

  describe('k2Provider()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.k2Provider()
      expect(result).toEqual(K2_PROVIDER_VALUE)
    })

    it('returns default value (testnet) when not found', async () => {
      await removeChromeStorage(SETTING.K2_PROVIDER)
      const result = await settingGet.k2Provider()

      expect(result).toEqual(K2_NETWORK_PROVIDER.TESTNET)
    })
  })

  describe('activatedChain()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.activatedChain()
      expect(result).toEqual(ACTIVATED_CHAIN_VALUE)
    })

    it('returns default value (k2) when not found', async () => {
      await removeChromeStorage(SETTING.ACTIVATED_CHAIN)
      const result = await settingGet.activatedChain()

      expect(result).toEqual(TYPE.K2)
    })
  })

  describe('importedErc20Tokens()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.importedErc20Tokens()
      expect(result).toEqual(IMPORTED_ERC20_TOKENS_VALUE)
    })

    it('returns default value ({}) when not found', async () => {
      await removeChromeStorage(SETTING.IMPORTED_ERC20_TOKENS)
      const result = await settingGet.importedErc20Tokens()

      expect(result).toEqual({})
    })
  })

  describe('importedSolanaCustomTokens()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.importedSolanaCustomTokens()
      expect(result).toEqual(IMPORTED_SOLANA_CUSTOM_TOKENS_VALUE)
    })

    it('returns default value ({}) when not found', async () => {
      await removeChromeStorage(SETTING.IMPORTED_SOLANA_CUSTOM_TOKENS)
      const result = await settingGet.importedSolanaCustomTokens()

      expect(result).toEqual({})
    })
  })

  describe('importedK2CustomTokens()', () => {
    it ('gets correct value', async () => {
      const result = await settingGet.importedK2CustomTokens()
      expect(result).toEqual(IMPORTED_K2_CUSTOM_TOKENS_VALUE)
    })

    it('returns default value ({}) when not found', async () => {
      await removeChromeStorage(SETTING.IMPORTED_K2_CUSTOM_TOKENS)
      const result = await settingGet.importedK2CustomTokens()

      expect(result).toEqual({})
    })
  })
})
