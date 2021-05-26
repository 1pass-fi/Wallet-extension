import ExportPrivateKeyModal from '.'

ExportPrivateKeyModal.displayName = 'ExportPrivateKeyModal'

export default {
  title: 'component/ExportPrivateKeyModal',
  component: ExportPrivateKeyModal,
  args: {},
}

const Template = (args) => <ExportPrivateKeyModal {...args} />

export const Default = Template.bind({})
