import InputField from '.'

InputField.displayName = 'InputField'

export default {
  title: 'component/InputField',
  component: InputField,
  argTypes: {
    onChange: { action: 'onChange' }
  },
}

const Template = (args) => <InputField {...args} />

export const Password = Template.bind({})
Password.args = {
  label: 'password',
  value: null,
}
