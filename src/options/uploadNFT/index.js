import React, { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import UploadNFTIcon from 'img/uploadNFT-icon.svg'
import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import { exportNFT } from 'utils'
import { koi } from 'background'

import './index.css'

const arweave = Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443, })
const key = {'kty':'RSA','e':'AQAB','n':'yUluur99hdvq-mtTrmr-dvoPuElPz0H2A4-u35tSF8Y0pQ4sIJumFWtVRobjv0rTs3pzib7wnoewwe5iqxbbFrkWDfyi9vK_4Wkf_m46ejd6Lzz5xQfi5vEOf2LSg2UdtaxJN4z9ZGwvYQOH2AWXsa9m1ALMlI_kB_UIMTGc4h_flRCJaJF9tps-3FVuhpD6dhc59nR6eRo5jfDW44YgGBjtgmGVXgQzrW197enci4cdpPK2JoYGZA1c7I42n45BJO74qgiE4ommRC-aVT38pQLBunnJ9w3SHhHorpjVrhpxwwl40fwh7LR-BrP9sAe2fj9P2Xmc10z4yRvM4CQ4MMyJwa-RxD96cV71UMLMPd7207C2AS72WYD6L2iIoi6g-z8V9mBl6QOMLWqnfT4fR27Yl49W8bqu_rg1VhdCNec5j9NxcOtm9bomAhgXVmK7Qnbvy0Bh1iatWaEg7HVuY5IfBO9RJPsqD97bg1mAsjwmAyt-aN02PCZDUsZ_7qT11PMA8KBdraKEoe4wjO2wfytAsmW9jAuCHX5FEQK_QHDqInm0iho8KpHamB1qfqO81IC67PL4W9otMyrZAHHWMzGykwREUAjQ7kOaR2OurC8GSxpjQl8GXXwGvM3j5K-SP69WHEjTLrZiYj1n6Kfz90ntFFIRhbAQmQbti1UpRw0','d':'Go7UzFENt8avd0EH9oBpeLs_rboGjLsQQaIImbo9l6NwOMLo8Zh3zmWuB7Mug4PU8N5cNjV6PAB9Quk4HYjTeWkMTuYhfmHDDXO4Y_KZRpzhQzBRaDzFJGFz3zzjt7B0vg6wTmMM394iVjOIDemW_Tu-XoTMB2IA3UfoP81i_Lbl4h4fcyuXIavUHHAtOBYS5dfkru7pZece5up6_-QngeZwF_7WHWSCiQRkVCrCDarTL3tSqzyNxU-6DgAplt3HHJ9nMdAT8GvnAyIgw9R87Cyz8O22xyEMsyj7wWWq8-DLV8d9KH-S3k9mPW4sL7ikzH2ABJq2JfYi8S341y4QN6wf5VtNHt-FODdmueSTzEMzc7n0x4DNL2TiH6ijjrZy5qTukuZBGEbVbtUgHizX5mUUn9r6jNwuhvjsl0Oco9HhWHwlkC90QQHVG1HrCBtwPHoUThrvS2gFBJgLeJ8yXUDTr8ff-GUYi4pLjmChHctdxkql06faRjMWgLZKiiHHj4AnPvgn87hJynfBjUkoMq7Ht7tgyqDedVEjXjkJfd6NIOJPM1NY0GqCRc0wHlcHqwiuqDwug2eLeMQiYjIoycO-Nj1pBp_mNTZ48X1GjBZjs8FXsixBv2q6rTgUNCkLtrMrgNJ6LY_h4TLY3tYIBHvu-m5gWIK26PBz7YmwGqU','p':'7PwmYvTXC05fNyI2IOJ5EVSaJ3spRt8g4e8NIAgT-eK4S5lOUh0zkPNU4jOC9yIpgY-ns9lZiAQAQbfNl6MeXoiJ1odQ9ebqF95l5Mr7QRdndmBhyJ3aj24RAwduu-0I8xGQsHh-e44el_VNrLeTRK7s5mgXXsfvMsumdEtkvjlfBv2Ls_SbMC35nYdRi3CjxBmeJ2xklfLYV60x1wzikU9cxLXDiCAxhHRQf-aYW7srpZeCEKJg_is3-2XNq6UpGnx3c6wAmHaTK6ini_k8Ig-mOTQNN6U538bna-JtnKieIhycDrob1sIbSqmsW_VZdwVFvRFYRcCAbrQXumld6w','q':'2XAEL6yVMmSgIDe5k4EeGAqHD6dz8NVm7CafG43tRQIV1koQvxbOu6SMyQZADxdPk32MTiu9XGaC9t-U3iAhUWmxTR1kWPZOa_MzMD0Mkt8ZUA7MsufiYxleylQXLjYNsz7RfJTYcPTFK1VjeClqYzZ_YxL-V1Lp8GW1W2AioJwIvqo36TchidSMQykJzY46WVChV1F6x5CRODfKb0t9ZvYuf37NIIIejZnnHerSnmVAR0wCYYd2lGU1yV2EaRUQeEJk_31l0q2iGOqMvZDdLc1mLG24MJbS5CifzcmQBigEhtp3jZX6kMXu4SfCac_TBtHye7HI9ihQ-44nUnaY5w','dp':'D-G2ENunrbJK3z8DsaB7zJWG3y55za4WXg3PK15fOFfhUe-sOASM-CHWhnI9TKKVdYFTE9J1FZBvE_hlZswftOYhlqbq3g_jkEXvPi38OJiA7oX3B6LMiuAtc66D1URFXUTIFYt9rnoPws9FrVWAIRI3_hjruAZeGWFcfl6vGbBuleFYA29ZFxl9qPjwlg-uae3tk2bINuRXa0jIFklexa4z4VrtB6pgpyfEXU3u1_brLeXBaav4JBBxZ_-ikOY4ovXEa5QTViRcKIjc8Zx6Uy4JTbwXRqtj_YMu7yP1hJIoRtD0BGikhPftLEvCqUb__-HykoEfEU2dTc3z6SI2kQ','dq':'G0WtgL1IyVVNsDzNDe838xP-9LuwExjxG9WMR0x54hns2z_W8eDOdUKiVeRuzHXECV_J5VQfICPLcWOBrIqjIy76ig2RtIbQN0H9vaMqnJFW_2-bxSTIhF1-Qiph7e3hsgXDCLkynJhW0qSXIU8whNklCSwsso83wGtBYACi1zo67o8zDBFaJ4t9PD89d4bLUsCGPAmAON-tFzwILAVv6SYfluY0nEs1wdT35Ay79hoFAexKsCjpeptnL6aHIRb_RdYuDM2Ro-cbWbyxgmVVGJWWpyPr4kxIj015HbqWUe9bAf8M17lkAByTZbIy9EqY0VYr78_QwO81mRevXux5KQ','qi':'TsPOnSHSRaj3mEZPt4dxAlB8-Jhig9qVJRv_SOPMZY8nqhSN09ltiVFEdBdcPEYwoCcPl8on9vKayfadMDzCZQ4t5qcnC9a38Y8Mdu3p2LXThhaZwLzWvtKXh9gZr9tOG-WBwN9Va2IPqR-lCINEnRpQ5c9PRZPchVwms1oWqvPzp_FiUSdGt6ZjwrsC9lgIl9GKaMtw6PIouX42sUmShUkHBcrhx4AuhENQyCmP29dztFqCdFVq1dWkb04KgEFYSSrK9y00ymIr7iBFzBOvqOx5wt2RRYawQKwflsq2X3XwseW8kVQyP85zXFBkPASatDHJYcQ2W0-gBn1i-N1wbg'}
koi.wallet = key
koi.address = '6VJYLb6lvBISrgRbhd1ODHzJ1xAh3ZA3OdSY20E88Bg'

