import AssetRow from '.'

AssetRow.displayName = 'AssetRow'

export default {
  title: 'component/AssetRow',
  component: AssetRow,
  args: {
    isGrey: false,
    isKoiWallet: true,
    name: 'Test Asset Row', 
    isRegistered: true,
    earnedKoi: 1,
  }
}

const Template = (args) => <AssetRow {...args} />

export const Default = Template.bind({})
