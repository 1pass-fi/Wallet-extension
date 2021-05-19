import UnlockScreen from '.'

UnlockScreen.displayName = 'UnlockScreen'

export default {
  title: 'screen/UnlockScreen',
  component: UnlockScreen,
}

const Template = (args) => <UnlockScreen {...args} />

export const Default = Template.bind({})
