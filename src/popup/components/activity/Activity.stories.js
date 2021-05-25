import Activity from '.'

Activity.displayName = 'Activity'

const activities = [
  {
    activityName: 'Purchased “The Balance of Koi”',
    expense: -450,
    accountName: 'Account #1',
    date: new Date('04-21-2021')
  }, {
    activityName: 'Purchased “The Balance of Koi”',
    expense: -450,
    accountName: 'Account #1',
    date: new Date('04-21-2021')
  }, {
    activityName: 'Purchased “The Balance of Koi”',
    expense: -450,
    accountName: 'Account #1',
    date: new Date('04-21-2021')
  }, {
    activityName: 'Purchased “The Balance of Koi”',
    expense: -450,
    accountName: 'Account #1',
    date: new Date('04-21-2021')
  }
]

export default {
  title: 'component/Activity',
  component: Activity,
  args: {
    activities: activities,
  }
}

const Template = (args) => <Activity {...args} />

export const Default = Template.bind({})
