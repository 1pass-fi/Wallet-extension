import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Button, Welcome } from '@storybook/react/demo'
import Popup from '../src/popup/Popup'
import Sidebar from '../src/sidebar/Sidebar'
import Options from '../src/options/Options'
import AccountImport from '../src/popup/accounts/accountImport'
import InputField from '../src/popup/shared/inputField'
import ButtonShared from '../src/popup/shared/button'
import ImportByPhrase from '../src/popup/accounts/importByPhrase/index'
import ImportByFile from '../src/popup/accounts/importByFile/index'
import CreatePassword from '../src/popup/shared/createPassword/index'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
                😀 😎 👍 💯
      </span>
    </Button>
  ))

storiesOf('Popup', module).add('Default', () => <Popup />)
storiesOf('Sidebar', module).add('Default', () => <Sidebar />)
storiesOf('Options', module).add('Default', () => <Options />)
storiesOf('AccountImport', module).add('Default', () => <AccountImport />)
storiesOf('InputField', module).add('Default', () => <InputField label="password" value={null} onChange={() => { }} />)
storiesOf('ButtonShared', module).add('Default', () => <ButtonShared label="Click Me" onClick={() => { }} />)
storiesOf('ImportByPhrase', module).add('Default', () => <ImportByPhrase />)
storiesOf('ImportByFile', module).add('Default', () => <ImportByFile />)
storiesOf('CreatePassword', module).add('Default', () => <CreatePassword />)
