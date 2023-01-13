import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'

describe('View Ethereum Solana gallery', () => {
  let context, optionPage, browser

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage
    browser = context.browser

    /* Import Ethereum wallet */
    await Automation.importWallet(optionPage, TYPE.SOLANA)
  }, 50000)

  it('should correctly render the gallery with no NFT', async () => {
    await optionPage.bringToFront()

    let optionPageURL

    /* Move to gallery */
    const [galleryNavLink] = await optionPage.$x(`//nav[@role="link"]/a[text()='Gallery']`)
    await galleryNavLink.click()

    optionPageURL = await optionPage.url()

    // expect the correct gallery url
    expect(optionPageURL).toContain('/options.html#/gallery')

    // expect there is no nft in the gallery
    const [nftGallery] = await optionPage.$x(`//div[@role="grid"]`)
    expect(nftGallery).toBeDefined()

    const [blankNft] = await optionPage.$x(`//a[@role="gridcell"]`)
    expect(blankNft).toBeDefined()

    const [createAtomicNFTText] = await blankNft.$x(`//div[text()="Create an Atomic NFT"]`)
    expect(createAtomicNFTText).toBeDefined()

    // move to create nft page
    await blankNft.click()

    // expect the correct create nft url
    optionPageURL = await optionPage.url()
    expect(optionPageURL).toContain('/options.html#/create-nft')

    // expect there is a note for ethereum nft creation
    const [createNFTNote] = await optionPage.$x(
      `//*[contains(text(), "Right now, we can only create NFTs with Arweave. Switch to an Arweave account to get started.")]`
    )
    expect(createNFTNote).toBeDefined()
  }, 50000)

  it('should correctly render the gallery with NFTs', async () => {
    // Switch to Solana devnet
    await Automation.goToWalletSettingPage(optionPage)
    await Automation.swapToNetworkOption(
      optionPage,
      '9cGCJvVacp5V6xjeshprS3KDN3e5VwEUszHmxxaZuHmJ',
      'Devnet'
    )

    await optionPage.bringToFront()

    /* Move to gallery */
    await Automation.goToOptionPageName(optionPage, 'Gallery')

    const [nftGallery] = await optionPage.$x(`//div[@role="grid"]`)
    expect(nftGallery).toBeDefined()

    /* View the NFT Detail */
    const firstNFTCard = await optionPage.waitForXPath(
      `//a[@role="gridcell"][contains(@href, "#/nfts/")]`
    )
    const firstNFTURL = await firstNFTCard.evaluate((el) => el.href)
    const NFTTokenAddress = firstNFTURL.split('/').pop()

    const [NFTCardName] = await firstNFTCard.$x(`//div[@title="nftname"]`)
    expect(NFTCardName).toBeDefined()
    const NFTCardNameValue = await NFTCardName.evaluate((el) => el.textContent)

    const NFTCardLogo = await firstNFTCard.$(`[data-testid="solana-logo"]`)
    expect(NFTCardLogo).not.toBeNull()

    await firstNFTCard.click()

    // expect the information
    const [NFTDetailName] = await optionPage.$x(`//div[@title="nftname"]`)
    expect(NFTDetailName).toBeDefined()
    const NFTDetailNameValue = await NFTCardName.evaluate((el) => el.textContent)
    expect(NFTDetailNameValue).toBe(NFTCardNameValue)

    const NFTDetailLogo = await optionPage.$(`[data-testid="solana-logo"]`)
    expect(NFTDetailLogo).not.toBeNull()

    const [NFTDetailDescription] = await optionPage.$x(`//p[@title="nftdescription"]`)
    expect(NFTDetailDescription).toBeDefined()

    const [exploreBlockButton] = await optionPage.$x(`//button[contains(text(), "Explore Block")]`)
    expect(exploreBlockButton).toBeDefined()

    const [transferNFTButton] = await optionPage.$x(`//button[contains(text(), "Transfer NFT")]`)
    expect(transferNFTButton).toBeDefined()

    // check the NFT on etherscan
    await optionPage.waitForTimeout(3000)
    await exploreBlockButton.click()
    await optionPage.waitForTimeout(5000)
    const currentPages = await browser.pages()
    const solscanPage = currentPages[currentPages.length - 1]
    const solscanPageURL = await solscanPage.url()

    expect(solscanPageURL).toBe(`https://solscan.io/token/${NFTTokenAddress}?cluster=devnet`)
    const [solscanNFTAddress] = await solscanPage.$x(
      `//span[contains(text(), "${NFTTokenAddress}")]`
    )
    expect(solscanNFTAddress).toBeDefined()
  }, 50000)

  it('should successfully transfer Solana NFT', async () => {
    await optionPage.bringToFront()

    const transferNFTButton = await optionPage.$(`//button[contains(text(), "Transfer NFT")]`)

    await transferNFTButton.click()

    const recipientInputField = await optionPage.waitForXPath(
      `input[@name="receiver-address-input"]`
    )
    let [sendNFTButton] = await optionPage.$x(`button[contains(text(), "Send NFT")]`)

    let isDisabled = await sendNFTButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeTruthy()

    // Invalid Solana address
    await recipientInputField.type('...') // TODO
    await sendNFTButton.click()
    const galleryMessage = await optionPage.waitForSelector(`[data-testid="message-gallery"]`)
    const galleryMessageValue = await galleryMessage.evaluate((el) => el.textContent)
    expect(galleryMessageValue).toBe('Invalid Wallet Address')

    // Valid Solana address
    await recipientInputField.click({ clickCount: 3 })
    await recipientInputField.type('') // TODO
    const receiverAddress = await recipientInputField.evaluate((el) => el.value)
    expect(receiverAddress).toBe('') // TODO
    await sendNFTButton.click()

    const confirmReceiverAddress = await optionPage.waitForXPath(
      `//div[@title="receiver-address"][contains(text(), ${receiverAddress})]`
    )
    expect(confirmReceiverAddress).not.toBeNull()

    sendNFTButton = (await optionPage.$x(`button[contains(text(), "Send NFT")]`))[0]
    isDisabled = await sendNFTButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeFalsy()
    await sendNFTButton.click()

    const backToGalleryButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Back To Gallery")]`,
      { visible: true }
    )

    await backToGalleryButton.click()

    // Expect the transfer NFT result
    // When NFT is completely transfered
    const notificationField = await optionPage.waitForSelector(`[title="notification"]`)
    await optionPage.waitForSelector(`[title="new-notification-alert"]`, { visible: true })
    const notificationBell = await notificationField.$x(`//svg[@role="button"]`)
    await notificationBell.click()

    const notifications = await optionPage.$x(`//div[@title="notificationtab"]`)
    expect(notifications.length).toBeGreaterThanOrEqual(1)

    const latestNotification = notifications[0]
    // expect the information of notification
    const lastestNotificationTitle = await latestNotification.$(`[title="notificationtitle"]`)
    const lastestNotificationTitleText = await lastestNotificationTitle.evaluate(
      (el) => el.textContent
    )
    expect(lastestNotificationTitleText).toBe() // TODO

    // expect the information of notification
    const lastestNotificationMeesage = await latestNotification.$(`[title="notificationtitle"]`)
    const lastestNotificationMeesageText = await lastestNotificationTitle.evaluate(
      (el) => el.textContent
    )
    expect(lastestNotificationMeesageText).toBe() // TODO 

    // expect the solscan 
    await latestNotification.click()
    await optionPage.waitForTimeout(5000)
    const currentPages = await browser.pages()
    const solscanPage = currentPages[currentPages.length - 1]
    const solscanPageURL = await solscanPage.url()
  }, 500000)

  afterAll(async () => {
    await context.closePages()
  })
})
