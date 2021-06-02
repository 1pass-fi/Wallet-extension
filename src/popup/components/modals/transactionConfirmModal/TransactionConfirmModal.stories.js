import TransactionConfirmModal from '.'
import partialAction from 'stories/partialAction'

TransactionConfirmModal.displayName = 'TransactionConfirmModal'

export default {
  title: 'screen/TransactionConfirmModal',
  component: TransactionConfirmModal,
  args: {
    sentAmount: 12,
    accountAddress: '123456789012345678901234567890123456789012',
    onClose: partialAction('Closed'),
    onSubmit: partialAction('Submit')
  }
}

const Template = (args) => <TransactionConfirmModal {...args} />

export const Default = Template.bind({})
