import partialAction from 'stories/partialAction'

import ConnectedSiteRow from '.'

ConnectedSiteRow.displayName = 'ConnectedSiteRow'

export default {
  title: 'component/ConnectedSiteRow',
  component: ConnectedSiteRow,
  argTypes: {
    isGreyBackground: {
      control: { type: 'boolean' }
    },

  },
  args: {
    isGreyBackground: true,
    site: 'koi.rocks',
    handleDeleteSite: partialAction('handleDelete')
  }
}

const Template = (args) => <ConnectedSiteRow {...args} />

export const White = Template.bind({})
White.args = {
  isGreyBackground: false,
}
export const Grey = Template.bind({})
