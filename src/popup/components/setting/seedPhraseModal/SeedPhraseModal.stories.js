import SeedPhraseModal from '.'

SeedPhraseModal.displayName = 'SeedPhraseModal'

export default {
  title: 'screen/SeedPhraseModal',
  component: SeedPhraseModal,
  args: {
    seedPhrase:
      'telephone alpaca shampoo website table games bowl exclaim button fleece oatmeal cookbook',
  },
}

const Template = (args) => <SeedPhraseModal {...args} />

export const Default = Template.bind({})
