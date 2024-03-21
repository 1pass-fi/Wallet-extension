import React from 'react'
import { findByText, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wait } from '@testing-library/user-event/dist/utils'
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
  TERM_OF_SERVICE_UNCHECKED: 'Please accept the Terms of Service',
  INVALID_SECRET_PHRASE: 'Invalid Secret Phrase'
}

const ethSeedPhrase = 'cluster cram fish penalty twelve evoke because wheel close income bag pupil'
const arSeedPhrase =
  'credit erosion kidney deposit buddy pioneer window material embark assist quit still'

function createPassword(onboarding) {
  const password = screen.getByPlaceholderText(/newpassword/i)
  const confirmPassword = screen.getByPlaceholderText(/confirmpassword/i)
  const termsService = screen.getByRole('checkbox')
  const continueButton = screen.getByRole('button', { name: /login/i })

  userEvent.type(password, 'OpenKoi@123')
  userEvent.type(confirmPassword, 'OpenKoi@123')
  userEvent.click(termsService)
  userEvent.click(continueButton)
}

describe('Onboarding flow', () => {
  /* SECURE FINNIE WITH A PASSWORD */
  describe('Step - Secure Finnie with a password', () => {
    describe('Create new password', () => {
      let onboarding, password, confirmPassword, termsService, continueButton

      beforeEach(() => {
        onboarding = renderWithOptionProviders(<Onboarding />)

        password = screen.getByPlaceholderText(/newpassword/i)
        confirmPassword = screen.getByPlaceholderText(/confirmpassword/i)
        termsService = screen.getByRole('checkbox')
        continueButton = screen.getByRole('button', { name: /login/i })
      })

      describe('Passwords do not match', () => {
        it('should display password does not match error message', () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.type(confirmPassword, 'Openkoi@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(confirmPassword).toHaveValue('Openkoi@123')

          expect(screen.getByText(/passwordDoesNotMatch/i)).toBeInTheDocument()
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

          expect(screen.getByText(/securePasswordsHaveAtLeast8Characters/i)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain uppercase letter', () => {
          userEvent.type(password, 'openkoi@123')
          userEvent.type(confirmPassword, 'openkoi@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('openkoi@123')
          expect(confirmPassword).toHaveValue('openkoi@123')

          expect(screen.getByText(/securePasswordsHaveAtLeast8Characters/i)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain lowercase letter', () => {
          userEvent.type(password, 'OPENKOI@123')
          userEvent.type(confirmPassword, 'OPENKOI@123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OPENKOI@123')
          expect(confirmPassword).toHaveValue('OPENKOI@123')

          expect(screen.getByText(/securePasswordsHaveAtLeast8Characters/i)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain number character', () => {
          userEvent.type(password, 'OpenKoi@')
          userEvent.type(confirmPassword, 'OpenKoi@')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@')
          expect(confirmPassword).toHaveValue('OpenKoi@')

          expect(screen.getByText(/securePasswordsHaveAtLeast8Characters/i)).toBeInTheDocument()
        })

        it('should display password requirement when password does not contain special character', () => {
          userEvent.type(password, 'OpenKoi123')
          userEvent.type(confirmPassword, 'OpenKoi123')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi123')
          expect(confirmPassword).toHaveValue('OpenKoi123')

          expect(screen.getByText(/securePasswordsHaveAtLeast8Characters/i)).toBeInTheDocument()
        })

        it('should display password requirement when password length is less than 8 characters', () => {
          userEvent.type(password, 'OpKo@1')
          userEvent.type(confirmPassword, 'OpKo@1')
          userEvent.click(termsService)
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpKo@1')
          expect(confirmPassword).toHaveValue('OpKo@1')

          expect(screen.getByText(/securePasswordsHaveAtLeast8Characters/i)).toBeInTheDocument()
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
            /pleaseAcceptTheTof/i
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
            initialState: { accounts: ['NODE ACCOUNT 1'] }
          })

          password = screen.getByPlaceholderText(/password/i)
          continueButton = screen.getByRole('button', { name: /login/i })
        })

        it('should display incorrect password error', async () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(await screen.findByText(/incorrectPassword/i)).toBeInTheDocument()
        })
      })

      describe('Correct password', () => {
        let onboarding, password, continueButton

        beforeEach(() => {
          onboarding = renderWithOptionProviders(<Onboarding />, {
            initialState: { accounts: ['NODE ACCOUNT 1'] }
          })

          password = screen.getByPlaceholderText(/password/i)
          continueButton = screen.getByRole('button', { name: /login/i })
        })

        it('should be authenticated and move to next step', async () => {
          userEvent.type(password, 'OpenKoi@123')
          userEvent.click(continueButton)

          expect(password).toHaveValue('OpenKoi@123')
          expect(await screen.findByText(/doYouReady/i)).toBeInTheDocument()
        })
      })
    })
  })

  /* CREATE OR IMPORT A KEY */
  // TODO: fix tests
  describe.skip('Step - Create or import a key', () => {
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
            const getNewKey = screen.getAllByText(/startFromScratch/i)[1]
            userEvent.click(getNewKey)

            // Choose AR key
            const ARKey = (await screen.findByTestId('button'))[3]
            userEvent.click(ARKey)

            await screen.findByText(/saveYourSecretPhrase/i)
          })

          describe('Step - Save your Secret Phrase - I am Ready', () => {
            beforeEach(async () => {
              const imReady = screen.getByRole('button', { name: /imReady/i })
              userEvent.click(imReady)

              await screen.findByText(/clickTheLockBelowToRevealYourSecretPhrase/i)
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
                it('should show the secret phrase correctly', async () => {
                  const hiddenPhraseIcon = screen.getByRole('img')

                  userEvent.click(hiddenPhraseIcon)

                  expect(screen.queryByRole('img')).toBeNull()

                  expect(screen.queryByRole('button', { name: /continue/i })).not.toBeNull()

                  arSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = screen.queryByTestId(`hidden-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()
                    expect(currentPhrase.textContent).toBe(phrase)
                  })
                })
              })
            })

            describe('Step - Confirm secret phrase', () => {
              beforeEach(async () => {
                // Move to confirm secret phrase step
                const hiddenPhraseIcon = screen.getByRole('img')
                userEvent.click(hiddenPhraseIcon)

                const continueButton = screen.getByRole('button', { name: /continue/i })
                userEvent.click(continueButton)

                await screen.findByText(/typeInTheMissingWords/i)
              })

              describe('Wrong secret phrase', () => {
                it('should display invalid secret phrase error message ', async () => {
                  arSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = screen.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, '####')
                    }
                  })

                  const confirmButton = screen.getByRole('button', { name: /confirmPhrase/i })
                  userEvent.click(confirmButton)

                  expect(await screen.findAllByText(/invalidSecretPhrase/i)).toHaveLength(1)
                })
              })

              describe('Correct secret phrase', () => {
                it('should create new wallet successfully and move to last step', async () => {
                  arSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = screen.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, phrase)
                    }
                  })

                  const confirmButton = screen.getByRole('button', { name: /confirmPhrase/i })
                  userEvent.click(confirmButton)

                  await screen.findByText(/staySafeMiddle/i)

                  expect(screen.queryByRole('button', { name: /goToHomepage/i })).not.toBeNull()
                  expect(screen.queryByRole('button', { name: /getFreeKOII/i })).toBeNull()
                  expect(screen.queryByRole('button', { name: /createAnNFT/i })).toBeNull()
                })
              })
            })
          })

          describe('Step - Save your Secret Phrase - Remind me later', () => {
            beforeEach(async () => {
              const remindMeLater = screen.getByRole('button', { name: /remindMeLater/i })
              userEvent.click(remindMeLater)

              await screen.findByText(/staySafeMiddle/i)
            })
            it('should create new wallet successfully and move to last step', () => {
              expect(screen.queryByRole('button', { name: /goToHomepage/i })).not.toBeNull()
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
            const getNewKey = screen.getAllByText(/startFromScratch/i)[1]
            userEvent.click(getNewKey)

            // Choose non-AR key
            const nonARKey = (await screen.findAllByRole('button'))[1]
            userEvent.click(nonARKey)

            await screen.findByText(/saveYourSecretPhrase/i)
          })
          describe('Step - Save your Secret Phrase - I am Ready', () => {
            beforeEach(async () => {
              const imReady = screen.getByRole('button', { name: /imReady/i })
              userEvent.click(imReady)

              await screen.findByText(/clickTheLockBelowToRevealYourSecretPhrase/i)
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
                it('should show the secret phrase correctly', async () => {
                  const hiddenPhraseIcon = screen.getByRole('img')

                  userEvent.click(hiddenPhraseIcon)

                  expect(screen.queryByRole('img')).toBeNull()

                  expect(screen.queryByRole('button', { name: /continue/i })).not.toBeNull()

                  ethSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = screen.queryByTestId(`hidden-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()
                    expect(currentPhrase.textContent).toBe(phrase)
                  })
                })
              })
            })

            describe('Step - Confirm secret phrase', () => {
              beforeEach(async () => {
                // Move to confirm secret phrase step
                const hiddenPhraseIcon = screen.getByRole('img')
                userEvent.click(hiddenPhraseIcon)

                const continueButton = screen.getByRole('button', { name: /continue/i })
                userEvent.click(continueButton)

                await screen.findByText(/typeInTheMissingWords/i)
              })

              describe('Wrong secret phrase', () => {
                it('should display invalid secret phrase error message ', async () => {
                  ethSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = screen.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, '####')
                    }
                  })

                  const confirmButton = screen.getByRole('button', { name: /confirmPhrase/i })
                  userEvent.click(confirmButton)

                  expect(await screen.findAllByText(/invalidSecretPhrase/i)).toHaveLength(1)
                })
              })

              describe('Correct secret phrase', () => {
                it('should create new wallet successfully and move to last step', async () => {
                  ethSeedPhrase.split(' ').forEach((phrase, index) => {
                    const currentPhrase = screen.queryByTestId(`input-phrase-${index}`)
                    expect(currentPhrase).not.toBeNull()

                    if (currentPhrase.nodeName === 'INPUT') {
                      userEvent.type(currentPhrase, phrase)
                    }
                  })

                  const confirmButton = screen.getByRole('button', { name: /confirmPhrase/i })
                  userEvent.click(confirmButton)

                  await screen.findByText(/staySafeMiddle/i)

                  expect(screen.queryByRole('button', { name: /goToHomepage/i })).not.toBeNull()
                  expect(screen.queryByRole('button', { name: /getFreeKOII/i })).toBeNull()
                  expect(screen.queryByRole('button', { name: /createAnNFT/i })).toBeNull()
                })
              })
            })
          })

          describe('Step - Save your Secret Phrase - Remind me later', () => {
            beforeEach(async () => {
              const remindMeLater = screen.getByRole('button', {
                name: /remindMeLater/i
              })
              userEvent.click(remindMeLater)

              await screen.findByText(/staySafeMiddle/i)
            })
            it('should create new wallet successfully and move to last step', () => {
              expect(screen.queryByRole('button', { name: /goToHomepage/i })).not.toBeNull()
              expect(screen.queryByRole('button', { name: /getFreeKOII/i })).toBeNull()
              expect(screen.queryByRole('button', { name: /createAnNFT/i })).toBeNull()
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
          const getNewKey = screen.getByText(/useMyExistingKey/i)
          userEvent.click(getNewKey)

          await screen.findByText(/clickCircle/i)

          // Choose AR key
          const ARKey = (await screen.findAllByRole('button'))[3]
          userEvent.click(ARKey)

          await screen.findByText(/typeSecretPhrase/i)
        })

        describe('Wrong secret phrase', () => {
          it('should block the confirm button when at least one phrase is blank', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              if (index !== 3) {
                userEvent.type(currentPhrase, phrase)
              }

              expect(currentPhrase).toHaveValue(index === 3 ? '' : phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).toBeDisabled()
          })

          it('should block the confirm button when one of the phrase is not in bip-39 wordlist', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'abc' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'abc' : phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).toBeDisabled()
          })

          it('should display invalid secret phrase when fail to validate mnemonic with bip-39', () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'tired' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'tired' : phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)
            expect(screen.queryAllByText(/invalidSecretPhrase/i)).toHaveLength(1)
          })
        })

        describe('Correct secret phrase', () => {
          it('should successfully import the wallet and move to the last step', async () => {
            arSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, phrase)

              expect(currentPhrase).toHaveValue(phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)

            await screen.findByText(/staySafeMiddle/i)

            expect(screen.queryByRole('button', { name: /goToHomepage/i })).not.toBeNull()
            expect(screen.queryByRole('button', { name: /getFreeKOII/i })).toBeNull()
            expect(screen.queryByRole('button', { name: /createAnNFT/i })).toBeNull()
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
          const getNewKey = screen.getByText(/useMyExistingKey/i)
          userEvent.click(getNewKey)

          await screen.findByText(/clickCircle/i)

          // Choose non-AR key
          const nonARKey = (await screen.findAllByRole('button'))[1]
          userEvent.click(nonARKey)

          await screen.findByText(/typeSecretPhrase/i)
        })

        describe('Wrong secret phrase', () => {
          it('should block the confirm button when at least one phrase is blank', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              if (index !== 3) {
                userEvent.type(currentPhrase, phrase)
              }

              expect(currentPhrase).toHaveValue(index === 3 ? '' : phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).toBeDisabled()
          })

          it('should block the confirm button when one of the phrase is not in bip-39 wordlist', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'abc' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'abc' : phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).toBeDisabled()
          })

          it('should display invalid secret phrase when fail to validate mnemonic with bip-39', () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, index === 3 ? 'tired' : phrase)

              expect(currentPhrase).toHaveValue(index === 3 ? 'tired' : phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)
            expect(onboarding.queryAllByText(/invalidSecretPhrase/i)).toHaveLength(1)
          })
        })

        describe('Correct secret phrase', () => {
          it('should successfully import the wallet and move to the last step', async () => {
            ethSeedPhrase.split(' ').forEach((phrase, index) => {
              const currentPhrase = screen.queryByTestId(`import-phrase-${index}`)
              expect(currentPhrase).not.toBeNull()

              userEvent.type(currentPhrase, phrase)

              expect(currentPhrase).toHaveValue(phrase)
            })

            const confirmButton = screen.getByRole('button', { name: /confirm/i })
            expect(confirmButton).not.toBeDisabled()

            userEvent.click(confirmButton)

            await screen.findByText(/staySafeMiddle/i)

            expect(screen.queryByRole('button', { name: /goToHomepage/i })).not.toBeNull()
            expect(screen.queryByRole('button', { name: /getFreeKOII/i })).toBeNull()
            expect(screen.queryByRole('button', { name: /createAnNFT/i })).toBeNull()
          })
        })
      })
    })
  })
})
