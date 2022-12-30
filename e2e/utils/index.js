import isEmpty from 'lodash/isEmpty'

import { TYPE } from '../../src/constants/accountConstants'
import { SECRET_PHRASES } from '../utils/testConstants'

export const createPasswordStep = async (page, newPassword = true) => {
  await page.bringToFront()
  await page.waitForSelector('#new-password')

  // type password
  await page.type('#new-password', 'OpenKoi@123')

  if (newPassword) {
    // type confirm password
    await page.type('input[id="confirm-password"]', 'OpenKoi@123')

    // check tos
    const tosCheckbox = await page.waitForSelector('#new-password-tos')
    await tosCheckbox.click()
  }

  // click login button
  let loginButton = await page.waitForSelector('#log-in-button')
  await loginButton.click()
}

export const importKeyStep = async (page, walletType, secretPhrase) => {
  await page.bringToFront()

  // click Import Key button
  let importKeyButton = await page.waitForSelector('[data-testid="use-existing-key-div"]')
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

  // TODO DatH - expect Confirm button is enabled

  let confirmButton = await page.waitForSelector('#confirm-button')
  await confirmButton.click()

  // TODO DatH - next step
  let goToOptionPageButton
  switch (walletType) {
    case TYPE.ETHEREUM:
      goToOptionPageButton = await page.waitForSelector('#go-to-home-button', 60000)
      break

    case TYPE.SOLANA:
      goToOptionPageButton = await page.waitForSelector('#go-to-home-button', 60000)
      break

    case TYPE.K2:
      goToOptionPageButton = await page.waitForSelector('#go-to-home-button', 60000)
      break

    case TYPE.ARWEAVE:
      goToOptionPageButton = await page.waitForSelector('#skip-to-home-button', 60000)
      break
  }
  await goToOptionPageButton.click()
}

export const createKeyStep = async (page, walletType) => {}

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

  const confirmRemoveAccountButton = await page.waitForSelector(
    `[data-testid="confirm-remove-account-button"]`
  )
  await confirmRemoveAccountButton.click()
}

export const importWallet = async (page, walletType, secretPhrase = '', newPassword = true) => {
  if (newPassword) {
    await createPasswordStep(page, newPassword)
  }

  await importKeyStep(page, walletType, secretPhrase)
}
