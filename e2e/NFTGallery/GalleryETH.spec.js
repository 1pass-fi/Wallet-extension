import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'

describe('View Ethereum NFT gallery', () => {
  let context, optionPage, browser
  let receiverAddress, senderAddress, NFTContractAddress, NFTTokenID

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage
    browser = context.browser

    /* Import Ethereum wallet */
    await Automation.importWallet(optionPage, TYPE.ETHEREUM)
    senderAddress = '0xb979707D767230Df79840B39703D86F99C6d84D2'
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
  }, 30000)

  it('should correctly render the gallery with NFTs', async () => {
    // Switch to Goerli testnet
    await Automation.goToWalletSettingPage(optionPage)
    await Automation.swapToNetworkOption(
      optionPage,
      '0xb979707D767230Df79840B39703D86F99C6d84D2',
      'Goerli TestNet'
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
    NFTTokenID = firstNFTURL.split('/').pop().split('_')[0]
    NFTContractAddress = firstNFTURL.split('/').pop().split('_')[1]

    const [NFTCardName] = await firstNFTCard.$x(`//div[@title="nftname"]`)
    expect(NFTCardName).toBeDefined()
    const NFTCardNameValue = await NFTCardName.evaluate((el) => el.textContent)

    const NFTCardLogo = await firstNFTCard.$(`[data-testid="ethereum-logo"]`)
    expect(NFTCardLogo).not.toBeNull()

    await firstNFTCard.click()

    // expect the information
    const [NFTDetailName] = await optionPage.$x(`//div[@title="nftname"]`)
    expect(NFTDetailName).toBeDefined()
    const NFTDetailNameValue = await NFTCardName.evaluate((el) => el.textContent)
    expect(NFTDetailNameValue).toBe(NFTCardNameValue)

    const NFTDetailLogo = await optionPage.$(`[data-testid="ethereum-logo"]`)
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
    const etherscanPage = currentPages[currentPages.length - 1]
    const etherscanPageURL = await etherscanPage.url()

    expect(etherscanPageURL).toBe(
      `https://goerli.etherscan.io/token/${NFTContractAddress}?a=${NFTTokenID}`
    )
    const etherscanNFTAddress = await etherscanPage.waitForXPath(
      `//a[contains(text(), "${NFTContractAddress}")]`
    )
    expect(etherscanNFTAddress).toBeDefined()
  }, 30000)

  it('should successfully transfer Ethereum NFT', async () => {
    await optionPage.bringToFront()

    const [transferNFTButton] = await optionPage.$x(`//button[contains(text(), "Transfer NFT")]`)

    await transferNFTButton.click()

    const recipientInputField = await optionPage.waitForXPath(
      `//input[@name="receiver-address-input"]`
    )
    let [sendNFTButton] = await optionPage.$x(`//button[contains(text(), "Send NFT")]`)

    let isDisabled = await sendNFTButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeTruthy()

    // Invalid Solana address
    await recipientInputField.type('0x9850Da0a1A2635625d3696E0474D855484aA09')
    await sendNFTButton.click()
    const galleryMessage = await optionPage.waitForSelector(`[data-testid="message-gallery"]`)
    const galleryMessageValue = await galleryMessage.evaluate((el) => el.textContent)
    expect(galleryMessageValue).toBe('Invalid Wallet Address')

    // Valid Solana address
    await recipientInputField.click({ clickCount: 3 })
    // await recipientInputField.type('0x9850Da0a1A2635625d3696E0474D855484aA0994')
    await recipientInputField.type('0xb979707D767230Df79840B39703D86F99C6d84D2')
    receiverAddress = await recipientInputField.evaluate((el) => el.value)
    // expect(receiverAddress).toBe('0x9850Da0a1A2635625d3696E0474D855484aA0994')
    expect(receiverAddress).toBe('0xb979707D767230Df79840B39703D86F99C6d84D2')
    await sendNFTButton.click()

    const confirmReceiverAddress = await optionPage.waitForXPath(
      `//div[@title="receiver-address"][contains(text(), "${receiverAddress}")]`
    )
    expect(confirmReceiverAddress).not.toBeNull()

    sendNFTButton = (await optionPage.$x(`//button[contains(text(), "Send NFT")]`))[0]
    isDisabled = await sendNFTButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeFalsy()
    await sendNFTButton.click()

    const backToGalleryButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Back To Gallery")]`,
      { visible: true, timeout: 50000 }
    )

    await backToGalleryButton.click()

    // Expect the transfer NFT result
    // When NFT is completely transfered
    const notificationField = await optionPage.waitForSelector(`[title="notification"]`)
    await optionPage.waitForSelector(`[title="new-notification-alert"]`, {
      visible: true,
      timeout: 500000
    })
    const notificationBell = await notificationField.$(`[role="button"]`)
    await notificationBell.click()

    const notifications = await optionPage.$x(`//div[@title="notificationtab"]`)

    // expect the information of notification
    const latestNotification = notifications[0]
    const lastestNotificationTitle = await latestNotification.$(`[title="notificationtitle"]`)
    const lastestNotificationTitleText = await lastestNotificationTitle.evaluate(
      (el) => el.textContent
    )
    expect(lastestNotificationTitleText).toBe('Transaction confirmed')

    // expect the information of notification
    const lastestNotificationMeesage = await latestNotification.$(`[title="notificationmessage"]`)
    const lastestNotificationMeesageText = await lastestNotificationMeesage.evaluate(
      (el) => el.textContent
    )
    expect(lastestNotificationMeesageText).toBe('Sent NFT has been confirmed')

    // expect the solscan
    await latestNotification.click()
    await optionPage.waitForTimeout(5000)
    const currentPages = await browser.pages()
    const etherscanPage = currentPages[currentPages.length - 1]

    const senderAddressLc = senderAddress.toLowerCase()
    const nftContractAddressLc = NFTContractAddress.toLowerCase()

    const etherscanSenderAddress = await etherscanPage.waitForXPath(
      `//a[contains(@href, "address/${senderAddressLc}")]`
    )
    expect(etherscanSenderAddress).toBeDefined()

    const etherscanNFTAddress = await etherscanPage.waitForXPath(
      `//a[contains(@href, "token/${nftContractAddressLc}")]`
    )
    expect(etherscanNFTAddress).toBeDefined()
  }, 1000000)

  afterAll(async () => {
    await context.closePages()
  })
})
