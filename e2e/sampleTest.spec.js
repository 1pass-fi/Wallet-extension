const { bootstrap } = require('./bootstrap')

const sleep = () => {
  return new Promise(resolve => setTimeout(() => resolve(), 1000 ))
}

describe('e2e test', () => {
  let extPage, appPage, browser, optionPage, pageContent

  it('should render finnie', async () => {
    const context = await bootstrap()
    optionPage = context.optionPage
    await optionPage.bringToFront()

    const passwordInput = await optionPage.waitForSelector('#new-password')
  
    // type password
    await optionPage.type('#new-password', 'OpenKoi@123')
    await sleep()

    // type confirm password
    await optionPage.type('input[id="confirm-password"]', 'secret_sauce')
    await sleep()

    // click login button
    let loginButton = await optionPage.waitForSelector('#log-in-button')
    await loginButton.click()
    await sleep()
    let match = (await optionPage.content()).match('Please accept the Terms of Service')
    // expect the error message
    expect(match).not.toBeNull()

    // check tos
    const tosCheckbox = await optionPage.waitForSelector('#new-password-tos')
    await tosCheckbox.click()
    await sleep()

    await loginButton.click()
    // expect error message
    match = (await optionPage.content()).match('Password does not match')
    expect(match).not.toBeNull()
    sleep()


    // correct confirm password
    await optionPage.focus('#confirm-password')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')
    await optionPage.keyboard.press('Backspace')

    await optionPage.keyboard.type('OpenKoi@123')
    sleep()
    match = (await optionPage.content()).match('Password does not match')
    // expect no error message
    expect(match).toBeNull()
    sleep()

    // click login button
    loginButton.click()

  }, 30000)
})
