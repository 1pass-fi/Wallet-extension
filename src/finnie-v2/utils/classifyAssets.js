import filter from 'lodash/filter'

const classifyAssets = (assets, collections) => {
  try {
    // add collection name to nfts
    return assets.map(asset => {
      const collectionNames = collections.filter(collection => collection.collection?.includes(asset.txId)).map(collection => collection.name)

      asset.collection = collectionNames ? collectionNames : []
      return asset
    })
  } catch (error) {
    console.log('Fail to classify assets: ', error)
    return assets
  }
}

export default classifyAssets