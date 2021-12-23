import React, {useState} from 'react'

import mockCreateNfts from 'utils/createNfts/mockCreateNfts'

export default () => {
  const handleCreateNfts = async () => {
    const nftIds = await mockCreateNfts(nfts, setNfts)

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
      file: 'file object'
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 2',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 3',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 4',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 5',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 6',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 7',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 8',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 9',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    },
    {
      info: {
        isNSFW: true,
        ownerName: 'Minh Vu',
        ownerAddress: 'asdkjakdkajshdkads',
        title: 'NFT 10',
        description: 'Description 1',
        tags: [],
        contentType: 'image',
        createdAt: 0
      },
      uploaded: false
    }
  ]

  const [nfts, setNfts] = useState(initialNfts)

  return (
    <div>
      {nfts.map((nft, index) => (
        <div
          style={{
            color: nft.uploaded ? 'green' : 'whitesmoke'
          }}
        >{nft.info.title}</div>
      ))
      }
      <button onClick={handleCreateNfts}>Upload</button>
    </div>
  )
}
