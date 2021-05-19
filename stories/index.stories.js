import React from 'react'

import { storiesOf, addDecorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import StoryRouter from '@tcorley/storybook-react-router'

import { Button, Welcome } from '@storybook/react/demo'
import Popup from '../src/popup/Popup'
import Sidebar from '../src/sidebar/Sidebar'
import Options from '../src/options/Options'
import AccountImport from '../src/popup/accounts/accountImport'
import InputField from '../src/popup/shared/inputField'
import ButtonShared from '../src/popup/shared/button'
import ImportByPhrase from '../src/popup/accounts/importByPhrase/index'
import ImportByFile from '../src/popup/accounts/importByFile/index'
import ImportByFileSuccess from '../src/popup/accounts/importByFileSuccess/index'
import ImportByPhraseSuccess from '../src/popup/accounts/importByPhraseSuccess/index'
import PhraseConfirmation from '../src/popup/accounts/createWallet/confirmSeed/index'
import CreatePassword from '../src/popup/shared/createPassword/index'
import WalletInfo from '../src/popup/accounts/accountHome/wallet/index'
import BackupPhrase from '../src/popup/accounts/createWallet/revealSeed/index'

import KoiContext from 'popup/context'
import SendKoiForm from '../src/popup/accounts/accountHome/sendKoiForm/index'
import SendKoiButton from '../src/popup/accounts/accountHome/sendKoiButton/index'

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
  <InputField label='password' value={null} onChange={() => {}} />
))
storiesOf('ButtonShared', module).add('Default', () => (
  <ButtonShared label='Click Me' onClick={() => {}} />
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
  <div style={{ width: '426px', height: '571px', fontFamily: 'Catamaran' }}>
    <ImportByPhraseSuccess />
  </div>
))

storiesOf('PhraseConfirmation', module).add('Default', () => (
  <KoiContext.Provider
    value={{
      setError: () => {},
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

storiesOf('SendKoiForm', module).add('Default', () => (
  <KoiContext.Provider
    value={{
      setError: () => {},
    }}>
    <div style={{ width: '426px', height: '571px', fontFamily: '\'Catamaran\', sans-serif' }}>
      <SendKoiForm koiBalance={123456.45} rate={5.22} />
    </div>
  </KoiContext.Provider>
))

storiesOf('SendKoiButton', module).add('Default', () => (
  <div style={{ width: '426px', height: '571px', fontFamily: '\'Catamaran\', sans-serif' }}>
    <SendKoiButton />
  </div>
))
