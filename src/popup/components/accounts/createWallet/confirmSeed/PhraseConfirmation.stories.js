import PhraseConfirmation from '.'

PhraseConfirmation.displayName = 'PhraseConfirmation'

export default {
  title: 'screen/PhraseConfirmation',
  component: PhraseConfirmation,
  args: {
    seedPhrase:
      'expect leaf canvas flash juice caught weasel recipe stadium leaf typical series',
  },
}

const Template = (args) => <PhraseConfirmation {...args} />

export const Default = Template.bind({})
