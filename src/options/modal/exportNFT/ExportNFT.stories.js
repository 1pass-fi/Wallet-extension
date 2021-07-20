import ExportNFT from '.'

ExportNFT.displayName = 'ExportNFT'

export default {
  title: 'component/ExportNFT',
  component: ExportNFT,
}

export const Default = () => (
  <div
    style={{ background: 'linear-gradient(90deg, #030332 0%, #171753 100%)' }}
  >
    <ExportNFT />
  </div>
)
