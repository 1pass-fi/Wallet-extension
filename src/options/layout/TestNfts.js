import React, {useState} from 'react'

import mockCreateNfts from 'utils/createNfts/mockCreateNfts'
import createCollection from 'utils/createNfts/createCollection'

export default () => {
  const handleCreateNfts = async () => {
    const address = '6VJYLb6lvBISrgRbhd1ODHzJ1xAh3ZA3OdSY20E88Bg'
    const collectionData = { collection: [] }
    const collectionId = await createCollection({ nfts, setNfts, address, collectionData })

    console.log('nft ids', nftIds)
  }

  const initialNfts = [
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 1',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false,
      url: 'https://arweave.net/fpIR7zEBHbIvuQ7YgnuLCWCue4fO22VFqFCFGkftTps'
    },
    // {
    //   info: {
    //     isNSFW: true,
    //     ownerName: 'Minh Vu',
    //     ownerAddress: 'asdkjakdkajshdkads',
    //     title: 'NFT 2',
    //     description: 'Description 1',
    //     tags: [],
    //     contentType: 'image',
    //     createdAt: 0
    //   },
    //   uploaded: false,
    //   url: 'https://arweave.net/LzJhnpDCzM4c73LdgqZkWkgI18dodkT5-z8mfWShL8Y'
    // },
    // {
    //   info: {
    //     isNSFW: true,
    //     ownerName: 'Minh Vu',
    //     ownerAddress: 'asdkjakdkajshdkads',
    //     title: 'NFT 3',
    //     description: 'Description 1',
    //     tags: [],
    //     contentType: 'image',
    //     createdAt: 0
    //   },
    //   uploaded: false,
    //   url: 'https://arweave.net/aYZKoh1eLSaE2TOx8GmQJmjLcrKrgrMpfl4UeGqQuuU'
    // },
    // {
    //   info: {
    //     isNSFW: true,
    //     ownerName: 'Minh Vu',
    //     ownerAddress: 'asdkjakdkajshdkads',
    //     title: 'NFT 4',
    //     description: 'Description 1',
    //     tags: [],
    //     contentType: 'image',
    //     createdAt: 0
    //   },
    //   uploaded: false,
    //   url: 'https://arweave.net/DSE9f3Oo5sqON6cqh1gzMJbn2o0CSplLlyj4DC0VHJM'
    // },
    // {
    //   info: {
    //     isNSFW: true,
    //     ownerName: 'Minh Vu',
    //     ownerAddress: 'asdkjakdkajshdkads',
    //     title: 'NFT 5',
    //     description: 'Description 1',
    //     tags: [],
    //     contentType: 'image',
    //     createdAt: 0
    //   },
    //   uploaded: false,
    //   url: 'https://arweave.net/arhvmVqVHWsk7IXa0aSZmnLyet9-YmZXGeBvEjgGSXI'
    // }
  ]

  const [nfts, setNfts] = useState(initialNfts)

  return (
    <div style={{padding:'20px', textAlign:'center'}}>
      {nfts.map((nft, index) => (
        <div
          style={{
            color: nft.uploaded ? 'green' : 'whitesmoke'
          }}
        >{nft.info.title}</div>
      ))
      }
      <button style={{backgroundColor: 'whitesmoke'}} onClick={handleCreateNfts}>Upload</button>
    </div>
  )
}
