import ConnectedSiteRow from '.'

ConnectedSiteRow.displayName = 'ConnectedSiteRow'

export default {
  title: 'component/ConnectedSiteRow',
  component: ConnectedSiteRow,
  args: {
    isGreyBackground: true,
    site: { name: 'koi.rocks' },
  }
}

const Template = (args) => <ConnectedSiteRow {...args} />

export const White = Template.bind({})
White.args = {
  isGreyBackground: false,
}
export const Grey = Template.bind({})

