import AccountSettingRow from '.'

AccountSettingRow.displayName = 'AccountSettingRow'

export default {
  title: 'component/AccountSettingRow',
  component: AccountSettingRow,
  args: {
    accountName: 'Account 1'
  }
}

const Template = (args) => <AccountSettingRow {...args} />

export const Default = Template.bind({})
