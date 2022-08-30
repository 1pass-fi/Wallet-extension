import partialAction from 'stories/partialAction'

import RemoveAccountModal from '.'

RemoveAccountModal.displayName = 'RemoveAccountModal'

export default {
  title: 'screen/RemoveAccountModal',
  component: RemoveAccountModal,
  args: {
    accountName: 'Account 1',
    accountAddress: '123456789012345678901234567890123456789012',
    onClose: partialAction('Closed'),
    onSubmit: partialAction('Submit')
  }
}

const Template = (args) => <RemoveAccountModal {...args} />

export const Default = Template.bind({})
