import CollectionCard from '.'

CollectionCard.displayName = 'CollectionCard'

export default {
  title: 'component/CollectionCard',
  component: CollectionCard,
  args: {
    collection: {
      id: '1234',
      name: 'Collection 1',
      nfts: [
        {
          txId: '1',
          contentType: 'image',
          url:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.duhoctrungquoc.vn%2Fwiki%2Fen%2FHello!&https://www.duhoctrungquoc.vn/wiki/en/File:-127wiki.jpgpsig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAD',
        },
        {
          txId: '2',
          contentType: 'image',
          url:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-vector%2Fhello-illustration_1055182.htm&psig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAJ',
        },
        {
          txId: '3',
          contentType: 'image',
          url:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fduhoctoancau.com%2Fhello-kham-pha-nhung-dieu-thu-vi-796%2F&psig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAO',
        },
      ],
      view: 100,
      earnedKoi: 400.125596,
      contributors: 4,
      pieces: 3,
      tags: ['crypto', 'electropop', 'kitty', 'hello', 'image'],
      koiRockUrl: 'https://koi.rocks/',
    },
  },
}

const Template = (args) => (
  <div
    style={{
      background: 'linear-gradient(90deg, #030332 0%, #171753 100%)',
      height: '500px',
    }}
  >
    {' '}
    <CollectionCard {...args} />
  </div>
)

export const Default = Template.bind({})
