import React from 'react'

import NFTCard from './nftCard'
import './index.css'

export default () => {
  const { title, views, earnedKoi, description, nfts } = {
    title: 'Collection Title',
    views: 4571,
    earnedKoi: 451.895,
    description:
      'Description: Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet veniam consequat sunt nostrud amet.',
    nfts: [
      {
        txId: '1',
        name: 'NFT abc1',
        contentType: 'image',
        url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.duhoctrungquoc.vn%2Fwiki%2Fen%2FHello!&https://www.duhoctrungquoc.vn/wiki/en/File:-127wiki.jpgpsig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAD',
      },
      {
        txId: '2',
        name: 'NFT abc2',
        contentType: 'image',
        url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-vector%2Fhello-illustration_1055182.htm&psig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAJ',
      },
      {
        txId: '3',
        name: 'NFT abc3',
        contentType: 'image',
        url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fduhoctoancau.com%2Fhello-kham-pha-nhung-dieu-thu-vi-796%2F&psig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAO',
      },
      {
        txId: '4',
        contentType: 'image',
        url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.duhoctrungquoc.vn%2Fwiki%2Fen%2FHello!&https://www.duhoctrungquoc.vn/wiki/en/File:-127wiki.jpgpsig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAD',
      },
      {
        txId: '5',
        contentType: 'image',
        url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-vector%2Fhello-illustration_1055182.htm&psig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAJ',
      },
      {
        txId: '6',
        contentType: 'image',
        url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fduhoctoancau.com%2Fhello-kham-pha-nhung-dieu-thu-vi-796%2F&psig=AOvVaw001vjUxPbDK02LlKzY-6Ay&ust=1625559688257000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCPDd0fG_y_ECFQAAAAAdAAAAABAO',
      },
    ],
  }

  return (
    <div className='collection-details-wrapper'>
      <div className='collection-details'>
        <div className='title'>{title}</div>
        <div className='views'>{views} Views</div>
        <div className='earned-koi'>{earnedKoi} KOII earned</div>
        <div className='description'>{description}</div>
        <div className='cards'>
          {nfts.map((nft) => (
            <NFTCard nft={nft} />
          ))}
        </div>
      </div>
    </div>
  )
}
