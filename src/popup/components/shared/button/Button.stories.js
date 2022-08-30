import partialAction from 'stories/partialAction'

import Button from '.'

Button.displayName = 'Button'

export default {
  title: 'component/Button',
  component: Button,
  args: {
    label: 'Button Label',
    isEnable: true,
    className: 'zzz',
    type: '',
    onClick: partialAction('clicked')
  },
}

const Template = (args) => <Button {...args} />

export const Filled = Template.bind({})
export const Custom = Template.bind({})
Custom.args = {
  type: 'custom'
}