const DragActive = ({ className = '' }) => {
  return (
    <div className={className + ' drag-active'}>
      <div className='description'>
        <div className='description-title'>Create an Atomic NFT</div>
        <div className='description-detail'>
          Drop your file here to store it forever and start earning attention
          rewards.
        </div>
        <UploadNFTIcon className='upload-nft-icon' />
      </div>
    </div>
  )
}

const UploadFormHeader = ({ stage }) => {
  if (stage != 3)
    return (
      <>
        <div className='description-title'>Create an Atomic NFT</div>
        <div className='description-detail'>
          Drop your file here to store it forever and start earning attention
          rewards.
        </div>
      </>
    )

  return (
    <>
      <div className='description-title'>
        Congratulations! Your new NFT is ready for action
      </div>
      <div className='description-detail'>
        Share your newly minted NFT with everyone you know to start earning
        attention rewards.
      </div>
    </>
  )
}

const BodyContent = ({
  stage,
  title,
  description,
  username,
  setDescription,
  setTitle,
  setUsername,
}) => {
  if (stage == 1) {
    return (
      <div className='right-column stage1'>
        <div className='field'>
          <label className='field-label'>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='field-input'
          ></input>
        </div>
        <div className='field'>
          <label className='field-label'>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='field-input'
          ></input>
        </div>
        <div className='field'>
          <label className='field-label'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='field-input'
          />
        </div>
      </div>
    )
  }

  if (stage == 2) {
    return (
      <div className='right-column stage2'>
        <div className='ntf-preview-infomation'>
          <div className='preview-info'>{title}</div>
          <div className='preview-info'>{username}</div>
          <div className='preview-info'>{description}</div>
        </div>
        <div className='estimate-cost'>
          <div className='estimate-cost-title'>Estimated Costs</div>
          <div className='estimate-ar'>0.0002 AR</div>
          <div className='estimate-koi'>1.00 KOI</div>
        </div>
      </div>
    )
  }

  return (
    <div className='right-column stage3'>
      <div className='preview-info'>{title}</div>
      <div className='preview-info'>{username}</div>
    </div>
  )
}

