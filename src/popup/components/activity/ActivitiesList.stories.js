import { ActivitiesList } from '.'

ActivitiesList.displayName = 'ActivitiesList'

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
  title: 'component/ActivitiesList',
  component: ActivitiesList,
  args: {
    activities: activities,
  }
}

const Template = (args) => <ActivitiesList {...args} />

export const Default = Template.bind({})
