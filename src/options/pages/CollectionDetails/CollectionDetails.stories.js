import CollectionDetails from '.'

CollectionDetails.displayName = 'CollectionDetails'

export default {
  title: 'screen/CollectionDetails',
  component: CollectionDetails,
}

export const Default = () => (
  <div
    style={{
      background: 'linear-gradient(90deg, #030332 0%, #171753 100%)',
      width: '1200px',
    }}
  >
    {' '}
    <CollectionDetails />
  </div>
)
