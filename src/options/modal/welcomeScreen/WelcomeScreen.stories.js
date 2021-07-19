import WelcomeScreen from '.'

WelcomeScreen.displayName = 'WelcomeScreen'

export default {
  title: 'component/WelcomeScreen',
  component: WelcomeScreen,
}

export const Default = () => (
  <div
    style={{ background: 'linear-gradient(90deg, #030332 0%, #171753 100%)' }}
  >
    <WelcomeScreen />
  </div>
)
