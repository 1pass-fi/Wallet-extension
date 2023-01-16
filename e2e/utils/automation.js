import isEmpty from 'lodash/isEmpty'

import { TYPE } from '../../src/constants/accountConstants'

import { SECRET_PHRASES } from './testConstants'

export const createPasswordStep = async (page, newPassword = true) => {
  await page.bringToFront()

  if (newPassword) {
    await page.waitForSelector(`[placeholder="New Password"]`)
    // type password
    await page.type('input[placeholder="New Password"]', 'OpenKoi@123')
    // type confirm password
    await page.type('input[placeholder="Confirm Password"]', 'OpenKoi@123')

    // check tos
    const tosCheckbox = await page.$(`[role="checkbox"]`)
    await tosCheckbox.click()
  } else {
    await page.waitForSelector(`[placeholder="Password"]`)
    await page.type('input[placeholder="Password"]', 'OpenKoi@123')
  }

  // click login button
  let [loginButton] = await page.$x('//button[contains(text(), "Log In")]')
  await loginButton.click()
}

export const importKeyStep = async (page, walletType, secretPhrase) => {
  await page.bringToFront()

  // click Import Key button
  let importKeyButton = await page.waitForXPath(`//div[contains(text(), "Use my existing key.")]`)
  await importKeyButton.click()
  let keyButton
  switch (walletType) {
    case TYPE.ETHEREUM:
      keyButton = await page.waitForSelector('[data-testid="ethereum-key"]')
      break

    case TYPE.SOLANA:
      keyButton = await page.waitForSelector('[data-testid="solana-key"]')
      break

    case TYPE.K2:
      // click Import ETH Key button
      keyButton = await page.waitForSelector('[data-testid="k2-key"]')
      break

    case TYPE.ARWEAVE:
      // click Import ETH Key button
      keyButton = await page.waitForSelector('[data-testid="arweave-key"]')
      break
  }

  await keyButton.click()
  const secretPhraseArr = !isEmpty(secretPhrase)
    ? secretPhrase.split(' ')
    : SECRET_PHRASES[walletType].split(' ')
  for (let i = 0; i < secretPhraseArr.length; i++) {
    const secretPhraseField = await page.waitForSelector(`[data-testid="import-phrase-${i}"]`)
    await secretPhraseField.type(secretPhraseArr[i])
  }

  let [confirmButton] = await page.$x(`//button[contains(text(), "Confirm")]`)
  await confirmButton.click()

  let goToOptionPageButton
  switch (walletType) {
    case TYPE.ETHEREUM:
      goToOptionPageButton = await page.waitForXPath(
        `//button[contains(text(), "Go to Homepage")]`,
        60000
      )

      break

    case TYPE.SOLANA:
      goToOptionPageButton = await page.waitForXPath(
        `//button[contains(text(), "Go to Homepage")]`,
        80000
      )

      break

    case TYPE.K2:
      goToOptionPageButton = await page.waitForXPath(
        `//button[contains(text(), "Go to Homepage")]`,
        60000
      )

      break

    case TYPE.ARWEAVE:
      goToOptionPageButton = await page.waitForXPath(
        `//button[contains(text(), "Go to Homepage")]`,
        80000
      )

      break
  }
  await goToOptionPageButton.click()
}

export const createKeyStep = async (page, walletType) => {}

export const goToImportWalletPage = async (page) => {
  const profilePictureNavBar = await page.waitForSelector(`[data-testid="profile-picture-navbar"]`)
  await profilePictureNavBar.click()

  const walletSettingButton = await page.waitForSelector(`[data-testid="wallet-dropdown-light"]`)
  await walletSettingButton.click()

  const importButton = await page.waitForSelector(`[data-testid="setting-import-wallet"]`)
  await importButton.click()
}

export const removeKey = async (page, accountAddress) => {
  const profilePictureNavBar = await page.waitForSelector(`[data-testid="profile-picture-navbar"]`)
  await profilePictureNavBar.click()

  const walletSettingButton = await page.waitForSelector(`[data-testid="wallet-dropdown-light"]`)
  await walletSettingButton.click()

  const dropdownButton = await page.waitForSelector(
    `[data-testid="account-card-drop-down-${accountAddress}"]`
  )
  await dropdownButton.click()

  const removeAccountButton = await page.waitForSelector(
    `[data-testid="account-card-remove-account-${accountAddress}"]`
  )
  await removeAccountButton.click()

  const confirmRemoveAccountButton = await page.waitForXPath(
    `//button[contains(text(), "Remove Account")]`
  )
  await confirmRemoveAccountButton.click()
}

export const importWallet = async (page, walletType, secretPhrase = '', newPassword = true) => {
  if (newPassword) {
    await createPasswordStep(page, newPassword)
  } else {
    // From option homepage
    await goToImportWalletPage(page)

    // type password
    await page.waitForSelector(`[placeholder="Password"]`)
    await page.type('input[placeholder="Password"]', 'OpenKoi@123')

    // click login button
    let [loginButton] = await page.$x('//button[contains(text(), "Log In")]')
    await loginButton.click()
  }

  await importKeyStep(page, walletType, secretPhrase)
}

export const swapToNetwork = async (page, networkLabel) => {
  await page.bringToFront()
  const providerDropdown = await page.waitForSelector(`[data-testid="provider-dropdown"]`)
  await providerDropdown.click()

  const providerOption = await page.waitForSelector(`[data-testid="${networkLabel}"]`)
  await providerOption.click()

  await page.waitForNavigation({ waitUntil: 'load' })
}

export const goToWalletSettingPage = async (page) => {
  await page.bringToFront()
  const profilePictureNavBar = await page.waitForSelector(`[data-testid="profile-picture-navbar"]`)
  await profilePictureNavBar.click()

  const walletSettingButton = await page.waitForSelector(`[data-testid="wallet-dropdown-light"]`)
  await walletSettingButton.click()
}

export const swapToNetworkOption = async (page, address, networkLabel) => {
  await page.bringToFront()
  const accountCard = await page.waitForSelector(`[data-testid="account-card-setting-page"]`)
  const extendButton = await accountCard.$(`[data-testid="account-card-drop-down-${address}"]`)

  await extendButton.click()

  const networkDropdown = await accountCard.$(`[role="listbox"]`)
  const toggleDropdownButton = await networkDropdown.$(`[role="button"]`)

  await toggleDropdownButton.click()

  const [networkOption] = await networkDropdown.$x(
    `//button[@role="option"][contains(text(), "${networkLabel}")]`
  )

  await networkOption.click()
  const UPDATE_BALANCE_MESSAGE = 'Your balances have been updated.'
  await page.waitForXPath(
    `//div[@data-testid="message-gallery"][contains(text(), "${UPDATE_BALANCE_MESSAGE}")]`
  )
}

export const goToOptionPageName = async (page, optionPageName) => {
  const [navPageLink] = await page.$x(`//nav[@role="link"]/a[text()='${optionPageName}']`)
  await navPageLink.click()
  // await page.waitForNavigation()
}

export default {
  importWallet,
  swapToNetwork,
  removeKey,
  createPasswordStep,
  goToImportWalletPage,
  swapToNetworkOption,
  goToWalletSettingPage,
  goToOptionPageName
}
