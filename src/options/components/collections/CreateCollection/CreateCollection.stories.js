import CreateCollection from '.'

CreateCollection.displayName = 'CreateCollection'

const customViewports = {
  macbook: {
    name: 'macbook',
    styles: {
      width: '1920px',
      height: '1080px'
    }
  }
}

const Wrapper = () => (
  <div className='wrapper'>

  </div>
)

export default {
  title: 'screen/CreateCollection',
  component: CreateCollection,
  parameters: {
    
    viewport: {
      viewports: customViewports,
      defaultViewport: 'macbook',
    },
    backgrounds: {
      default: 'dark'
    }
  }
}

export const Default = () => <CreateCollection />
