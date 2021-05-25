import ActivityRow from '.'

ActivityRow.displayName = 'ActivityRow'

export default {
  title: 'component/ActivityRow',
  component: ActivityRow,
  args: {
    activityName: 'Purchased “The Balance of Koi”',
    expense: -450,
    accountName: 'Account #1',
    date: new Date('04-21-2021')
  }
}

const Template = (args) => <ActivityRow {...args} />

export const Default = Template.bind({})
