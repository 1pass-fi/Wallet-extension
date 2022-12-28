import { bootstrap } from '../bootstrap'

describe('e2e test', () => {
  let context, optionPage

  beforeAll(async () => {
    context = await bootstrap()
    optionPage = await context.launchOptionPage()
    return true
  })

  it('should render Finnie', async () => {
    await optionPage.bringToFront()
    await optionPage.waitForTimeout(1000)

    const createPassword = await optionPage.waitForXPath(
      '//*[contains(text(), "Create a password")]',
      3000
    )
    expect(createPassword).not.toBeNull()
  }, 10000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
