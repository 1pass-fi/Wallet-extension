import Select from '.'

Select.displayName = 'Select'

const options = [
  {
    id: 1,
    label: 'KOI',
    value: 'KOI',
  }, {
    id: 2,
    label: 'AR',
    value: 'AR',
  }
]

export default {
  title: 'component/Select',
  component: Select,
  args: {
    placeholder: 'Please select currency',
    label: '',
    options: options,
  },
}

export const Template = (args) => <Select {...args} />
