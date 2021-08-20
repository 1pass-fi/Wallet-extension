import InputPassword from '.'

InputPassword.displayName = 'InputPassword'

export default {
  title: 'screen/InputPassword',
  component: InputPassword,
}

export const Default = () => (
  <div
    style={{
      background: 'linear-gradient(90deg, #030332 0%, #171753 100%)',
      width: '1200px',
    }}
  >
    {' '}
    <InputPassword />
  </div>
)
