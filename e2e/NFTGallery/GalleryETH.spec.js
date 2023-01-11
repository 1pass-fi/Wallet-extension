import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'

describe('View Ethereum NFT gallery', () => {
  let context, optionPage, extPage, browser

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage
    browser = context.browser

    /* Import Ethereum wallet */
    await Automation.importWallet(optionPage, TYPE.ETHEREUM)
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
      '0x66083923D61D765f5FC51a612f17d64564358716',
      'Goerli TestNet'
    )

    await optionPage.bringToFront()

    /* Move to gallery */
    await Automation.goToOptionPageName(optionPage, 'Gallery')

    const [nftGallery] = await optionPage.$x(`//div[@role="grid"]`)
    expect(nftGallery).toBeDefined()

    /* View the NFT Detail */
    const firstNFTCard = await optionPage.waitForXPath(`//a[@role="gridcell"][contains(@href, "#/nfts/")]`)
    const firstNFTURL = await firstNFTCard.evaluate((el) => el.href)
    const [NFTTokenID, NFTContractAddress] = firstNFTURL.split('/').pop().split('_')

    const [NFTCardName] = await firstNFTCard.$x(`//div[@title="nftname"]`)
    expect(NFTCardName).toBeDefined()
    const NFTCardNameValue = await NFTCardName.evaluate((el) => el.textContent)

    await firstNFTCard.click()

    // expect the information
    const [NFTDetailName] = await optionPage.$x(`//div[@title="nftname"]`)
    expect(NFTDetailName).toBeDefined()
    const NFTDetailNameValue = await NFTCardName.evaluate((el) => el.textContent)
    expect(NFTDetailNameValue).toBe(NFTCardNameValue)

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
    const [etherscanNFTAddress] = await etherscanPage.$x(
      `//a[contains(text(), "${NFTContractAddress}")]`
    )
    expect(etherscanNFTAddress).toBeDefined()
  }, 30000)

  afterAll(async () => {
    await context.closePages()
  })
})
