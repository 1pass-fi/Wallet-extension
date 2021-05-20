import WalletInfo from '.'

WalletInfo.displayName = 'WalletInfo'

export default {
  title: 'component/WalletInfo',
  component: WalletInfo,
  args: {
    accountAddress: '$n-kxQLufYyR4mA5PxU7mtsrCFSIu-W66GTR7nl3fiCc',
    arBalance: 100,
    koiBalance: 103
  }
}

const Template = (args) => <WalletInfo {...args} />

export const Default = Template.bind({})
