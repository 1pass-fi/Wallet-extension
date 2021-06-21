import React, { useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import isEmpty from 'lodash/isEmpty'

import { exportNFT } from 'utils'
const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443,
})
import { GalleryContext } from '../../../../galleryContext'
import './index.css'

export default ({ description, setStage, stage, title, file, username }) => {
  const { setIsLoading, address, wallet } = useContext(GalleryContext)
  console.log({ setIsLoading, address, wallet })

  const handleUploadNFT = async () => {
    setIsLoading(true)
    try {
      if (file.size > 15 * 1024 ** 2) throw new Error('File too large')
      const url = URL.createObjectURL(file)
      const content = {
        title,
        owner: username,
        description,
      }
      const result = await exportNFT(
        arweave,
        address,
        content,
        url,
        null,
        wallet,
        file
      )
      console.log({ result })
      setIsLoading(false)
      return result
    } catch (err) {
      console.log(err.message)
      setIsLoading(false)
    }
  }

  if (stage == 1) {
    return (
      <button
        className='create-ntf-button'
        onClick={() => setStage(2)}
        disabled={isEmpty(title) | isEmpty(description)}
      >
        Create New NFT
      </button>
    )
  }

  if (stage == 2) {
    return (
      <button
        className='create-ntf-button'
        onClick={async () => {
          await handleUploadNFT()
          setStage(3)
        }}
      >
        Confirm Registration
      </button>
    )
  }

  return (
    <CopyToClipboard text='https://koi.registerlink.example'>
      <button className='create-ntf-button'>Copy Link to Share</button>
    </CopyToClipboard>
  )
}
