import GlobalButton from '.'
import partialAction from 'stories/partialAction'

GlobalButton.displayName = 'GlobalButton'

export default {
  title: 'component/GlobalButton',
  component: GlobalButton,
  args: {
    type: 'lock',
    onClick: partialAction('clicked')
  }
}

const Template = (args) => <GlobalButton {...args} />

export const Lock = Template.bind({})
export const Send = Template.bind({})
Send.args = {
  type: 'send'
}
