import BackupPhrase from '.'

BackupPhrase.displayName = 'BackupPhrase'

export default {
  title: 'screen/BackupPhrase',
  component: BackupPhrase,
  args: {
    seedPhrase: 'telephone alpaca shampoo website table games bowl exclaim button fleece oatmeal cookbook'
  }
}

const Template = (args) => <BackupPhrase {...args} />

export const Default = Template.bind({})
