import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react'
import Onboarding from 'options/pages/Onboarding/Onboarding'
import { popupBackgroundRequest as request } from 'services/request/popup'
import { renderWithOptionProviders } from 'testUtils/renderWithProviders'

jest.mock('services/account')
jest.mock('utils')
jest.mock('services/request/popup')

const PASSWORD_ERROR = {
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
  const password = onboarding.container.querySelector('#new-password')
  const confirmPassword = onboarding.container.querySelector('#confirm-password')
  const termsService = onboarding.container.querySelector('#new-password-tos')
  const continueButton = onboarding.container.querySelector('#log-in-button')

  fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
  fireEvent.change(confirmPassword, { target: { value: 'OpenKoi@123' } })
  fireEvent.click(termsService)
  fireEvent.click(continueButton)
}

describe('Onboarding flow', () => {
  /* SECURE FINNIE WITH A PASSWORD */
  describe('Step - Secure Finnie with a password', () => {
    describe('Create new password', () => {
      let onboarding,
        password,
        confirmPassword,
        termsService,
        errorPassword,
        errorConfirmPassword,
        continueButton

      beforeEach(() => {
        onboarding = renderWithOptionProviders(<Onboarding />)

        password = onboarding.container.querySelector('#new-password')
        confirmPassword = onboarding.container.querySelector('#confirm-password')
        termsService = onboarding.container.querySelector('#new-password-tos')
        errorPassword = onboarding.getByTestId('error-new-password')
        errorConfirmPassword = onboarding.getByTestId('error-confirm-password')
        continueButton = onboarding.container.querySelector('#log-in-button')
      })

      describe('Passwords do not match', () => {
        it('should display password does not match error message', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'Openkoi@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('Openkoi@123')

          expect(errorPassword.textContent).toBe('')
          expect(errorConfirmPassword.textContent).toBe(PASSWORD_ERROR.NOT_MATCHING)
        })
      })
      describe('Password does not meet the requirement', () => {
        it('should display password requirement when password contains invalid character', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi¥@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi¥@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi¥@123')
          expect(confirmPassword).toHaveValue('OpenKoi¥@123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })

        it('should display password requirement when password does not contain uppercase letter', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'openkoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'openkoi@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('openkoi@123')
          expect(confirmPassword).toHaveValue('openkoi@123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })

        it('should display password requirement when password does not contain lowercase letter', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OPENKOI@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OPENKOI@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OPENKOI@123')
          expect(confirmPassword).toHaveValue('OPENKOI@123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })

        it('should display password requirement when password does not contain number character', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi@' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi@' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@')
          expect(confirmPassword).toHaveValue('OpenKoi@')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })
        it('should display password requirement when password does not contain special character', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpenKoi123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi123')
          expect(confirmPassword).toHaveValue('OpenKoi123')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })
        it('should display password requirement when password length is less than 8 characters', () => {
          expect(password).toBeInTheDocument()
          expect(confirmPassword).toBeInTheDocument()
          expect(termsService).toBeInTheDocument()
          expect(continueButton).toBeInTheDocument()

          fireEvent.change(password, { target: { value: 'OpKo@1' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpKo@1' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpKo@1')
          expect(confirmPassword).toHaveValue('OpKo@1')

          expect(errorPassword.textContent).toBe(PASSWORD_ERROR.NOT_MEET_REQUIREMENT)
          expect(errorConfirmPassword.textContent).toBe('')
        })
      })
      describe('Terms of service is unchecked', () => {
        it('should display error message to force the user check the checkbox', () => {
          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('OpenKoi@123')

          expect(onboarding.queryByTestId('tos-error-message')).toHaveTextContent(
            PASSWORD_ERROR.TERM_OF_SERVICE_UNCHECKED
          )
          expect(errorPassword.textContent).toBe('')
          expect(errorConfirmPassword.textContent).toBe('')
        })
      })
      describe('Valid passwords', () => {
        it('should create new password successfully and move to next step', () => {
          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.change(confirmPassword, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(termsService)
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('OpenKoi@123')

          expect(onboarding.queryByTestId('tos-error-message')).toBeNull()

          expect(errorPassword.textContent).toBe('')
          expect(errorConfirmPassword.textContent).toBe('')

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
        let onboarding, password, errorPassword, continueButton

        beforeEach(() => {
          request.wallet.verifyPassword.mockImplementation(async () => {
            return false
          })
          onboarding = renderWithOptionProviders(<Onboarding />, {
            initialState: { accounts: ['Account#1'] }
          })

          password = onboarding.container.querySelector('#new-password')
          errorPassword = onboarding.getByTestId('error-new-password')
          continueButton = onboarding.container.querySelector('#log-in-button')
        })

        it('should display incorrect password error', async () => {
          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          await waitFor(() => expect(errorPassword.textContent).toBe('Incorrect password'))
        })
      })

      describe('Correct password', () => {
        let onboarding, password, errorPassword, continueButton

        beforeEach(() => {
          onboarding = renderWithOptionProviders(<Onboarding />, {
            initialState: { accounts: ['Account#1'] }
          })

          password = onboarding.container.querySelector('#new-password')
          errorPassword = onboarding.getByTestId('error-new-password')
          continueButton = onboarding.container.querySelector('#log-in-button')
        })

        it('should be authenticated and move to next step', async () => {
          fireEvent.change(password, { target: { value: 'OpenKoi@123' } })
          fireEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          await waitFor(() => expect(errorPassword.textContent).toBe(''))
          expect(onboarding.getByTestId('AddAKey')).toBeInTheDocument()
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
            const getNewKey = onboarding.queryByTestId('start-from-scratch-div')
            fireEvent.click(getNewKey)
            await waitFor(() => expect(onboarding.getByTestId('GetAKey')).toBeInTheDocument())

            // Choose AR key
            const ARKey = onboarding.queryByTestId('arweave-key')
            fireEvent.click(ARKey)
            await waitFor(() =>
              expect(onboarding.getByTestId('PrepareSavePhrase')).toBeInTheDocument()
            )
          })

          describe('Step - Save your Secret Phrase - I am Ready', () => {
            beforeEach(async () => {
              const imReady = onboarding.queryByTestId(`ready-button`)
              fireEvent.click(imReady)

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

                  fireEvent.click(hiddenPhraseIcon)

                  hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                  await waitFor(() => expect(hiddenPhraseIcon).toBeNull())

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  expect(continueButton).not.toBeNull()

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
                fireEvent.click(hiddenPhraseIcon)

                hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                await waitFor(() => expect(hiddenPhraseIcon).toBeNull())

                const continueButton = onboarding.container.querySelector('#continue-button')
                fireEvent.click(continueButton)

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
                      fireEvent.change(currentPhrase, { target: { value: '####' } })
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  fireEvent.click(continueButton)
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
                      fireEvent.change(currentPhrase, { target: { value: phrase } })
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  fireEvent.click(continueButton)
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
              fireEvent.click(remindMeLater)

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
            fireEvent.click(getNewKey)
            await waitFor(() => expect(onboarding.getByTestId('GetAKey')).toBeInTheDocument())

            // Choose non-AR key
            const nonARKey = onboarding.queryByTestId('ethereum-key')
            fireEvent.click(nonARKey)
            await waitFor(() =>
              expect(onboarding.getByTestId('PrepareSavePhrase')).toBeInTheDocument()
            )
          })
          describe('Step - Save your Secret Phrase - I am Ready', () => {
            beforeEach(async () => {
              const imReady = onboarding.queryByTestId(`ready-button`)
              fireEvent.click(imReady)

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

                  fireEvent.click(hiddenPhraseIcon)

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
                fireEvent.click(hiddenPhraseIcon)

                hiddenPhraseIcon = onboarding.queryByTestId('blur-phrase-button')
                await waitFor(() => expect(hiddenPhraseIcon).toBeNull())

                const continueButton = onboarding.container.querySelector('#continue-button')
                fireEvent.click(continueButton)

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
                      fireEvent.change(currentPhrase, { target: { value: '####' } })
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  fireEvent.click(continueButton)
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
                      fireEvent.change(currentPhrase, { target: { value: phrase } })
                    }
                  })

                  const continueButton = onboarding.container.querySelector('#continue-button')
                  fireEvent.click(continueButton)
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
              fireEvent.click(remindMeLater)

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
          fireEvent.click(getNewKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportAKey')).toBeInTheDocument())

          // Choose non-AR key
          const ARKey = onboarding.queryByTestId('arweave-key')
          fireEvent.click(ARKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportPhrase')).toBeInTheDocument())
        })

        describe('Wrong secret phrase', () => {
          it('should block the confirm button when at least one phrase is blank', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, { target: { value: index === 3 ? '' : phrase } })

              expect(currentPhrase).toHaveValue(index === 3 ? '' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })
          it('should block the confirm button when one of the phrase is not in bip-39 wordlist', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, { target: { value: index === 3 ? 'abc' : phrase } })

              expect(currentPhrase).toHaveValue(index === 3 ? 'abc' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })
          it('should display invalid secret phrase when fail to validate mnemonic with bip-39', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, { target: { value: index === 3 ? 'tired' : phrase } })

              expect(currentPhrase).toHaveValue(index === 3 ? 'tired' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            fireEvent.click(confirmButton)
            expect(onboarding.queryAllByText('Invalid Secret Phrase')).toHaveLength(1)
          })
        })

        describe('Correct secret phrase', () => {
          it('should successfully import the wallet and move to the last step', async () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, { target: { value: phrase } })

              expect(currentPhrase).toHaveValue(phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            fireEvent.click(confirmButton)

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
          fireEvent.click(getNewKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportAKey')).toBeInTheDocument())

          // Choose non-AR key
          const nonARKey = onboarding.queryByTestId('ethereum-key')
          fireEvent.click(nonARKey)
          await waitFor(() => expect(onboarding.getByTestId('ImportPhrase')).toBeInTheDocument())
        })

        describe('Wrong secret phrase', () => {
          it('should block the confirm button when at least one phrase is blank', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, {
                target: { value: index === 3 ? '' : phrase }
              })

              expect(currentPhrase).toHaveValue(index === 3 ? '' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })
          it('should block the confirm button when one of the phrase is not in bip-39 wordlist', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, {
                target: { value: index === 3 ? 'abc' : phrase }
              })

              expect(currentPhrase).toHaveValue(index === 3 ? 'abc' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).toBeDisabled()
          })
          it('should display invalid secret phrase when fail to validate mnemonic with bip-39', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, {
                target: { value: index === 3 ? 'tired' : phrase }
              })

              expect(currentPhrase).toHaveValue(index === 3 ? 'tired' : phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            fireEvent.click(confirmButton)
            expect(onboarding.queryAllByText('Invalid Secret Phrase')).toHaveLength(1)
          })
        })

        describe('Correct secret phrase', () => {
          it('should successfully import the wallet and move to the last step', async () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = onboarding.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              fireEvent.change(currentPhrase, { target: { value: phrase } })

              expect(currentPhrase).toHaveValue(phrase)
            })

            const confirmButton = onboarding.container.querySelector('#confirm-button')
            expect(confirmButton).not.toBeDisabled()

            fireEvent.click(confirmButton)

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