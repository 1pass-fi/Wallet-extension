import SignTx from '.'

SignTx.displayName = 'SignTx'

export default {
  title: 'screen/SignTx',
  component: SignTx,
  args: {
    sourceAccount: {
      title: 'Account #1',
      address: '1234567890123456789012345678901234567890123',
      type: 'koi',
    },
    destinationAccount: {
      address: '9012345678901234567890123456789012312345678',
      type: 'arweave',
    },
  },
}

const Template = (args) => <SignTx {...args} />

export const Default = Template.bind({})