const BottomButton = ({ description, setStage, stage, title, file, username, setIsLoading }) => {
  const handleUploadNFT = async () => {
    console.log('RUNNING')
    setIsLoading(true)
    try {
      if (file.size > 15*1024**2) throw new Error('File too large')
      const url = URL.createObjectURL(file)
      const content = {
        title,
        owner: username,
        description
      }
      const result = await exportNFT(arweave, koi.address, content, url, null, koi.wallet, file)
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
      <button className='create-ntf-button' onClick={async () => {
        await handleUploadNFT()
        setStage(3)
      }
      }>
        Confirm Registration
      </button>
    )
  }

  // if (stage == 3) {
  //   <button className='create-ntf-button' onClick={async () => {
  //     console.log('RUNNING')
  // await handleUploadNFT()
  // setStage(4)
  //   }}>Confirm Registration</button>
  // }

  return (
    <CopyToClipboard text='https://koi.registerlink.example'>
      <button className='create-ntf-button'>Copy Link to Share</button>
    </CopyToClipboard>
  )
}

const UploadForm = ({ file, onClearFile, onCloseUploadModal, setIsLoading }) => {
  const [stage, setStage] = useState(1)
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')
  const url = useMemo(() => URL.createObjectURL(file), [file])
  const onGoBack = () => {
    if (stage != 1) {
      setStage(stage - 1)
    } else {
      onClearFile()
    }
  }
  
  return (
    <div className='upload-form'>
      <UploadFormHeader stage={stage} />

      <div className='nft-infomation'>
        <div className='left-column'>
          <img src={url} className='nft-image' />
        </div>
        <BodyContent
          stage={stage}
          title={title}
          setTitle={setTitle}
          username={username}
          setUsername={setUsername}
          description={description}
          setDescription={setDescription}
          username={username}
        />
      </div>
      <BottomButton
        stage={stage}
        setStage={setStage}
        title={title}
        description={description}
        file={file}
        username={username}
        setIsLoading={setIsLoading}
      />
      <div className='close-button' onClick={onCloseUploadModal}>
        <CloseIcon />
      </div>
      <div className='goback-button' onClick={onGoBack}>
        <GoBackIcon />
      </div>
    </div>
  )
}

export default ({ file, isDragging, onClearFile, onCloseUploadModal, setIsLoading }) => {
  console.log({ isDragging })
  console.log({ setIsLoading })
  if (!isDragging) {
    return <div></div>
  }

  return (
    <div className='uploadNFT-wrapper'>
      <div className={`uploadNFT`}>
        {isEmpty(file) ? (
          <DragActive />
        ) : (
          <UploadForm
            file={file}
            onClearFile={onClearFile}f
            onCloseUploadModal={onCloseUploadModal}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </div>
  )
}
