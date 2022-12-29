import { TYPE } from '../../src/constants/accountConstants'
import { SECRET_PHRASES } from '../utils/testConstants'

export const createPasswordStep = async (page) => {
  await page.bringToFront()
  await page.waitForSelector('#new-password')

  // type password
  await page.type('#new-password', 'OpenKoi@123')

  // type confirm password
  await page.type('input[id="confirm-password"]', 'OpenKoi@123')

  // check tos
  const tosCheckbox = await page.waitForSelector('#new-password-tos')
  await tosCheckbox.click()

  // click login button
  let loginButton = await page.waitForSelector('#log-in-button')
  await loginButton.click()
}

export const importKeyStep = async (page, walletType) => {
  await page.bringToFront()

  // click Import Key button
  let importKeyButton = await page.waitForSelector('[data-testid="use-existing-key-div"]')
  await importKeyButton.click()
  let keyButton
  let goToOptionPageButton
  switch (walletType) {
    case TYPE.ETHEREUM:
      // click Import ETH Key button
      keyButton = await page.waitForSelector('[data-testid="ethereum-key"]')
      goToOptionPageButton = await page.waitForSelector('#go-to-home-button', 10000000)
      break

    case TYPE.SOLANA:
      // click Import ETH Key button
      keyButton = await page.waitForSelector('[data-testid="solana-key"]')
      goToOptionPageButton = await page.waitForSelector('#go-to-home-button', 10000000)
      break

    case TYPE.K2:
      // click Import ETH Key button
      keyButton = await page.waitForSelector('[data-testid="k2-key"]')
      goToOptionPageButton = await page.waitForSelector('#go-to-home-button', 10000000)
      break

    case TYPE.ARWEAVE:
      // click Import ETH Key button
      keyButton = await page.waitForSelector('[data-testid="arweave-key"]')
      goToOptionPageButton = await page.waitForSelector('#skip-to-home-button', 10000000)
      break
  }

  await keyButton.click()
  for (let i = 0; i < SECRET_PHRASES[walletType].split(' ').length; i++) {
    const secretPhraseField = await page.waitForSelector(`[data-testid="import-phrase-${i}"]`)
    await secretPhraseField.type(SECRET_PHRASES[walletType].split(' ')[i])
  }

  // TODO DatH - expect Confirm button is enabled

  let confirmButton = await page.waitForSelector('#confirm-button')
  await confirmButton.click()

  // TODO DatH - next step
  await goToOptionPageButton.click()
}

export const importWallet = async (page, walletType) => {
  await createPasswordStep(page)
  await importKeyStep(page, walletType)
}
