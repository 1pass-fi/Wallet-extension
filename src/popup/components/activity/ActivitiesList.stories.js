import { ActivitiesList } from '.'

ActivitiesList.displayName = 'ActivitiesList'

const activities = [
  {
    activityName: 'Create new NFT',
    expense: null,
    date: new Date('04-21-2021'),
    pending: false,
  }, {
    activityName: 'Sent KOI',
    expense: 10,
    date: new Date('04-21-2021'),
    pending: true,
    source: '12345678912345678912345678912345678923456'
  }, {
    activityName: 'Sent AR',
    expense: 0,
    date: new Date('04-21-2021'),
    pending: false,
    source: '12345678912345678912345678912345678923456'
  }, {
    activityName: 'Received KOI',
    expense: 450,
    date: new Date('04-21-2021'),
    pending: true,
    source: '12345678912345678912345678912345678923456'
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
