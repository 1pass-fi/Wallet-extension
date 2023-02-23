// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
// constants
import { STORAGE } from 'constants/koiConstants'
// assets
import ExportIcon from 'img/export-icon.svg'
import GoBackIcon from 'img/goback-icon-26px.svg'
import ImportIcon from 'img/import-icon.svg'
import PlusIcon from 'img/plus-icon-outline.svg'
import Button from 'shared/button'
// components
import Card from 'shared/card'
// utils
import { getChromeStorage } from 'utils'

// styles
import './index.css'

const CardOption = ({ SvgImage, title, description, path, onClick }) => {
  return (
    <Link onClick={onClick} style={{ textDecoration: 'none' }} to={path}>
      <Card className="option-card">
        <div className="card-title-wrapper">
          {SvgImage}
          <p className="card-title">{title}</p>
        </div>
        <div className="card-description">{description}</div>
      </Card>
    </Link>
  )
}

const AccountImport = ({ totalAccount }) => {
  const history = useHistory()

  const [selections, setSelections] = useState([])
  const [hasOldKey, setHasOldKey] = useState(false)

  const handleOnClick = (path) => {
    const url = chrome.runtime.getURL(path)
    chrome.tabs.create({ url })
  }

  const goBackAccountHome = () => {
    history.push('/account/')
  }

  useEffect(() => {
    const loadSelections = async () => {
      const storage = await getChromeStorage(STORAGE.PENDING_REQUEST)
      const hasPendingRequest = !!storage[STORAGE.PENDING_REQUEST]
      setSelections([
        {
          key: 1,
          SvgImage: <ImportIcon className="card-icon" />,
          title: chrome.i18n.getMessage('importSeedPhrase'),
          description: chrome.i18n.getMessage('import12WordSeedPhrase'),
          path: hasPendingRequest ? '/account/import/phrase' : '#',
          onClick: () => {
            handleOnClick('/options.html#/import-wallet')
          }
        },
        // {
        //   key: 2,
        //   SvgImage: <ExportIcon className='card-icon' />,
        //   title: 'Upload a .JSON wallet file',
        //   description: 'Import an existing wallet by uploading a .JSON file.',
        //   path: hasPendingRequest ? '/account/import/keyfile' : '#',
        //   onClick: () => {
        //     handleOnClick('/options.html#/upload-wallet')
        //   },
        // },
        {
          key: 2,
          SvgImage: <PlusIcon className="card-icon" />,
          title: chrome.i18n.getMessage('getANewWallet'),
          description: chrome.i18n.getMessage('startFromBeginning'),
          path: hasPendingRequest ? '/account/create' : '#',
          onClick: () => {
            handleOnClick('/options.html#/create-wallet')
          }
        }
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
    <div className="account-import" style={{ height: hasOldKey ? '600px' : '437px' }}>
      {hasOldKey && (
        <div className="recover-key">
          <div className="title">{chrome.i18n.getMessage('recover')+chrome.i18n.getMessage('myKeyLc')}</div>
          <div>{chrome.i18n.getMessage('multipleWalletsSupport')}</div>
          <div>
            {chrome.i18n.getMessage('recoverKeyMsgStart')}{' '}
            <b>{chrome.i18n.getMessage('recoverKeyMsgMiddle')}</b>{' '}
            {chrome.i18n.getMessage('recoverKeyMsgEnd')}
          </div>
          <div className="btn-wrapper">
            <Button
              onClick={() => history.push('/account/recovery')}
              label={chrome.i18n.getMessage('recover')+chrome.i18n.getMessage('myKey')}
            />
          </div>
        </div>
      )}
      <div className="account-import-header">
        {totalAccount > 0 && (
          <div
            data-tip={chrome.i18n.getMessage('back')}
            className="go-back-icon"
            onClick={goBackAccountHome}
          >
            <GoBackIcon />
          </div>
        )}
        <div className="get-started">{chrome.i18n.getMessage('letsGetStarted')}</div>
      </div>
      {selections.map((content) => (
        <CardOption {...content} />
      ))}
      <ReactTooltip place="top" type="dark" effect="float" />
    </div>
  )
}

const mapStateToProps = (state) => ({
  totalAccount: state.accounts.length
})

export default connect(mapStateToProps)(AccountImport)
