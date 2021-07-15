import { ExportBackupPhraseModal } from '.'

ExportBackupPhraseModal.displayName = 'ExportBackupPhraseModal'

export default {
  title: 'component/ExportBackupPhraseModal',
  component: ExportBackupPhraseModal,
  args: {
    account: {
      name: 'Account #1',
      address: '123456789012345678900987654321234',
      seedPhrase: [
        'shoelace',
        'bookstore',
        'divulge',
        'restaurant',
        'potato',
        'infant',
        'leaflet',
        'solar',
        'maritime',
        'photograph',
        'balloon',
        'museum',
      ],
    },
  },
}

export const Template = (args) => (
  <div
    style={{
      width: '1200px',
      height: '600px',
      background: 'linear-gradient(90deg, #030332 0%, #171753 100%)',
      position: ' relative',
    }}
  >
    <ExportBackupPhraseModal {...args} />
  </div>
)

export const Default = Template.bind({})
