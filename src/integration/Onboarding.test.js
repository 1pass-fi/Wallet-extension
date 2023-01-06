import React from 'react'
import { findByText, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Onboarding from 'options/pages/Onboarding/Onboarding'
import { popupBackgroundRequest as request } from 'services/request/popup'
import { renderWithOptionProviders } from 'testUtils/renderWithProviders'

jest.mock('services/account')
jest.mock('utils')
jest.mock('services/request/popup')

const ERROR_MESSAGE = {
  NOT_MATCHING: 'Password does not match',
  NOT_MEET_REQUIREMENT:
    'Secure passwords have at least 8 characters and include uppercase & lowercase letters, numbers, and special characters (e.g. !@#$%).',
  INCORRECT: 'Incorrect password',
  TERM_OF_SERVICE_UNCHECKED: 'Please accept the Terms of Service'
}

const ethSeedPhrase = 'cluster cram fish penalty twelve evoke because wheel close income bag pupil'
const arSeedPhrase =
  'credit erosion kidney deposit buddy pioneer window material embark assist quit still'

function createPassword(onboarding) {
  const password = screen.getByPlaceholderText(/new password/i)
  const confirmPassword = screen.getByPlaceholderText(/confirm password/i)
  const termsService = screen.getByRole('checkbox')
  const continueButton = screen.getByRole('button', { name: /log in/i })

  userEvent.type(password, 'OpenKoi@123')
  userEvent.type(confirmPassword, 'OpenKoi@123')
  userEvent.click(termsService)
  userEvent.click(continueButton)
}

describe('Onboarding flow', () => {
  /* SECURE FINNIE WITH A PASSWORD */
  describe.skip('Step - Secure Finnie with a password', () => {
    describe('Create new password', () => {
      let onboarding, password, confirmPassword, termsService, continueButton

      beforeEach(() => {
        onboarding = renderWithOptionProviders(<Onboarding />)

        password = screen.getByPlaceholderText(/new password/i)
        confirmPassword = screen.getByPlaceholderText(/confirm password/i)
        termsService = screen.getByRole('checkbox')
        continueButton = screen.getByRole('button', { name: /log in/i })
      })

      describe('Passwords do not match', () => {
        it('should display password does not match error message', () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.type(confirmPassword, 'Openkoi@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('Openkoi@123')

          expect(screen.getByText(ERROR_MESSAGE.NOT_MATCHING)).toBeInTheDocument()
        })
      })

      describe('Password does not meet the requirement', () => {
        it('should display password requirement when password contains invalid character', () => {
          userEvent.type(password, 'OpenKoi¥@123')
          userEvent.type(confirmPassword, 'OpenKoi¥@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi¥@123')
          expect(confirmPassword).toHaveValue('OpenKoi¥@123')

          expect(screen.getByText(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain uppercase letter', () => {
          userEvent.type(password, 'openkoi@123')
          userEvent.type(confirmPassword, 'openkoi@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('openkoi@123')
          expect(confirmPassword).toHaveValue('openkoi@123')

          expect(screen.getByText(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain lowercase letter', () => {
          userEvent.type(password, 'OPENKOI@123')
          userEvent.type(confirmPassword, 'OPENKOI@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OPENKOI@123')
          expect(confirmPassword).toHaveValue('OPENKOI@123')

          expect(screen.getByText(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain number character', () => {
          userEvent.type(password, 'OpenKoi@')
          userEvent.type(confirmPassword, 'OpenKoi@')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@')
          expect(confirmPassword).toHaveValue('OpenKoi@')

          expect(screen.getByText(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain special character', () => {
          userEvent.type(password, 'OpenKoi123')
          userEvent.type(confirmPassword, 'OpenKoi123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi123')
          expect(confirmPassword).toHaveValue('OpenKoi123')

          expect(screen.getByText(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)).toBeInTheDocument()
        })

        it('should display password requirement when password length is less than 8 characters', () => {
          userEvent.type(password, 'OpKo@1')
          userEvent.type(confirmPassword, 'OpKo@1')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpKo@1')
          expect(confirmPassword).toHaveValue('OpKo@1')

          expect(screen.getByText(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)).toBeInTheDocument()
        })
      })

      describe('Terms of service is unchecked', () => {
        it('should display error message to force the user check the checkbox', () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.type(confirmPassword, 'OpenKoi@123')
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('OpenKoi@123')

          expect(onboarding.queryByTestId('tos-error-message')).toHaveTextContent(
            ERROR_MESSAGE.TERM_OF_SERVICE_UNCHECKED
          )
        })
      })
      describe('Valid passwords', () => {
        it('should create new password successfully and move to next step', () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.type(confirmPassword, 'OpenKoi@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('OpenKoi@123')

          expect(onboarding.queryByTestId('tos-error-message')).toBeNull()

          expect(onboarding.getByTestId('AddAKey')).toBeInTheDocument()
        })
      })
    })

    describe('Login with password', () => {
      beforeEach(() => {
        request.wallet.verifyPassword.mockImplementation(async () => {
          return true
        })
      })

      describe('Wrong password', () => {
        let onboarding, password, continueButton

        beforeEach(() => {
          request.wallet.verifyPassword.mockImplementation(async () => {
            return false
          })
          onboarding = renderWithOptionProviders(<Onboarding />, {
            initialState: { accounts: ['Account#1'] }
          })

          password = screen.getByPlaceholderText(/password/i)
          continueButton = screen.getByRole('button', { name: /log in/i })
        })

        it('should display incorrect password error', async () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(await screen.findByText(ERROR_MESSAGE.INCORRECT)).toBeInTheDocument()
        })
      })

      describe('Correct password', () => {
        let onboarding, password, continueButton

        beforeEach(() => {
          onboarding = renderWithOptionProviders(<Onboarding />, {
            initialState: { accounts: ['Account#1'] }
          })

          password = screen.getByPlaceholderText(/password/i)
          continueButton = screen.getByRole('button', { name: /log in/i })
        })

        it('should be authenticated and move to next step', async () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(await screen.findByText(/do you already/i)).toBeInTheDocument()
        })
      })
    })
  })

  /* CREATE OR IMPORT A KEY */
  describe('Step - Create or import a key', () => {
    describe('Create a key', () => {
      describe('Create AR key', () => {
        describe('Step - Write down your secret phrase', () => {
          let onboarding

          beforeEach(async () => {
            onboarding = renderWithOptionProviders(<Onboarding />)
            /* Move to test step*/
            // Create new password
            createPassword(onboarding)

            // Get new key
            const getNewKey = screen.getByText(/start from scratch\./i)
            userEvent.click(getNewKey)

            // Choose AR key
            const ARKey = (await screen.findAllByRole('button'))[3]
            userEvent.click(ARKey)

            await screen.findByText(/Save your Secret Phrase/i)
          })

          describe('Step - Save your Secret Phrase - I am Ready', () => {
            beforeEach(async () => {
              const imReady = screen.getByRole('button', { name: /i'm ready!/i })
              userEvent.click(imReady)

              await screen.findByText(/Click the lock below to reveal your secret phrase\./i)
            })
            describe('Step - Reveal secret phrase', () => {
              describe('Before reveal secret phrase', () => {
                it('should hide the secret phrase', () => {
                  const hiddenPhraseIcon = screen.getByRole('img')
                  expect(hiddenPhraseIcon).not.toBeNull()

                  expect(screen.queryByRole('button', { name: /continue/i })).toBeNull()
                })
              })
              describe('After reveal secret phrase', () => {
                it.only('should show the secret phrase correctly', async () => {
                  const hiddenPhraseIcon = screen.getByRole('img')

                  userEvent.click(hiddenPhraseIcon)

                  expect(screen.queryByRole('img')).toBeNull()

                  expect(screen.queryByRole('button', { name: /continue/i })).not.toBeNull()

                  arSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = onboarding.queryByTestId(`hidden-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()
                    expect(currentPhrase.textContent).toBe(phrase)
                  })
                })
              })
            })

            describe('Step - Confirm secret phrase', () => {
              beforeEach(async () => {
                // Move to confirm secret phrase step
                let hiddenPhraseIcon
                hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                userEvent.click(hiddenPhraseIcon)

                hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                await waitFor(() => expect(hiddenPhraseIcon).toBeNull())

                const continueButton = onboarding.container.querySelector('#continue-button')
                userEvent.click(continueButton)

                await waitFor(() =>
                  expect(onboarding.getByTestId('InputPhrase')).toBeInTheDocument()
                )
              })
              describe('Wrong secret phrase', () => {
                it('should display invalid secret phrase error message ', async () => {
                  arSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = onboarding.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, '####')
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  userEvent.click(continueButton)
                  await waitFor(() => {
                    expect(onboarding.queryAllByText('Invalid Secret Phrase')).toHaveLength(1)
                  })
                })
              })
              describe('Correct secret phrase', () => {
                it('should create new wallet successfully and move to last step', async () => {
                  arSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = onboarding.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, phrase)
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  userEvent.click(continueButton)
                  await waitFor(() => {
                    expect(onboarding.getByTestId('RevealPhrase')).toBeInTheDocument()
                  })

                  expect(onboarding.container.querySelector('#go-to-home-button')).toBeNull()
                  expect(onboarding.container.querySelector('#open-faucet-button')).not.toBeNull()
                  expect(
                    onboarding.container.querySelector('#create-nft-page-button')
                  ).not.toBeNull()
                })
              })
            })
          })
          describe('Step - Save your Secret Phrase - Remind me later', () => {
            beforeEach(async () => {
              const remindMeLater = onboarding.queryByTestId(`remind-me-button`)
              userEvent.click(remindMeLater)

              await waitFor(() =>
                expect(onboarding.getByTestId('RevealPhrase')).toBeInTheDocument()
              )
            })
            it('should create new wallet successfully and move to last step', () => {
              expect(onboarding.container.querySelector('#go-to-home-button')).toBeNull()
              expect(onboarding.container.querySelector('#open-faucet-button')).not.toBeNull()
              expect(onboarding.container.querySelector('#create-nft-page-button')).not.toBeNull()
            })
          })
        })
      })

      describe('Create non-AR key', () => {
        describe('Step - Write down your secret phrase', () => {
          let onboarding

          beforeEach(async () => {
            onboarding = renderWithOptionProviders(<Onboarding />)
            /* Move to test step*/
            // Create new password
            createPassword(onboarding)

            // Get new key
            const getNewKey = onboarding.queryByTestId('start-from-scratch-div')
            userEvent.click(getNewKey)
            await waitFor(() => expect(onboarding.getByTestId('GetAKey')).toBeInTheDocument())

            // Choose non-AR key
            const nonARKey = onboarding.queryByTestId('ethereum-key')
            userEvent.click(nonARKey)
            await waitFor(() =>
              expect(onboarding.getByTestId('PrepareSavePhrase')).toBeInTheDocument()
            )
          })
          describe('Step - Save your Secret Phrase - I am Ready', () => {
            beforeEach(async () => {
              const imReady = onboarding.queryByTestId(`ready-button`)
              userEvent.click(imReady)

              await waitFor(() =>
                expect(onboarding.getByTestId('HiddenPhrase')).toBeInTheDocument()
              )
            })
            describe('Step - Reveal secret phrase', () => {
              describe('Before reveal secret phrase', () => {
                it('should hide the secret phrase', () => {
                  const hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                  expect(hiddenPhraseIcon).not.toBeNull()

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  expect(continueButton).toBeNull()
                })
              })
              describe('After reveal secret phrase', () => {
                it('should show the secret phrase correctly', async () => {
                  let hiddenPhraseIcon
                  hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')

                  userEvent.click(hiddenPhraseIcon)

                  hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                  await waitFor(() => expect(hiddenPhraseIcon).toBeNull())

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  expect(continueButton).not.toBeNull()

                  ethSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = onboarding.queryByTestId(`hidden-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()
                    expect(currentPhrase.textContent).toBe(phrase)
                  })
                })
              })
            })

            describe('Step - Confirm secret phrase', () => {
              beforeEach(async () => {
                // Move to confirm secret phrase step
                let hiddenPhraseIcon
                hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                userEvent.click(hiddenPhraseIcon)

                hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                await waitFor(() => expect(hiddenPhraseIcon).toBeNull())

                const continueButton = onboarding.container.querySelector('#continue-button')
                userEvent.click(continueButton)

                await waitFor(() =>
                  expect(onboarding.getByTestId('InputPhrase')).toBeInTheDocument()
                )
              })
              describe('Wrong secret phrase', () => {
                it('should display invalid secret phrase error message ', async () => {
                  ethSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = onboarding.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, '####')
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  userEvent.click(continueButton)
                  await waitFor(() => {
                    expect(onboarding.queryAllByText('Invalid Secret Phrase')).toHaveLength(1)
                  })
                })
              })
              describe('Correct secret phrase', () => {
                it('should create new wallet successfully and move to last step', async () => {
                  ethSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = onboarding.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, phrase)
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  userEvent.click(continueButton)
                  await waitFor(() => {
                    expect(onboarding.getByTestId('RevealPhrase')).toBeInTheDocument()
                  })

                  expect(onboarding.container.querySelector('#go-to-home-button')).not.toBeNull()
                  expect(onboarding.container.querySelector('#open-faucet-button')).toBeNull()
                  expect(onboarding.container.querySelector('#create-nft-page-button')).toBeNull()
                })
              })
            })
          })
          describe('Step - Save your Secret Phrase - Remind me later', () => {
            beforeEach(async () => {
              const remindMeLater = onboarding.queryByTestId('remind-me-button')
              userEvent.click(remindMeLater)

              await waitFor(() =>
                expect(onboarding.getByTestId('RevealPhrase')).toBeInTheDocument()
              )
            })
            it('should create new wallet successfully and move to last step', () => {
              expect(onboarding.container.querySelector('#go-to-home-button')).not.toBeNull()
              expect(onboarding.container.querySelector('#open-faucet-button')).toBeNull()
              expect(onboarding.container.querySelector('#create-nft-page-button')).toBeNull()
            })
          })
        })
      })
    })
    describe('Import a key', () => {
      describe('Import AR key', () => {
        let onboarding

        beforeEach(async () => {
          onboarding = renderWithOptionProviders(<Onboarding />)
          /* Move to test step*/
          // Create new password
          createPassword(onboarding)

          // Get new key
          const getNewKey = onboarding.queryByTestId('use-existing-key-div')
          userEvent.click(getNewKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportAKey')).toBeInTheDocument())

          // Choose non-AR key
          const ARKey = onboarding.queryByTestId('arweave-key')
          userEvent.click(ARKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportPhrase')).toBeInTheDocument())
        })

        describe('Wrong secret phrase', () => {
          it('should block the confirm button when at least one phrase is blank', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              if (index !== 3) {
                userEvent.type(currentPhrase, phrase)
              }

              expect(currentPhrase).toHaveValue(index === 3 ? '' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })
          it('should block the confirm button when one of the phrase is not in bip-39 wordlist', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'abc' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'abc' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })
          it('should display invalid secret phrase when fail to validate mnemonic with bip-39', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'tired' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'tired' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)
            expect(onboarding.queryAllByText('Invalid Secret Phrase')).toHaveLength(1)
          })
        })

        describe('Correct secret phrase', () => {
          it('should successfully import the wallet and move to the last step', async () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, phrase)

              expect(currentPhrase).toHaveValue(phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)

            await waitFor(() => expect(onboarding.getByTestId('RevealPhrase')).toBeInTheDocument())

            expect(onboarding.container.querySelector('#go-to-home-button')).toBeNull()
            expect(onboarding.container.querySelector('#open-faucet-button')).not.toBeNull()
            expect(onboarding.container.querySelector('#create-nft-page-button')).not.toBeNull()
          })
        })
      })

      describe('Import non-AR key', () => {
        let onboarding

        beforeEach(async () => {
          onboarding = renderWithOptionProviders(<Onboarding />)
          /* Move to test step*/
          // Create new password
          createPassword(onboarding)

          // Get new key
          const getNewKey = onboarding.queryByTestId('use-existing-key-div')
          userEvent.click(getNewKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportAKey')).toBeInTheDocument())

          // Choose non-AR key
          const nonARKey = onboarding.queryByTestId('ethereum-key')
          userEvent.click(nonARKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportPhrase')).toBeInTheDocument())
        })

        describe('Wrong secret phrase', () => {
          it('should block the confirm button when at least one phrase is blank', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              if (index !== 3) {
                userEvent.type(currentPhrase, phrase)
              }

              expect(currentPhrase).toHaveValue(index === 3 ? '' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })

          it('should block the confirm button when one of the phrase is not in bip-39 wordlist', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'abc' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'abc' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })

          it('should display invalid secret phrase when fail to validate mnemonic with bip-39', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'tired' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'tired' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)
            expect(onboarding.queryAllByText('Invalid Secret Phrase')).toHaveLength(1)
          })
        })

        describe('Correct secret phrase', () => {
          it('should successfully import the wallet and move to the last step', async () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, phrase)

              expect(currentPhrase).toHaveValue(phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)

            await waitFor(() => expect(onboarding.getByTestId('RevealPhrase')).toBeInTheDocument())

            expect(onboarding.container.querySelector('#go-to-home-button')).not.toBeNull()
            expect(onboarding.container.querySelector('#open-faucet-button')).toBeNull()
            expect(onboarding.container.querySelector('#create-nft-page-button')).toBeNull()
          })
        })
      })
    })
  })
})
