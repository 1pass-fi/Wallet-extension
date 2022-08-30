import partialAction from 'stories/partialAction'

import RemoveConnectedSites from '.'

RemoveConnectedSites.displayName = 'RemoveConnectedSites'

const sites = [
  'koi.rocks' ,
  'app.uniswap.org' ,
  'opensea.io' ,
  'examplewebsite.io',
  'thisisaprettylongnameeeeeeeeeeeeeeeeeeee.io'
]

export default {
  title: 'screen/RemoveConnectedSites',
  component: RemoveConnectedSites,
  args: {
    sites: sites,
    accountName: 'Account 1',
    handleDeleteSite: partialAction('handleDeleteSite'),
    onClose: partialAction('onClose')
  }
}

const Template = (args) => <RemoveConnectedSites {...args} />

export const Default = Template.bind({})
