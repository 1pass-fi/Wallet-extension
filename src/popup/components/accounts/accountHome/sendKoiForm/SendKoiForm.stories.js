import SendKoiForm from '.' 

SendKoiForm.displayName = 'SendKoiForm'

const currencies = [
  {
    id: 'KOI',
    value: 'KOI',
    label: 'KOI',
  }, {
    id: 'AR',
    value: 'AR',
    label: 'AR',
  }
]

export default {
  title: 'screen/SendKoiForm',
  component: SendKoiForm,
  args: {
    koiBalance: 123456.45,
    arBalance: 456.45,
    currencies: currencies,
  }
}

const Template = (args) => <SendKoiForm {...args} />

export const Default = Template.bind({})
