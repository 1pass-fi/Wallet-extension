import RemoveConnectedSites from '.'

RemoveConnectedSites.displayName = 'RemoveConnectedSites'

const sites = [
  { name: 'koi.rocks' },
  { name: 'app.uniswap.org' },
  { name: 'opensea.io' },
  { name: 'examplewebsite.io'},
  { name: 'thisisaprettylongnameeeeeeeeeeeeeeeeeeee.io'}
]

export default {
  title: 'screen/RemoveConnectedSites',
  component: RemoveConnectedSites,
  args: {
    sites: sites,
    accountName: 'Account 1',
  }
}

const Template = (args) => <RemoveConnectedSites {...args} />

export const Default = Template.bind({})
