import EditAccountNameModal from '.'
import partialAction from 'stories/partialAction'

EditAccountNameModal.displayName = 'EditAccountNameModal'

export default {
  title: 'screen/EditAccountNameModal',
  component: EditAccountNameModal,
  args: {
    currentName: 'Account #1',
    onClose: partialAction('Closed'),
    onSubmit: partialAction('Submit')
  }
}

const Template = (args) => <EditAccountNameModal {...args} />

export const Default = Template.bind({})
