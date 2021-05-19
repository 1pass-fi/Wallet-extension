import React from 'react'

import { storiesOf, addDecorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import StoryRouter from '@tcorley/storybook-react-router'

import { Button, Welcome } from '@storybook/react/demo'
import Popup from '../src/popup/Popup'
import Sidebar from '../src/sidebar/Sidebar'
import Options from '../src/options/Options'
import UnlockScreen from '../src/popup/components/unlockScreen'
import AccountImport from '../src/popup/components/accounts/accountImport'
import InputField from '../src/popup/components/shared/inputField'
import ButtonShared from '../src/popup/components/shared/button'
import ImportByPhrase from '../src/popup/components/accounts/importByPhrase'
import ImportByFile from '../src/popup/components/accounts/importByFile'
import ImportByFileSuccess from '../src/popup/components/accounts/importByFileSuccess'
import ImportByPhraseSuccess from '../src/popup/components/accounts/importByPhraseSuccess'
import PhraseConfirmation from '../src/popup/components/accounts/createWallet/confirmSeed'
import CreatePassword from '../src/popup/components/shared/createPassword'
import WalletInfo from '../src/popup/components/accounts/accountHome/wallet'
import BackupPhrase from '../src/popup/components/accounts/createWallet/revealSeed'

import KoiContext from 'popup/context'

addDecorator(StoryRouter())

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
))

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role='img' aria-label='so cool'>
        😀 😎 👍 💯
      </span>
    </Button>
  ))

storiesOf('Popup', module).add('Default', () => <Popup />)
storiesOf('Sidebar', module).add('Default', () => <Sidebar />)
storiesOf('Options', module).add('Default', () => <Options />)
storiesOf('AccountImport', module).add('Default', () => <AccountImport />)
storiesOf('InputField', module).add('Default', () => (
  <InputField label='password' value={null} onChange={() => { }} />
))
storiesOf('ButtonShared', module).add('Default', () => (
  <ButtonShared label='Click Me' onClick={() => { }} />
))
storiesOf('ImportByPhrase', module).add('Default', () => <ImportByPhrase />)
storiesOf('ImportByFile', module).add('Default', () => <ImportByFile />)
storiesOf('CreatePassword', module).add('Default', () => <CreatePassword />)
storiesOf('WalletInfo', module).add('Default', () => (
  <WalletInfo
    accountAddress='$n-kxQLufYyR4mA5PxU7mtsrCFSIu-W66GTR7nl3fiCc'
    arBalance={100}
    koiBalance={103}
  />
))
storiesOf('ImportByFileSuccess', module).add('Default', () => (
  <div style={{ width: '426px', height: '571px', fontFamily: 'Catamaran' }}>
    <ImportByFileSuccess />
  </div>
))

storiesOf('ImportByPhraseSuccess', module).add('Default', () => (
  <div div div style={{ width: '426px', height: '571px', fontFamily: 'Catamaran' }}>
    <ImportByPhraseSuccess />
  </div >
))

storiesOf('PhraseConfirmation', module).add('Default', () => (
  <KoiContext.Provider
    value={{
      setError: () => { },
    }}
  >
    <div style={{ width: '426px', height: '571px', fontFamily: 'Catamaran' }}>
      <PhraseConfirmation
        seedPhrase={
          'expect leaf canvas flash juice caught weasel recipe stadium door typical series'
        }
      />
    </div>
  </KoiContext.Provider>
))

storiesOf('BackupPhrase', module).add('Default', () => (
  <div style={{ width: '426px', height: '571px', fontFamily: 'Catamaran' }}>
    <BackupPhrase
      seedPhrase={
        'telephone alpaca shampoo website table games bowl exclaim button fleece oatmeal cookbook'
      }
    />
  </div>
))

storiesOf('UnlockScreen', module).add('Default', () => <UnlockScreen />)
