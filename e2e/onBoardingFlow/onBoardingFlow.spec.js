import { bootstrap } from '../bootstrap'

describe('e2e test', () => {
  let context, optionPage

  beforeAll(async () => {
    context = await bootstrap()
    optionPage = context.optionPage
    return true
  })

  it('Create Password page', async () => {
    await optionPage.bringToFront()
    await optionPage.waitForSelector('#new-password')

    /* Accept TOS */
    // type password
    await optionPage.type('#new-password', 'OpenKoi@123')
    await optionPage.waitForTimeout(1000)

    // click login button
    let loginButton = await optionPage.waitForSelector('#log-in-button')
    await loginButton.click()
    await optionPage.waitForTimeout(1000)
    let tosMessage = (await optionPage.content()).match('Please accept the Terms of Service')

    // expect the error message
    expect(tosMessage).not.toBeNull()

    /* Confirm Password */
    // check tos
    const tosCheckbox = await optionPage.waitForSelector('#new-password-tos')
    await tosCheckbox.click()

    await loginButton.click()
    await optionPage.waitForTimeout(1000)

    tosMessage = (await optionPage.content()).match('Please accept the Terms of Service')

    // expect no the TOS message
    expect(tosMessage).toBeNull()
    await optionPage.waitForTimeout(1000)

    // expect error message
    let errorPasswordMessage = (await optionPage.content()).match('Password does not match')
    expect(errorPasswordMessage).not.toBeNull()
    await optionPage.waitForTimeout(1000)

    // type confirm password
    await optionPage.type('input[id="confirm-password"]', 'blah_blah_blah')

    // click login button
    await loginButton.click()
    await optionPage.waitForTimeout(1000)

    errorPasswordMessage = (await optionPage.content()).match('Password does not match')
    // expect error message
    expect(errorPasswordMessage).not.toBeNull()

    /* Create Password successfully */
    const input = await optionPage.$('#confirm-password')
    await input.click({ clickCount: 3 })
    await input.type('OpenKoi@123')

    // click login button
    await loginButton.click()

    // expect go to the step 2 -  Create Key
    const addAKeyPage = await optionPage.waitForSelector('[data-testid="AddAKey"]')
    expect(addAKeyPage).not.toBeNull()

    // click Create Key button
    let createKeyButton = await optionPage.waitForSelector('[data-testid="use-existing-key-div"]')
    await createKeyButton.click()

    // click Create ETH Key button
    let createEthKeyButton = await optionPage.waitForSelector('[data-testid="ethereum-key"]')
    await createEthKeyButton.click()

    await optionPage.waitForTimeout(1000)
  }, 30000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
