import WalletInfo from '.'

WalletInfo.displayName = 'WalletInfo'

export default {
  title: 'screen/WalletInfo',
  component: WalletInfo,
  args: {
    accountAddress: '$n-kxQLufYyR4mA5PxU7mtsrCFSIu-W66GTR7nl3fiCc',
    arBalance: 34981,
    koiBalance: 103123123
  }
}

const Template = (args) => <WalletInfo {...args} />

export const Default = Template.bind({})
