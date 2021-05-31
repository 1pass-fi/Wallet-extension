import SendKoiForm from '.'

SendKoiForm.displayName = 'SendKoiForm'

export default {
  title: 'screen/SendKoiForm',
  component: SendKoiForm,
  args: {
    koiBalance: 123456.45,
    arBalance: 456.45,
  }
}

const Template = (args) => <SendKoiForm {...args} />

export const Default = Template.bind({})
