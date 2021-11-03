// modules
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

// assets
import ExportIcon from 'img/export-icon.svg'
import ImportIcon from 'img/import-icon.svg'
import PlusIcon from 'img/plus-icon-outline.svg'
import GoBackIcon from 'img/goback-icon-26px.svg'

// components
import Card from 'shared/card'
import Button from 'shared/button'

// utils
import { getChromeStorage } from 'utils'

// constants
import { STORAGE } from 'constants/koiConstants'

// styles
import './index.css'


const CardOption = ({ SvgImage, title, description, path, onClick }) => {
  return (
    <Link onClick={onClick} style={{ textDecoration: 'none' }} to={path}>
      <Card className='option-card'>
        <div className='card-title-wrapper'>
          {SvgImage}
          <p className='card-title'>{title}</p>
        </div>
        <div className='card-description'>{description}</div>
      </Card>
    </Link>
  )
}

export default () => {
  const history = useHistory()

  const [selections, setSelections] = useState([])
  const [popupPath, setPopupPath] = useState('')
  const [hasOldKey, setHasOldKey] = useState(false)

  const screenWidth = screen.availWidth
  const screenHeight = screen.availHeight

  const handleOnClick = (path) => {
    const url = chrome.extension.getURL(path)
    chrome.tabs.create({ url })
  }

  const goBackAccountHome = () => {
    history.push('/account/')
  }

  // const triggerPopup = performOnDifferentOs(
  //   (path) => {
  //     // On Windows
  //     const url = chrome.extension.getURL(path)
  //     chrome.windows.create({
  //       url,
  //       focused: true,
  //       type: 'popup',
  //       height: WINDOW_SIZE.WIN_HEIGHT,
  //       width: WINDOW_SIZE.WIN_WIDTH,
  //       left: Math.round((screenWidth - WINDOW_SIZE.WIN_WIDTH) / 2),
  //       top: Math.round((screenHeight - WINDOW_SIZE.WIN_HEIGHT) / 2),
  //     })
  //     window.close()
  //   },
  //   (path) => {
  //     // On Mac and others
  //     const url = chrome.extension.getURL(path)
  //     chrome.windows.create({
  //       url,
  //       focused: true,
  //       type: 'popup',
  //       height: WINDOW_SIZE.MAC_HEIGHT,
  //       width: WINDOW_SIZE.MAC_WIDTH,
  //       left: Math.round((screenWidth - WINDOW_SIZE.MAC_WIDTH) / 2),
  //       top: Math.round((screenHeight - WINDOW_SIZE.MAC_HEIGHT) / 2),
  //     })
  //     window.close()
  //   }
  // )

  useEffect(() => {
    const loadSelections = async () => {
      const storage = await getChromeStorage(STORAGE.PENDING_REQUEST)
      const hasPendingRequest = !!storage[STORAGE.PENDING_REQUEST]
      setSelections([
        {
          key: 1,
          SvgImage: <ImportIcon className='card-icon' />,
          title: 'Import with a seed phrase',
          description: 'Import an existing wallet using a 12-word seed phrase.',
          path: hasPendingRequest ? '/account/import/phrase' : '#',
          onClick: () => {
            handleOnClick('/options.html#/import-wallet')
          },
        },
        {
          key: 2,
          SvgImage: <ExportIcon className='card-icon' />,
          title: 'Upload a .JSON wallet file',
          description: 'Import an existing wallet by uploading a .JSON file.',
          path: hasPendingRequest ? '/account/import/keyfile' : '#',
          onClick: () => {
            handleOnClick('/options.html#/upload-wallet')
          },
        },
        {
          key: 3,
          SvgImage: <PlusIcon className='card-icon' />,
          title: 'Get a new wallet',
          description: 'Start from the beginning.',
          path: hasPendingRequest ? '/account/create' : '#',
          onClick: () => {
            handleOnClick('/options.html#/create-wallet')
          },
        },
      ])
    }

    loadSelections()
  }, [])

  useEffect(() => {
    const hasOldWallet = async () => {
      const key = await getChromeStorage('koiKey')
      if (key['koiKey']) setHasOldKey(true)
    }

    hasOldWallet()
  }, [])

  return (
    <div className='account-import' style={{height: hasOldKey ? '600px' : '437px'}}>
      {hasOldKey && <div className='recover-key'>
        <div className='title'>Recover my key</div>
        <div>We made some exciting updates to the latest version of Finnie, including multiple wallets and an Ethereum bridge.</div>
        <div>If you need a copy of your key or recovery phrase, get it here. <b>Never delete</b> the Finnie extension without first backing up a copy of your recovery phrase or key.</div>
        <div className='btn-wrapper'>
          <Button onClick={() => history.push('/account/recovery')} label='Recover My Key'/>
        </div>
      </div>}
      <div className='account-import-header'>
        <GoBackIcon data-tip='Back' className='go-back-icon' onClick={goBackAccountHome}/>
        <div className='get-started'>Let’s get started.</div>
      </div>
      {selections.map((content) => (
        <CardOption {...content} />
      ))}
      <ReactTooltip place='top' type="dark" effect="float"/>
    </div>
  )
}
