import ActivityRow from '.'

ActivityRow.displayName = 'ActivityRow'

export default {
  title: 'component/ActivityRow',
  component: ActivityRow,
  args: {
    activityName: 'Received AR',
    expense: 450,
    date: new Date('04-21-2021'),
    source: '1234567891234567812345678',
    id: '12345',
    pending: false
  }
}

const Template = (args) => <ActivityRow {...args} />

export const Default = Template.bind({})
