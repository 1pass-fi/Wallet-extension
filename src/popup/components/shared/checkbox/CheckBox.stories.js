import partialAction from 'stories/partialAction'

import Checkbox from '.'

Checkbox.displayName = 'Checkbox'

export default {
  title: 'component/Checkbox',
  component: Checkbox,
  args: {
    label: 'Checkbox Label',
    isDisabled: false,
    defaultValue: true,
  },
}

export const Template = (args) => <Checkbox {...args} />
